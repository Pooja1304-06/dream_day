import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 }
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    includes: [{ type: String }]
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: [
        "Wedding",
        "Birthday",
        "Engagement",
        "Baby Shower",
        "Corporate",
        "Graduation",
        "Anniversary",
        "Concert",
        "Party"
      ],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    venue: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 100
    },

    image: {
      type: String,
      required: true
    },

    capacity: {
      type: Number,
      default: 100
    },

    features: [{
      type: String
    }],

    /*
      Category-specific customization options.

      Example:
      Wedding → Traditional / Destination / Christian
      Birthday → Kids / Adult / Surprise
    */
    optionGroups: [
      {
        name: String,
        label: String,
        options: [optionSchema]
      }
    ],

    /*
      Event packages.
    */
    packages: [packageSchema],

    /*
      Optional add-ons.
    */
    addons: [optionSchema],

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Event", eventSchema);