import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

const AdminForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    setError("");
    setMessage("Sending OTP...");
    try {
      const res = await axios.post(`${API_BASE}/api/admin/forgot-password/send-otp/`, { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required");
      return;
    }
    setError("");
    setMessage("Verifying OTP...");
    try {
      const res = await axios.post(`${API_BASE}/api/verify-otp/`, { email, otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setMessage("Resetting password...");
    try {
      const res = await axios.post(`${API_BASE}/api/admin/forgot-password/reset/`, {
        email,
        otp,
        password: newPassword
      });
      alert(res.data.message);
      navigate("/AdminLogin");
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div 
        className="admin-login" 
        style={{ minHeight: "auto", paddingBottom: "30px" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (step === 1) {
              handleSendOtp();
            } else if (step === 2) {
              handleVerifyOtp();
            } else if (step === 3) {
              handleResetPassword();
            }
          }
        }}
      >
        <h2>Reset Password</h2>
        <p className="admin-login-note" style={{ fontSize: '0.9rem', color: '#555', marginBottom: '15px' }}>
          {step === 1 && "Enter your email address to receive an OTP."}
          {step === 2 && "Enter the OTP sent to your email."}
          {step === 3 && "Create a new password."}
        </p>

        {error && <p className="error" style={{ color: "red", fontSize: "0.9rem", marginBottom: "15px" }}>{error}</p>}
        {message && <p className="success" style={{ color: "green", fontSize: "0.9rem", marginBottom: "15px" }}>{message}</p>}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendOtp}>Send OTP</button>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <Link to="/AdminLogin" style={{ color: "#007bff", textDecoration: "none", fontSize: "0.9rem" }}>Back to Login</Link>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
               <span onClick={() => { setStep(1); setOtp(""); setError(""); setMessage(""); }} style={{ color: "#007bff", textDecoration: "none", fontSize: "0.9rem", cursor: "pointer" }}>Change Email</span>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="password-box">
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="password-box" style={{ marginTop: "15px" }}>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button style={{ marginTop: "15px" }} onClick={handleResetPassword}>Reset Password</button>
          </>
        )}

      </div>
    </div>
  );
};

export default AdminForgotPassword;
