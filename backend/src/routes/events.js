import express from "express";
import Event from "../models/Event.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filter = { active: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.city) filter.city = new RegExp(req.query.city, "i");
    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json({ events });
  } catch {
    res.status(500).json({ message: "Could not fetch events" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ event });
  } catch {
    res.status(500).json({ message: "Could not fetch event" });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch {
    res.status(500).json({ message: "Could not delete event" });
  }
});

export default router;
