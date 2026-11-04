import express from "express";
import Gift from "../models/Gift.js";

const router = express.Router();

// Get all gifts for an event
router.get("/:eventId", async (req, res) => {
  try {
    const gifts = await Gift.find({
      eventId: req.params.eventId
    }).sort({ createdAt: -1 });

    res.json(gifts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gifts"
    });
  }
});

// Add a gift
router.post("/", async (req, res) => {
  try {
    const { eventId, name, description, image, price } = req.body;

    if (!eventId || !name || price === undefined) {
      return res.status(400).json({
        message: "Event, gift name and price are required"
      });
    }

    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        message: "Enter a valid price"
      });
    }

    const gift = await Gift.create({
      eventId,
      name,
      description,
      image,
      price: parsedPrice
    });

    res.status(201).json(gift);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add gift"
    });
  }
});

// Delete a gift
router.delete("/:id", async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);

    if (!gift) {
      return res.status(404).json({
        message: "Gift not found"
      });
    }

    res.json({
      message: "Gift deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete gift"
    });
  }
});

export default router;