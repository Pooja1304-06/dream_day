import express from "express";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {

    const {
      eventId,
      eventDate,
      guests,
      notes,
      advancePercent = 25,
      selectedOptions = {},
      selectedPackage,
      selectedAddons = []
    } = req.body;

    if (!eventId || !eventDate || !guests) {
      return res.status(400).json({
        message: "Event, date and guests are required"
      });
    }

    if (![25, 50, 75, 100].includes(Number(advancePercent))) {
      return res.status(400).json({
        message: "Invalid advance percentage"
      });
    }

    const event = await Event.findById(eventId);

    if (!event || !event.active) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (Number(guests) > event.capacity) {
      return res.status(400).json({
        message: `Maximum capacity is ${event.capacity} guests`
      });
    }

    // ------------------------------------------
    // PACKAGE
    // ------------------------------------------

    const selectedPkg = event.packages?.find(
      (pkg) =>
        pkg.name === selectedPackage?.name
    );

    if (!selectedPkg) {
      return res.status(400).json({
        message: "Please select a valid package"
      });
    }

    let totalAmount =
      Number(selectedPkg.price);

    // ------------------------------------------
    // EVENT TYPE / STYLE OPTION
    // ------------------------------------------

    const validatedOptions = {};

    for (const group of event.optionGroups || []) {

      const selectedName =
        selectedOptions[group.name];

      if (!selectedName) {
        continue;
      }

      const selected =
        group.options.find(
          (option) =>
            option.name === selectedName
        );

      if (!selected) {
        return res.status(400).json({
          message:
            `Invalid option selected for ${group.label}`
        });
      }

      validatedOptions[group.name] =
        selected.name;

      totalAmount += Number(
        selected.price || 0
      );
    }

    // ------------------------------------------
    // ADDONS
    // ------------------------------------------

    const validatedAddons = [];

    for (const requestedAddon of selectedAddons) {

      const addon =
        event.addons?.find(
          (item) =>
            item.name === requestedAddon.name
        );

      if (!addon) {
        return res.status(400).json({
          message:
            `Invalid add-on: ${requestedAddon.name}`
        });
      }

      validatedAddons.push({
        name: addon.name,
        price: addon.price
      });

      totalAmount += Number(
        addon.price || 0
      );
    }

    // ------------------------------------------
    // ADVANCE
    // ------------------------------------------

    const advanceAmount =
      Math.round(
        totalAmount *
        Number(advancePercent) /
        100
      );

    // ------------------------------------------
    // CREATE BOOKING
    // ------------------------------------------

    const booking = await Booking.create({

      user: req.user._id,

      event: event._id,

      eventDate,

      guests: Number(guests),

      notes: notes || "",

      selectedOptions: validatedOptions,

      selectedPackage: {
        name: selectedPkg.name,
        price: selectedPkg.price
      },

      selectedAddons: validatedAddons,

      advancePercent:
        Number(advancePercent),

      totalAmount,

      advanceAmount
    });

    const populated =
      await booking
        .populate("event")
        .then((doc) =>
          doc.populate(
            "user",
            "name email phone"
          )
        );

    res.status(201).json({
      booking: populated
    });

  } catch (error) {

    console.error(error);

    res.status(400).json({
      message: error.message
    });
  }
});

router.get("/mine", requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch {
    res.status(500).json({ message: "Could not fetch bookings" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate("event").populate("user", "name email phone");

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ booking });
  } catch {
    res.status(500).json({ message: "Could not fetch booking" });
  }
});

export default router;
