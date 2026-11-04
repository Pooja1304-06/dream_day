import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

await connectDB();

const email = process.env.ADMIN_EMAIL.toLowerCase();
const password = process.env.ADMIN_PASSWORD;

let admin = await User.findOne({ email });

if (!admin) {
  admin = await User.create({
    name: "Dream Day Admin",
    email,
    phone: "",
    password: await bcrypt.hash(password, 12),
    role: "admin",
    isVerified: true
  });
  console.log(`Admin created: ${email}`);
} else {
  admin.role = "admin";
  admin.isVerified = true;
  admin.password = await bcrypt.hash(password, 12);
  await admin.save();
  console.log(`Admin updated: ${email}`);
}

process.exit(0);
