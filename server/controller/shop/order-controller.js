const mongoose = require("mongoose");
const {
  createPayment,
  executePayment,
  getPayment,
} = require("../../helper/paypal");
const Order = require("../../model/order");
const Product = require("../../model/Product");
const Cart = require("../../model/cart");
const {
  CheckoutError,
  reserveStock,
  releaseStock,
  toCents,
} = require("../../helper/stock");

const CURRENCY = "USD";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const fromCents = (cents) => (cents / 100).toFixed(2);

const createOrder = async (req, res) => {
  try {
    // Only identity, cart and address come from the client. Prices, totals and
    // statuses are computed here so the client can't change what gets charged.
    const { userId, cartId, addressInfo } = req.body;

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(cartId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user or cart" });
    }
    if (!addressInfo || !addressInfo.address) {
      return res
        .status(400)
        .json({ success: false, message: "Please select an address" });
    }

    const cart = await Cart.findOne({ _id: cartId, userId });
    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Your cart is empty" });
    }

    const products = await Product.find({
      _id: { $in: cart.items.map((i) => i.productId) },
    });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let totalCents = 0;
    const cartItems = [];
    for (const item of cart.items) {
      const product = productMap.get(item.productId.toString());
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "A product in your cart is no longer available",
        });
      }
      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.totalStock} left of ${product.title}`,
        });
      }

      const unitCents = toCents(
        product.salePrice > 0 ? product.salePrice : product.price
      );
      totalCents += unitCents * item.quantity;
      cartItems.push({
        productId: product._id.toString(),
        title: product.title,
        image: product.image,
        price: unitCents / 100,
        quantity: item.quantity,
      });
    }

    const payment = await createPayment({
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `${CLIENT_URL}/shop/paypal-return`,
        cancel_url: `${CLIENT_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: fromCents(toCents(item.price)),
              currency: CURRENCY,
              quantity: item.quantity,
            })),
          },
          amount: { currency: CURRENCY, total: fromCents(totalCents) },
          description: "Order payment",
        },
      ],
    });

    const approvalURL = payment.links.find(
      (link) => link.rel === "approval_url"
    ).href;

    const now = new Date();
    const order = await Order.create({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCents / 100,
      orderDate: now,
      orderUpdateDate: now,
      // PayPal's payment id. capturePayment checks the id PayPal sends back against it.
      paymentId: payment.id,
      // The EC-... token PayPal puts on both the return and cancel redirects.
      // The cancel redirect has no paymentId, so this is how we match it.
      paypalToken: new URL(approvalURL).searchParams.get("token"),
      payerId: "",
    });

    res.status(201).json({ success: true, approvalURL, orderId: order._id });
  } catch (e) {
    console.log(e.response || e);
    res.status(500).json({
      success: false,
      message: "Error while creating paypal payment",
    });
  }
};

// Run the PayPal execute call. If PayPal says the payment was already executed
// (e.g. we crashed after charging but before saving), fetch it instead so we
// can still verify and finish the order.
async function executeOrFetch(paymentId, payerId) {
  try {
    return await executePayment(paymentId, { payer_id: payerId });
  } catch (err) {
    if (err.response && err.response.name === "PAYMENT_ALREADY_DONE") {
      return getPayment(paymentId);
    }
    throw err;
  }
}

// Make sure the payment PayPal returned is the one we expect for this order.
function verifyPayment(payment, order, payerId) {
  const tx = payment.transactions && payment.transactions[0];
  const sale =
    tx &&
    tx.related_resources &&
    tx.related_resources.find((r) => r.sale) &&
    tx.related_resources.find((r) => r.sale).sale;

  const problems = [];
  if (payment.id !== order.paymentId) problems.push("payment id mismatch");
  if (payment.state !== "approved") problems.push(`state=${payment.state}`);
  if (payment.payer?.payer_info?.payer_id !== payerId)
    problems.push("payer id mismatch");
  if (!tx || tx.amount.currency !== CURRENCY) problems.push("currency mismatch");
  if (!tx || toCents(tx.amount.total) !== toCents(order.totalAmount))
    problems.push("amount mismatch");
  if (!sale || sale.state !== "completed")
    problems.push(`sale state=${sale && sale.state}`);
  return problems;
}

