import express from "express";

import User from "../models/User.js";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

import { requireAdminSession } from "../middleware/adminSession.js";

const router = express.Router();

// Protect all admin management routes
router.use(requireAdminSession);


// DASHBOARD STATISTICS
router.get("/stats", async (req, res) => {
  try {

    const [
      users,
      events,
      bookings,
      paidBookings,
      pendingBookings,
      confirmedBookings
    ] = await Promise.all([

      User.countDocuments({ role: "user" }),

      Event.countDocuments(),

      Booking.countDocuments(),

      Booking.countDocuments({
        paymentStatus: "paid"
      }),

      Booking.countDocuments({
        bookingStatus: "pending"
      }),

      Booking.countDocuments({
        bookingStatus: "confirmed"
      })

    ]);

    const revenueAgg = await Booking.aggregate([

      {
        $match: {
          paymentStatus: "paid"
        }
      },

      {
        $group: {
          _id: null,
          total: {
            $sum: "$advanceAmount"
          }
        }
      }

    ]);

    res.json({
      stats: {
        users,
        events,
        bookings,
        paidBookings,
        pendingBookings,
        confirmedBookings,
        revenue: revenueAgg[0]?.total || 0
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Could not fetch dashboard statistics"
    });

  }
});


// GET ALL USERS
router.get("/users", async (req, res) => {
  try {

    const users = await User.find({
      role: "user"
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ users });

  } catch (error) {

    res.status(500).json({
      message: "Could not fetch users"
    });

  }
});


// GET ALL BOOKINGS
router.get("/bookings", async (req, res) => {
  try {

    const bookings = await Booking.find()

      .populate(
        "user",
        "name email phone"
      )

      .populate(
        "event",
        "title category city price"
      )

      .sort({ createdAt: -1 });

    res.json({ bookings });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Could not fetch bookings"
    });

  }
});


// GET SINGLE BOOKING
router.get("/bookings/:id", async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id)

      .populate("user", "name email phone")

      .populate("event");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.json({ booking });

  } catch (error) {

    res.status(500).json({
      message: "Could not fetch booking"
    });

  }
});


// UPDATE BOOKING STATUS
router.patch("/bookings/:id/status", async (req, res) => {
  try {

    const { bookingStatus } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "cancelled"
    ];

    if (!allowedStatuses.includes(bookingStatus)) {
      return res.status(400).json({
        message: "Invalid booking status"
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        bookingStatus
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate("user", "name email phone")
      .populate("event");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.json({
      message: "Booking status updated",
      booking
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Could not update booking"
    });

  }
});


// GET ALL EVENTS
router.get("/events", async (req, res) => {
  try {

    const events = await Event.find()
      .sort({ createdAt: -1 });

    res.json({ events });

  } catch (error) {

    res.status(500).json({
      message: "Could not fetch events"
    });

  }
});

export default router;
