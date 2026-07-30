import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import backgroundVideo from "../Video/gemini_generated_video_013cca21.mp4";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // 1️⃣ Send OTP
  const sendOtp = async () => {
    try {
      await API.post("api/send-reset-otp/", { email });
      setStep(2);
      setError("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to send OTP");
      }
    }
  };

  // 2️⃣ Verify OTP
  const verifyOtp = async () => {
    try {
      await API.post("api/verify-otp/", { email, otp });
      setStep(3);
    } catch {
      setError("Invalid OTP");
    }
  };

  // 3️⃣ Reset Password
  const resetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await API.post("api/reset-password/", {
        email,
        password,
        otp,
      });

      alert("Password reset successful");
      navigate("/login");
    } catch {
      setError("Password reset failed");
    }
  };

  return (
    <div className="login-container">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>

      <div 
        className="premium-glacier-card"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (step === 1) {
              sendOtp();
            } else if (step === 2) {
              verifyOtp();
            } else if (step === 3) {
              resetPassword();
            }
          }
        }}
      >
        <h2>Forgot Password</h2>
        {error && <p className="error-text">{error}</p>}

        {step === 1 && (
          <>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={sendOtp}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button onClick={verifyOtp}>Verify OTP</button>
          </>
        )}

        {step === 3 && (
          <>
            <input type="password" placeholder="New Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
            <button onClick={resetPassword}>Reset Password</button>
          </>
        )}

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;