const capturePayment = async (req, res) => {
  const { paymentId, payerId, orderId } = req.body;

  if (!paymentId || !payerId || !mongoose.isValidObjectId(orderId)) {
    return res
      .status(400)
      .json({ success: false, message: "Missing payment details" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order can not be found" });
    }

    // The payment must be the one created for this order.
    if (order.paymentId !== paymentId) {
      return res
        .status(400)
        .json({ success: false, message: "Payment does not match this order" });
    }

    // Idempotency: a refresh or second request after success just returns the order.
    if (order.paymentStatus === "paid") {
      return res
        .status(200)
        .json({ success: true, message: "Order confirmed", data: order });
    }

    // Atomically claim the order so two concurrent requests can't both
    // execute the payment and take stock twice.
    const claimed = await Order.findOneAndUpdate(
      { _id: orderId, paymentStatus: "pending" },
      { $set: { paymentStatus: "processing", orderUpdateDate: new Date() } },
      { new: true }
    );
    if (!claimed) {
      const current = await Order.findById(orderId);
      if (current.paymentStatus === "paid") {
        return res
          .status(200)
          .json({ success: true, message: "Order confirmed", data: current });
      }
      return res.status(409).json({
        success: false,
        message: `Payment is ${current.paymentStatus}, please wait or contact support`,
      });
    }

    // Take stock before charging so we never charge for items we can't ship.
    let reserved;
    try {
      reserved = await reserveStock(claimed.cartItems);
    } catch (err) {
      await Order.updateOne(
        { _id: orderId },
        { $set: { paymentStatus: "pending", orderUpdateDate: new Date() } }
      );
      throw err;
    }

    let payment;
    try {
      payment = await executeOrFetch(paymentId, payerId);
    } catch (err) {
      // Not charged: give stock back and allow a retry.
      console.log("PayPal execute failed", err.response || err);
      await releaseStock(reserved);
      await Order.updateOne(
        { _id: orderId },
        { $set: { paymentStatus: "pending", orderUpdateDate: new Date() } }
      );
      throw new CheckoutError(402, "PayPal could not complete the payment");
    }

    const problems = verifyPayment(payment, claimed, payerId);
    if (problems.length) {
      // PayPal accepted the execute call but the result doesn't match the
      // order. Flag it for manual review instead of confirming.
      console.log(`Payment verification failed for order ${orderId}:`, problems);
      await releaseStock(reserved);
      await Order.updateOne(
        { _id: orderId },
        {
          $set: {
            paymentStatus: "failed",
            orderStatus: "payment_review",
            payerId,
            orderUpdateDate: new Date(),
          },
        }
      );
      throw new CheckoutError(
        402,
        "Payment could not be verified, please contact support"
      );
    }

    claimed.paymentStatus = "paid";
    claimed.orderStatus = "confirmed";
    claimed.payerId = payerId;
    claimed.orderUpdateDate = new Date();
    await claimed.save();

    await Cart.findByIdAndDelete(claimed.cartId);

    res
      .status(200)
      .json({ success: true, message: "Order confirmed", data: claimed });
  } catch (e) {
    if (e instanceof CheckoutError) {
      return res.status(e.status).json({ success: false, message: e.message });
    }
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

// Called by the /shop/paypal-cancel page. PayPal sends the buyer there with
// ?token=EC-... (no paymentId, no PayerID) when they click "Cancel and return".
// Nothing has been charged and no stock was reserved, so cancelling only
// changes the order's status. The cart is kept so the buyer can try again.
const cancelOrder = async (req, res) => {
  const { orderId, token } = req.body;

  if (!mongoose.isValidObjectId(orderId) || !token) {
    return res
      .status(400)
      .json({ success: false, message: "Missing cancel details" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order can not be found" });
    }
    // Only someone who was actually redirected back by PayPal has this token.
    if (!order.paypalToken || order.paypalToken !== token) {
      return res
        .status(400)
        .json({ success: false, message: "Token does not match this order" });
    }

    if (order.paymentStatus === "cancelled") {
      return res
        .status(200)
        .json({ success: true, message: "Order cancelled", data: order });
    }
    if (order.paymentStatus !== "pending") {
      // Already paid or being captured (e.g. approved in another tab).
      return res.status(409).json({
        success: false,
        message: `Order is ${order.paymentStatus} and can't be cancelled here`,
      });
    }

    // Ask PayPal too: if the payment has been executed, don't cancel.
    try {
      const payment = await getPayment(order.paymentId);
      if (payment.state === "approved") {
        return res.status(409).json({
          success: false,
          message: "This payment has already been completed",
        });
      }
    } catch (err) {
      // PayPal unreachable: still safe to cancel, because capturePayment only
      // proceeds from "pending", so this order can no longer be charged by us.
      console.log("PayPal lookup during cancel failed", err.response || err);
    }

    // Conditional update so a capture running right now wins the race.
    const cancelled = await Order.findOneAndUpdate(
      { _id: orderId, paymentStatus: "pending" },
      {
        $set: {
          paymentStatus: "cancelled",
          orderStatus: "cancelled",
          orderUpdateDate: new Date(),
        },
      },
      { new: true }
    );
    if (!cancelled) {
      return res.status(409).json({
        success: false,
        message: "Order changed while cancelling, please refresh",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Order cancelled", data: cancelled });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  cancelOrder,
  getAllOrdersByUser,
  getOrderDetails,
};
