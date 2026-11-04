import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      sessionStorage.setItem("otpEmail", data.email);
      sessionStorage.setItem("otpPurpose", "login");
      navigate("/verify-otp", { state: { from: location.state?.from || "/" } });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-image"></div>
      <div className="auth-box">
        <span className="mini-label">WELCOME BACK</span>
        <h1>Sign in to Dream Day</h1>
        <p>We'll send a one-time OTP to your email after your password is verified.</p>
        <form className="form-card flat" onSubmit={submit}>
          <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></label>
          <label>Password<input type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})}/></label>
          {error && <div className="error">{error}</div>}
          <button className="primary-btn wide">Continue with OTP</button>
        </form>
        <p>New to Dream Day? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
