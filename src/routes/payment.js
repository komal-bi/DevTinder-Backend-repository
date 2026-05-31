const express = require("express");
const { userAuth } = require("../../Middleware/auth");
const razorpayInstance = require("../../utils/instance");
const PaymentModel = require("../models/payment");
const membershipData = require("../../utils/constants");
const webhookVerify = require("razorpay/dist/utils/razorpay-utils");
const { User } = require("../models/user");

const paymentRouter = express.Router();

paymentRouter.post("/payment/createOrder", userAuth, async (req, res) => {
  try {
    let user = req.user;
    let type = req.body.membershipType;

    // This will create order on razorpay
    let order = await razorpayInstance.orders.create({
      amount: membershipData[type],
      currency: "INR",
      receipt: "order-receipt",
      partial_payment: false,
      notes: {
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
      },
    });

    let data = {
      userId: user._id,
      orderId: order.id,
      amount: order.amount,
      dueAmount: order.amount_due,
      paidAmount: order.amount_paid,
      status: order.status,
      currency: order.currency,
      attempts: order.attempts,
    };

    let paymentData = new PaymentModel(data);
    let payData = await paymentData.save();

    let { userId, attempts, ...updatedPayData } = payData;
    updatedPayData.notes = order.notes;
    res.send({ message: "Created order successfully", data: updatedPayData });
  } catch (error) {
    res.status(400).send({ message: "Order creation failed" });
  }
});

paymentRouter.post("/payment/webhook/verify", async (req, res) => {
  try {
    let signature = req.headers["x-razorpay-signature"];
    let valid = await webhookVerify(
      JSON.stringify(req.body),
      signature,
      process.env.WEBHOOK_SECRET,
    );
    if (valid) {
      let paymentDetails = req.body.payload.payment.entity;

      if ((paymentDetails.status = "captured")) {
        let paymentData = await PaymentModel.findOne({
          orderId: paymentDetails.order_id,
        });
        if (paymentData) {
          paymentData.paymentId = paymentDetails.id;
          paymentData.status = paymentDetails.status;
          paymentData.attemps = paymentData.attemps + 1;
          await paymentData.save();
          let user = await User.findById({ _id: paymentData.userId });
          user.isPremium = true;
          await user.save();
        } else {
          console.log("No order found");
        }
      } else if ((paymentDetails.status = "failed")) {
        paymentData.status = paymentDetails.status;
        paymentData.attemps = paymentData.attemps + 1;
        await paymentData.save();
      }
    } else {
      console.log("webhook verifation failed due to incorrect signature");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

paymentRouter.get("/payment/verification", userAuth, async (req, res) => {
  try {
    let user = req.user;
    let userData = await User.findById({ _id: user._id });
    if (userData) {
      res.send({ isPremium: true });
    } else {
      res.status(401).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = paymentRouter;
