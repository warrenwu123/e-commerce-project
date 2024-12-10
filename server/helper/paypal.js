const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "Af_KAN9_BfefHw656VH7vNibTy_5tz03axYwYcZt0XNFYXEej7TfI-jDDs5Cf967BSObHiYXB7IlpEBQ",
  client_secret: "EENRSHGO3QMSU3QXMPr2fPZYbR4WUwZqFRLFHfym91Ih2VuFU8n_gs1WQs-m1msrFujjypBguG4QQlMp",
});

module.exports = paypal;