import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", form);
      sessionStorage.setItem("otpEmail", data.email);
      sessionStorage.setItem("otpPurpose", "register");
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-image register-image"></div>
      <div className="auth-box">
        <span className="mini-label">CREATE YOUR ACCOUNT</span>
        <h1>Start planning your Dream Day</h1>
        <p>We'll verify your email with a 6-digit OTP before you can enter the app.</p>
        <form className="form-card flat" onSubmit={submit}>
          <label>Full name<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})}/></label>
          <label>Email<input required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></label>
          <label>Phone<input value={form.phone} onChange={e => setForm({...form,phone:e.target.value})}/></label>
          <label>Password<input required minLength="6" type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})}/></label>
          {error && <div className="error">{error}</div>}
          <button className="primary-btn wide">Send OTP</button>
        </form>
        <p>Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
