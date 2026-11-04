import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";

import Booking from "../models/Booking.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// HELPER: FIND THE LOGGED-IN USER'S BOOKING
// =====================================================

async function findUserBooking(bookingId, userId) {
  if (!bookingId || !/^[a-f\d]{24}$/i.test(bookingId)) {
    return null;
  }

  return Booking.findOne({
    _id: bookingId,
    user: userId,
  });
}

// =====================================================
// HELPER: CONFIRM A VERIFIED PAYMENT
// =====================================================

async function confirmBookingPayment(booking, paymentId) {
  booking.paymentStatus = "paid";
  booking.bookingStatus = "confirmed";

  if (paymentId) {
    booking.razorpayPaymentId = paymentId;
  }

  await booking.save();
}

// =====================================================
// 1. CREATE RAZORPAY ORDER
// POST /api/payment/create-order
// =====================================================

router.post("/create-order", requireAuth, async (req, res) => {
  try {
    const booking = await findUserBooking(
      req.body.bookingId,
      req.user._id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "This booking has already been paid",
      });
    }

    const amount = Number(booking.advanceAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Invalid payment amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `dd_${booking._id.toString()}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    booking.razorpayOrderId = order.id;

    await booking.save();

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Unable to create payment order",
    });
  }
});

// =====================================================
// 2. VERIFY RAZORPAY CHECKOUT PAYMENT
// POST /api/payment/verify
// =====================================================

router.post("/verify", requireAuth, async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !bookingId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification details are incomplete",
      });
    }

    const booking = await findUserBooking(
      bookingId,
      req.user._id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.json({
        success: true,
        message: "Payment is already confirmed",
        bookingId: booking._id,
      });
    }

    if (booking.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        message: "The payment order does not match this booking",
      });
    }

    const payload =
      `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest();

    let receivedSignature;

    try {
      receivedSignature = Buffer.from(
        razorpay_signature,
        "hex"
      );
    } catch {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    if (
      receivedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(
        receivedSignature,
        expectedSignature
      )
    ) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    // Verify the payment status with Razorpay as well.
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.amount !== Math.round(booking.advanceAmount * 100) ||
      payment.currency !== "INR" ||
      !["authorized", "captured"].includes(payment.status)
    ) {
      return res.status(400).json({
        message: "Payment details could not be verified",
      });
    }

    // Only mark paid when Razorpay confirms capture.
    if (payment.status !== "captured") {
      return res.status(409).json({
        message: "Payment has not been captured yet",
      });
    }

    await confirmBookingPayment(
      booking,
      razorpay_payment_id
    );

    return res.json({
      success: true,
      message: "Payment successful! Your booking is confirmed.",
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      message: "Unable to verify payment",
    });
  }
});

// =====================================================
// 3. CREATE A REAL RAZORPAY UPI QR CODE
// POST /api/payment/create-qr
// =====================================================

router.post("/create-qr", requireAuth, async (req, res) => {
  try {
    const booking = await findUserBooking(
      req.body.bookingId,
      req.user._id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        message: "This booking has already been paid",
      });
    }

    // Reuse an existing active QR code for this booking.
    if (
      booking.razorpayQrCodeId &&
      booking.qrStatus === "active"
    ) {
      const existingQr = await razorpay.qrCode.fetch(
        booking.razorpayQrCodeId
      );

      if (existingQr.status === "active") {
        return res.json({
          success: true,
          qrId: existingQr.id,
          qrImageUrl: existingQr.image_url,
          amount: booking.advanceAmount,
          status: existingQr.status,
        });
      }
    }

    const amountInPaise = Math.round(
      Number(booking.advanceAmount) * 100
    );

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({
        message: "Invalid QR payment amount",
      });
    }

    // Razorpay requires close_by to be at least 15 minutes
    // after the current time.
    const closeBy = Math.floor(Date.now() / 1000) + 30 * 60;

    const qr = await razorpay.qrCode.create({
      type: "upi_qr",
      name: "Dream Day",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: amountInPaise,
      description: `Dream Day booking ${booking._id}`,
      close_by: closeBy,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    booking.razorpayQrCodeId = qr.id;
    booking.qrStatus = qr.status;

    await booking.save();

    return res.json({
      success: true,
      qrId: qr.id,
      qrImageUrl: qr.image_url,
      amount: booking.advanceAmount,
      status: qr.status,
    });
  } catch (error) {
    console.error("Create QR error:", error);

    return res.status(500).json({
      message:
        error.error?.description ||
        "Unable to create QR payment. Check your Razorpay test-mode setup.",
    });
  }
});

// =====================================================
// 4. CHECK QR PAYMENT STATUS
// GET /api/payment/qr-status/:bookingId
// =====================================================

router.get(
  "/qr-status/:bookingId",
  requireAuth,
  async (req, res) => {
    try {
      const booking = await findUserBooking(
        req.params.bookingId,
        req.user._id
      );

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      if (booking.paymentStatus === "paid") {
        return res.json({
          success: true,
          paid: true,
          bookingStatus: booking.bookingStatus,
        });
      }

      if (!booking.razorpayQrCodeId) {
        return res.json({
          success: true,
          paid: false,
          message: "No QR code has been created",
        });
      }

      const payments = await razorpay.qrCode.fetchAllPayments(
        booking.razorpayQrCodeId,
        { count: 100 }
      );

      const capturedPayment = payments.items.find(
        (payment) =>
          payment.status === "captured" &&
          payment.amount === Math.round(booking.advanceAmount * 100) &&
          payment.currency === "INR"
      );

      if (capturedPayment) {
        await confirmBookingPayment(
          booking,
          capturedPayment.id
        );

        return res.json({
          success: true,
          paid: true,
          message: "Payment successful! Your booking is confirmed.",
          bookingStatus: booking.bookingStatus,
        });
      }

      return res.json({
        success: true,
        paid: false,
        message: "Payment has not been confirmed yet",
      });
    } catch (error) {
      console.error("QR status error:", error);

      return res.status(500).json({
        message: "Unable to check QR payment status",
      });
    }
  }
);

export default router;