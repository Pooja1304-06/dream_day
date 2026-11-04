import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import aiPlannerRoutes from "./routes/aiPlanner.js";
import giftRoutes from "./routes/giftRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";


import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import bookingRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payments.js";
import adminRoutes from "./routes/admin.js";

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    app: "Dream Day API",
  });
});

// =====================================================
// ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/ai-planner", aiPlannerRoutes);


// Razorpay payment routes
app.use("/api/payments", paymentRoutes);

app.use("/api/admin/auth", adminAuthRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/gifts", giftRoutes);


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    message: "Unexpected server error",
  });
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Dream Day API running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Failed to connect to MongoDB:",
      error
    );
    process.exit(1);
  });