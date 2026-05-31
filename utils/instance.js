const Razorpay = require("razorpay");

// This key can be generated in razorpay dashboard and by using this key razorpay can authenticate and can provide access to it
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, //public key which can be used in frontend and backend too
  key_secret: process.env.RAZORPAY_SECRET, //secret key which have to use in backend only that to need to keep secret
});

module.exports = razorpayInstance;
