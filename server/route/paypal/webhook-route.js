const express = require("express");
const {
  handlePaypalWebhook,
} = require("../../controller/paypal/webhook-controller");

const router = express.Router();

router.post("/webhook", handlePaypalWebhook);

module.exports = router;
