import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

const AdminLogin = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("Email / Phone and Password are required");
      return;
    }

    let payload = { password };

    if (emailRegex.test(identifier)) {
      payload.email = identifier;
    } else if (phoneRegex.test(identifier)) {
      payload.phone = identifier;
    } else {
      setError("Enter valid Email or Phone number");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/api/admin/login/`,
        payload
      );

      // Store in admin-specific keys (for adminApi.js auto-refresh)
      localStorage.setItem("admin_access", res.data.access);
      localStorage.setItem("admin_refresh", res.data.refresh);
      // Also store in shared keys so all existing admin components work
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Save vendor name for dashboard display
      const name = res.data.name || res.data.username || identifier.split("@")[0];
      localStorage.setItem("vendor_name", name);

      setError("");

      const role = res.data.role;

      if (role === "VENDOR") {
        navigate("/VendorDashboard");
      } else {
        navigate("/Dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <div className="admin-login-wrapper">
        <div className="admin-login">
          {/* Brand */}
          <div className="login-brand">
            <div className="brand-name">Adugalam</div>
            <div className="brand-tagline">Sports & Turf Management Platform</div>
          </div>
          <div className="login-divider" />

          <h2>Login</h2>
          <p className="admin-login-note">
            Your password has been sent to your registered email.
          </p>

          {error && <p className="error">{error}</p>}

          {/* Email / Phone */}
          <div className="input-group">
            <label>Email or Phone</label>
            <input
              id="login-identifier"
              type="text"
              placeholder="Enter your email or phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="forgot-password-link">
            <Link to="/admin-forgot-password">Forgotten password?</Link>
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;