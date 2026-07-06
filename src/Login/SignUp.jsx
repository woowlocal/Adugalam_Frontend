import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../api/api";
import "./SignUp.css";
import { FaEye, FaEyeSlash, FaUserCheck } from "react-icons/fa";
import backgroundVideo from "../Video/gemini_generated_video_013cca21.mp4";


const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});

  // ---- RESTORE ACCOUNT POPUP STATE ----
  const [showRestorePopup, setShowRestorePopup] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState("");

  // ---------- PASSWORD RULES ----------
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const isStrong =
    rules.length &&
    rules.upper &&
    rules.lower &&
    rules.number &&
    rules.special;

  // ---------- VALIDATION ----------
  const validateStep1 = () => {
    const newErrors = {};

    if (!/^[A-Za-z ]+$/.test(name))
      newErrors.name = "Only alphabets allowed";

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email))
      newErrors.email = "Enter valid Gmail address";

    if (!/^[0-9]{10}$/.test(mobile))
      newErrors.mobile = "Enter valid 10-digit mobile number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!isStrong)
      newErrors.password = "Password does not meet requirements";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- API ----------
  const sendOtp = async () => {
    if (!validateStep1()) return;

    try {
      await API.post("api/send-otp/", { email });
      setStep(2);
      setErrors({});
    } catch (err) {
      const errorMsg = err?.response?.data?.error || "OTP send failed";

      // 🔥 Detect retired account — show restore popup instead of plain error
      if (
        errorMsg.toLowerCase().includes("pending admin approval") ||
        errorMsg.toLowerCase().includes("deletion request")
      ) {
        setRestoreEmail(email);
        setShowRestorePopup(true);
        setErrors({});
      } else {
        setErrors({ api: errorMsg });
      }
    }
  };

  const verifyOtp = async () => {
    try {
      await API.post("api/verify-otp/", { email, otp });
      setStep(3);
      setErrors({});
    } catch {
      setErrors({ api: "Invalid OTP" });
    }
  };

  const createAccount = async () => {
    if (!validatePassword()) return;

    try {
      await API.post("api/signup/", {
        name,
        email,
        mobile,
        password,
        confirm_password: confirmPassword,
      });

      alert("Account created successfully");
      navigate("/login", { state: location.state });
    } catch {
      setErrors({ api: "Signup failed" });
    }
  };

  const handleRestoreAccount = async () => {
    setRestoreLoading(true);
    try {
      await API.post("api/user/restore-account/", { email: restoreEmail });
      setShowRestorePopup(false);
      alert("Your account has been restored! Please login with your existing password.");
      navigate("/login", { state: location.state });
    } catch (err) {
      const msg = err?.response?.data?.error || "Restore failed. Please try again.";
      alert(`❌ ${msg}`);
      setRestoreLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="login-container">
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>

      <div className="premium-glacier-card">
        <h2>{step === 2 ? "OTP has been sent to your email" : "Create Account"}</h2>

        {errors.api && <p className="error-text">{errors.api}</p>}

        {step === 1 && (
          <>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "error-input" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error-input" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}

            <input
              placeholder="Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className={errors.mobile ? "error-input" : ""}
            />
            {errors.mobile && <span className="error-text">{errors.mobile}</span>}

            <button onClick={sendOtp}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp}>Verify OTP</button>
          </>
        )}

        {step === 3 && (
          <>
            {/* PASSWORD FIELD */}
            <div className="password-box">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "error-input" : ""}
              />
              <span onClick={() => setShowPass(!showPass)}>
                {showPass ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {/* PASSWORD RULES */}
            <ul className="password-rules">
              <li className={rules.length ? "valid" : ""}>Minimum 8 characters</li>
              <li className={rules.upper ? "valid" : ""}>
                At least one uppercase letter
              </li>
              <li className={rules.lower ? "valid" : ""}>
                At least one lowercase letter
              </li>
              <li className={rules.number ? "valid" : ""}>
                At least one number
              </li>
              <li className={rules.special ? "valid" : ""}>
                At least one special character
              </li>
            </ul>

            {/* CONFIRM PASSWORD */}
            <div className="password-box">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "error-input" : ""}
              />
              <span onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}

            <button onClick={createAccount}>Create Account</button>
          </>
        )}

        {step !== 2 && (
          <p>
            Already have account? <Link to="/login">Login</Link>
          </p>
        )}
      </div>

      {/* ===== RESTORE ACCOUNT POPUP ===== */}
      {showRestorePopup && (
        <div className="restore-overlay">
          <div className="restore-box">

            <div className="restore-icon">
              <FaUserCheck />
            </div>

            <h3 className="restore-title">Account Found!</h3>

            <p className="restore-msg">
              This email (<strong>{restoreEmail}</strong>) has a pending account
              deletion request.
              <br /><br />
              Would you like to <strong>restore your old account</strong> and continue
              using Adugalam?
            </p>

            <div className="restore-actions">
              <button
                className="restore-btn-cancel"
                onClick={() => setShowRestorePopup(false)}
                disabled={restoreLoading}
              >
                No, Cancel
              </button>
              <button
                className="restore-btn-confirm"
                onClick={handleRestoreAccount}
                disabled={restoreLoading}
              >
                {restoreLoading ? "Restoring..." : "Yes, Restore Account"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};


export default SignUp;