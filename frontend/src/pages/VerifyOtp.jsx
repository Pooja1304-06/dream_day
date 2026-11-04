import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const email = sessionStorage.getItem("otpEmail");
  const purpose = sessionStorage.getItem("otpPurpose") || "register";

  async function verify(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp, purpose });
      setUser(data.user);
      sessionStorage.removeItem("otpEmail");
      sessionStorage.removeItem("otpPurpose");
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  }

  async function resend() {
    try {
      await api.post("/auth/resend-otp", { email, purpose });
      setError("");
      alert("A new OTP was sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend");
    }
  }

  return (
    <div className="page-center otp-page">
      <div className="otp-card">
        <span className="mini-label">EMAIL VERIFICATION</span>
        <h1>Enter your OTP</h1>
        <p>We sent a 6-digit code to <strong>{email}</strong>.</p>
        <form onSubmit={verify}>
          <input className="otp-input" maxLength="6" inputMode="numeric" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,""))} placeholder="000000"/>
          {error && <div className="error">{error}</div>}
          <button className="primary-btn wide">Verify & continue</button>
        </form>
        <button className="text-button" onClick={resend}>Resend OTP</button>
      </div>
    </div>
  );
}
