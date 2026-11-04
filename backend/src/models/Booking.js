import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    notes: {
      type: String,
      default: "",
    },


    advancePercent: {
      type: Number,
      enum: [25, 50, 75, 100],
      default: 25,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    advanceAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    selectedOptions: {
      type: Map,
      of: String,
      default: {},
    },

    selectedPackage: {
      name: String,
      price: Number,
    },

    selectedAddons: [
      {
        name: String,
        price: Number,
      },
    ],

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    razorpayQrCodeId: {
      type: String,
      default: null,
    },

    paymentLinkId: {
      type: String,
      default: null,
    },

    paymentLinkUrl: {
      type: String,
      default: null,
    },

    qrStatus: {
      type: String,
      default: "not_created",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);