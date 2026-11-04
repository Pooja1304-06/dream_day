import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from "lucide-react";

import "./LoginSelection.css";

export default function LoginSelection() {
  const navigate = useNavigate();

  return (
    <div className="login-selection-page">

      <div className="selection-container">

        <div className="selection-brand">
          <div className="selection-logo">
            <Sparkles size={30} />
          </div>

          <h1>Dream Day</h1>
          <p>Make Every Moment Magical</p>
        </div>

        <div className="selection-heading">
          <h2>Welcome to Dream Day!</h2>
          <p>Choose how you want to continue</p>
        </div>

        <div className="login-choice-container">

          <div className="login-choice-card">

            <div className="choice-icon user-choice-icon">
              <UserRound size={35} />
            </div>

            <h3>User Login</h3>

            <p>
              Explore events, plan your celebrations
              and manage your bookings.
            </p>

            <button
              onClick={() => navigate("/user-login")}
            >
              Continue as User
              <ArrowRight size={18} />
            </button>

          </div>

          <div className="login-choice-card">

            <div className="choice-icon admin-choice-icon">
              <ShieldCheck size={35} />
            </div>

            <h3>Admin Login</h3>

            <p>
              Manage bookings, customers, vendors
              and your Dream Day platform.
            </p>

            <button
              onClick={() => navigate("/admin/login")}
            >
              Continue as Admin
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

        <div className="selection-footer">
          © 2026 Dream Day. All rights reserved.
        </div>

      </div>

    </div>
  );
}
