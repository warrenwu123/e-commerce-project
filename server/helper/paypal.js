const paypal = require("paypal-rest-sdk");

const { PAYPAL_MODE, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  throw new Error(
    "Missing PayPal credentials: set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in server/.env"
  );
}

paypal.configure({
  mode: PAYPAL_MODE === "live" ? "live" : "sandbox",
  client_id: PAYPAL_CLIENT_ID,
  client_secret: PAYPAL_CLIENT_SECRET,
});

// Promise wrappers around the callback-style SDK.
const createPayment = (json) =>
  new Promise((resolve, reject) =>
    paypal.payment.create(json, (err, payment) =>
      err ? reject(err) : resolve(payment)
    )
  );

const executePayment = (paymentId, json) =>
  new Promise((resolve, reject) =>
    paypal.payment.execute(paymentId, json, (err, payment) =>
      err ? reject(err) : resolve(payment)
    )
  );

const getPayment = (paymentId) =>
  new Promise((resolve, reject) =>
    paypal.payment.get(paymentId, (err, payment) =>
      err ? reject(err) : resolve(payment)
    )
  );

// Ask PayPal whether a webhook request really came from PayPal and was sent to
// the webhook registered under PAYPAL_WEBHOOK_ID. Resolves true/false.
const verifyWebhook = (headers, event) =>
  new Promise((resolve, reject) => {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
      return reject(new Error("PAYPAL_WEBHOOK_ID is not set in server/.env"));
    }
    paypal.notification.webhookEvent.verify(
      { ...headers },
      event,
      webhookId,
      (err, response) =>
        err ? reject(err) : resolve(response.verification_status === "SUCCESS")
    );
  });

module.exports = {
  paypal,
  createPayment,
  executePayment,
  getPayment,
  verifyWebhook,
};
