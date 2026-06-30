import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api/api";
import "./Login.css";
import backgroundVideo from "../Video/gemini_generated_video_013cca21.mp4";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  /* ── Login Handler ── */
  const handleLogin = async () => {
    try {
      const res = await API.post("api/login/", { email, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (res.data.user.name) {
          localStorage.setItem("userName", res.data.user.name);
        }
      }
      window.dispatchEvent(new Event("authChange"));

      if (location.state?.from) {
        navigate(location.state.from, { state: { booking: location.state.booking } });
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      {/* ── Background Video ── */}
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="video-overlay"></div>

      {/* ── Login Card ── */}
      <div className="premium-glacier-card">
        <h2>Login</h2>
        {error && <p className="error-text">{error}</p>}

        <input
          className={error ? "error-input" : ""}
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
        />

        <div className="password-wrapper">
          <input
            className={error ? "error-input" : ""}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="privacy-checkbox-wrapper">
          <input
            type="checkbox"
            id="privacy-policy"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="privacy-policy">
            I agree to the <Link to="/Privacy">Privacy Policy</Link> and <Link to="/Terms">Terms & Conditions</Link>
          </label>
        </div>

        <button 
          onClick={handleLogin} 
          disabled={!agreed}
          style={{ opacity: agreed ? 1 : 0.6, cursor: agreed ? "pointer" : "not-allowed" }}
        >
          Login
        </button>

        <p><Link to="/forgot-password" state={location.state}>Forgot Password?</Link></p>
        <p>No account? <Link to="/signup" state={location.state}>Signup</Link></p>
      </div>
    </div>
  );
};

export default Login;