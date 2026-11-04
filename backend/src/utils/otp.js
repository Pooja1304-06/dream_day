import crypto from "crypto";
import bcrypt from "bcryptjs";
import Otp from "../models/Otp.js";

export function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function saveOtp(email, purpose, otp) {
  await Otp.deleteMany({ email, purpose });
  const otpHash = await bcrypt.hash(otp, 10);
  const record = await Otp.create({
    email,
    purpose,
    otpHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });
  return record;
}

export async function verifyOtp(email, purpose, otp) {
  const record = await Otp.findOne({ email, purpose });
  if (!record || record.expiresAt < new Date()) return false;

  const ok = await bcrypt.compare(otp, record.otpHash);
  if (ok) await Otp.deleteOne({ _id: record._id });
  return ok;
}
