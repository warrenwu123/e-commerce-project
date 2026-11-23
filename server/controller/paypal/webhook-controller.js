// PayPal webhook receiver: POST /api/paypal/webhook
//
// PayPal calls this server-to-server, independently of the browser. It doesn't
// replace capturePayment; it backs it up and catches what happens later:
//
//   PAYMENT.SALE.COMPLETED  money captured. Finishes an order stuck in
//                           "processing" (server crashed after execute but
//                           before saving), or flags unexpected payments.
//   PAYMENT.SALE.DENIED     capture was denied: undo the order, return stock.
//   PAYMENT.SALE.REFUNDED   refund issued from the PayPal dashboard.
//   PAYMENT.SALE.REVERSED   chargeback / reversal.
//
// PayPal retries any non-2xx response, and can send the same event more than
// once, so every handler only changes an order when it's in the expected
// state (conditional updates). Replays are harmless.

const { verifyWebhook } = require("../../helper/paypal");
const Order = require("../../model/order");
const Cart = require("../../model/cart");
const { releaseStock, toCents } = require("../../helper/stock");

const now = () => new Date();

async function onSaleCompleted(sale) {
  const order = await Order.findOne({ paymentId: sale.parent_payment });
  if (!order) return `no order for ${sale.parent_payment}`;
  if (order.paymentStatus === "paid") return "already paid";

  const amountOk =
    sale.amount &&
    sale.amount.currency === "USD" &&
    toCents(sale.amount.total) === toCents(order.totalAmount);

  // Normal crash-recovery case: capturePayment reserved stock and executed the
  // payment but never reached "paid". Finish the job.
  if (order.paymentStatus === "processing" && amountOk) {
    const updated = await Order.findOneAndUpdate(
      { _id: order._id, paymentStatus: "processing" },
      {
        $set: {
          paymentStatus: "paid",
          orderStatus: "confirmed",
          orderUpdateDate: now(),
        },
      }
    );
    if (updated) await Cart.findByIdAndDelete(order.cartId);
    return updated ? "confirmed from webhook" : "state changed, skipped";
  }

  // Money arrived but the order isn't in a state where stock was reserved
  // (pending / cancelled / failed), or the amount is wrong. Don't guess:
  // record the payment and leave it for an admin to resolve.
  await Order.updateOne(
    { _id: order._id, paymentStatus: { $ne: "paid" } },
    {
      $set: {
        paymentStatus: "paid",
        orderStatus: "payment_review",
        orderUpdateDate: now(),
      },
    }
  );
  return `flagged for review (was ${order.paymentStatus}, amountOk=${amountOk})`;
}

async function onSaleDenied(sale) {
  const order = await Order.findOneAndUpdate(
    {
      paymentId: sale.parent_payment,
      paymentStatus: { $in: ["processing", "paid"] },
    },
    {
      $set: {
        paymentStatus: "denied",
        orderStatus: "rejected",
        orderUpdateDate: now(),
      },
    }
  );
  if (!order) return "nothing to deny";
  // Only the request that moved it out of processing/paid gives stock back.
  await releaseStock(order.cartItems);
  return "denied, stock released";
}

// Refunds and reversals don't restock automatically: the goods may already be
// shipped. The admin decides.
async function onSaleRefundedOrReversed(resource, status) {
  const isPartial =
    status === "refunded" &&
    resource.amount &&
    toCents(resource.amount.total) <
      toCents(
        (await Order.findOne({ paymentId: resource.parent_payment }))
          ?.totalAmount ?? 0
      );

  const newStatus = isPartial ? "partially_refunded" : status;
  const result = await Order.updateOne(
    { paymentId: resource.parent_payment },
    { $set: { paymentStatus: newStatus, orderUpdateDate: now() } }
  );
  return result.matchedCount ? `marked ${newStatus}` : "no matching order";
}

const handlers = {
  "PAYMENT.SALE.COMPLETED": (r) => onSaleCompleted(r),
  "PAYMENT.SALE.DENIED": (r) => onSaleDenied(r),
  "PAYMENT.SALE.REFUNDED": (r) => onSaleRefundedOrReversed(r, "refunded"),
  "PAYMENT.SALE.REVERSED": (r) => onSaleRefundedOrReversed(r, "reversed"),
};

const handlePaypalWebhook = async (req, res) => {
  const event = req.body;

  let verified;
  try {
    verified = await verifyWebhook(req.headers, event);
  } catch (err) {
    // Our config or PayPal's API failed: 500 so PayPal retries later.
    console.log("Webhook verification error", err.response || err);
    return res.sendStatus(500);
  }
  if (!verified) {
    console.log("Rejected webhook with invalid signature", event && event.id);
    return res.sendStatus(400);
  }

  const handler = handlers[event.event_type];
  if (!handler) return res.sendStatus(200); // not an event we care about

  try {
    const outcome = await handler(event.resource || {});
    console.log(`PayPal webhook ${event.event_type} ${event.id}: ${outcome}`);
    res.sendStatus(200);
  } catch (err) {
    console.log(`PayPal webhook ${event.event_type} ${event.id} failed`, err);
    res.sendStatus(500);
  }
};

module.exports = { handlePaypalWebhook };
