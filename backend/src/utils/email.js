import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendOtpEmail(to, otp, purpose) {
  const action = purpose === "register" ? "verify your Dream Day account" : "complete your Dream Day login";

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Dream Day OTP – ${otp}`,
    text: `Your Dream Day OTP is ${otp}. Use it to ${action}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px">
        <h1 style="color:#4f46e5">Dream Day</h1>
        <p>Use the OTP below to ${action}:</p>
        <div style="font-size:34px;font-weight:700;letter-spacing:8px">${otp}</div>
        <p>This OTP expires in 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `
  });
}
