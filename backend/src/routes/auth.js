import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOtp, saveOtp, verifyOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/email.js";

const router = express.Router();

function setAuthCookie(res, user) {
  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("dd_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user?.isVerified) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        phone,
        password: hashedPassword
      });
    } else {
      user.name = name;
      user.phone = phone;
      user.password = hashedPassword;
      await user.save();
    }

    const otp = generateOtp();
    await saveOtp(normalizedEmail, "register", otp);
    await sendOtpEmail(normalizedEmail, otp, "register");

    res.json({ message: "OTP sent to your email", email: normalizedEmail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, purpose = "register" } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const valid = await verifyOtp(normalizedEmail, purpose, otp);
    if (!valid) return res.status(400).json({ message: "Invalid or expired OTP" });

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (purpose === "register") {
      user.isVerified = true;
      await user.save();
    }

    setAuthCookie(res, user);

    res.json({
      message: "Verification successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const otp = generateOtp();
    await saveOtp(normalizedEmail, "login", otp);
    await sendOtpEmail(normalizedEmail, otp, "login");

    res.json({ message: "Login OTP sent to your email", email: normalizedEmail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email, purpose = "register" } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: "User not found" });
    const otp = generateOtp();
    await saveOtp(normalizedEmail, purpose, otp);
    await sendOtpEmail(normalizedEmail, otp, purpose);

    res.json({ message: "New OTP sent" });
  } catch {
    res.status(500).json({ message: "Could not resend OTP" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("dd_token");
  res.json({ message: "Logged out" });
});

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.dd_token;
    if (!token) return res.status(401).json({ message: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    res.json({ user });
  } catch {
    res.status(401).json({ message: "Not logged in" });
  }
});

export default router;
