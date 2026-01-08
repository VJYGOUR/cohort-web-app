// controllers/payment.controller.js
import razorpay from "../razorpay.js";
import Enrollment from "../models/enrollment.models.js";
import Cohort from "../models/cohort.models.js";
import Payment from "../models/payment.models.js";
import crypto from "crypto";

/**
 * Create Razorpay order for an enrollment
 * Idempotent: multiple clicks return the same order if pending
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Auth middleware sets req.user
    const { enrollmentId } = req.body;

    // 1️⃣ Validate enrollment
    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      userId,
      status: "pending", // only allow pending enrollments
    });

    if (!enrollment) {
      return res.status(400).json({ message: "Invalid enrollment" });
    }
    // 2️⃣ Block already-paid enrollments
    if (enrollment.status === "paid") {
      return res.status(400).json({
        message: "Payment already completed for this enrollment",
      });
    }
    // 2️⃣ Get cohort price
    const cohort = await Cohort.findById(enrollment.cohortId);
    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }

    const amountInPaise = cohort.price * 100; // Razorpay expects paise

    // 3️⃣ Check existing pending payment (idempotency)
    let payment = await Payment.findOne({
      enrollmentId,
      status: "created", // still waiting for payment
    });

    if (!payment) {
      // 3️⃣a Create Razorpay order
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `enroll_${enrollmentId}`,
      });

      // 3️⃣b Save payment record
      payment = await Payment.create({
        userId,
        enrollmentId,
        razorpayOrderId: order.id,
        amount: cohort.price,
        status: "created",
      });
    }

    // 4️⃣ Return order info to frontend
    return res.json({
      orderId: payment.razorpayOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return res.status(500).json({ message: "Order creation failed" });
  }
};
// controllers/payment.controller.js

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // 1️⃣ Find payment record
    const payment = await Payment.findOne({
      razorpayOrderId: orderId,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // 2️⃣ Generate expected signature
    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // 3️⃣ Compare signatures
    if (expectedSignature !== signature) {
      payment.status = "failed";
      await payment.save();

      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // 4️⃣ Mark payment as paid
    payment.status = "paid";
    payment.razorpayPaymentId = paymentId;
    payment.razorpaySignature = signature;
    await payment.save();

    // 5️⃣ Activate enrollment
    await Enrollment.findByIdAndUpdate(payment.enrollmentId, {
      status: "paid",
    });

    res.json({ message: "Payment verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
