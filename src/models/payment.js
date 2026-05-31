const mongoose = require("mongoose");

let paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    attemps:{
        type:Number,
        default:0
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PaymentModel = mongoose.model("Payment", paymentSchema);

module.exports = PaymentModel;
