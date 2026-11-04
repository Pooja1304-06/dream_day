import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = express.Router();

function safeCompare(value1, value2) {
  const a = Buffer.from(value1);
  const b = Buffer.from(value2);

  return (
    a.length === b.length &&
    crypto.timingSafeEqual(a, b)
  );
}

// ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !adminPassword || !jwtSecret) {
      return res.status(500).json({
        message: "Admin credentials are not configured"
      });
    }

    const emailMatches = safeCompare(
      email.trim().toLowerCase(),
      adminEmail.trim().toLowerCase()
    );

    const passwordMatches = safeCompare(
      password,
      adminPassword
    );

    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({
        message: "Invalid admin email or password"
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: adminEmail
      },
      jwtSecret,
      {
        expiresIn: "2h"
      }
    );

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
      path: "/"
    });

    res.json({
      message: "Admin login successful",
      admin: {
        name: "Administrator",
        email: adminEmail
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Admin login failed"
    });
  }
});

// VERIFY ADMIN SESSION
router.get("/me", (req, res) => {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({
        message: "Admin login required"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    res.json({
      authenticated: true,
      admin: {
        name: "Administrator",
        email: decoded.email
      }
    });

  } catch {
    res.status(401).json({
      message: "Admin session expired"
    });
  }
});

// ADMIN LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  res.json({
    message: "Admin logged out successfully"
  });
});

export default router;
