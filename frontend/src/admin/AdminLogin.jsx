import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight
} from "lucide-react";

import "./AdminLogin.css";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminLogin = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        `${API}/admin/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          credentials: "include",

          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Admin login failed");
      }

      sessionStorage.setItem(
        "adminName",
        data.admin.name
      );

      navigate("/admin/dashboard");

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="admin-login-page">

      <div className="admin-login-decoration decoration-one"></div>
      <div className="admin-login-decoration decoration-two"></div>

      <div className="admin-login-card">

        <div className="admin-login-brand">

          <div className="admin-brand-icon">
            <Sparkles size={27} />
          </div>

          <h2>Dream Day</h2>

          <span>ADMIN PORTAL</span>

        </div>

        <div className="admin-login-heading">

          <div className="admin-shield">
            <ShieldCheck size={32} />
          </div>

          <h1>Welcome Back!</h1>

          <p>
            Sign in to manage your Dream Day platform.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="admin-input-group">

            <label>Email Address</label>

            <div className="admin-input-wrapper">

              <Mail size={19} />

              <input
                type="email"
                name="email"
                placeholder="Enter admin email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          <div className="admin-input-group">

            <label>Password</label>

            <div className="admin-input-wrapper">

              <Lock size={19} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >

            {loading ? "Signing In..." : "Sign In to Dashboard"}

            {!loading && <ArrowRight size={19} />}

          </button>

        </form>

        <div className="admin-login-footer">

          <ShieldCheck size={16} />

          <span>Secure Administrator Access</span>

        </div>

        <div className="admin-login-bottom">
          © 2026 Dream Day. All rights reserved.
        </div>

      </div>

    </div>

  );

};

export default AdminLogin;