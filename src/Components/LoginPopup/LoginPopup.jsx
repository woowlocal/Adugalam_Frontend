import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";

const API = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

const LoginPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [isOpen]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      
      window.dispatchEvent(new Event("authChange"));
      onClose();
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    onClose();
    navigate("/signup");
  };

  if (!isOpen) return null;

  return (
    <div className="login-popup-overlay" onClick={onClose}>
      <div className="login-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="login-popup-close" onClick={onClose}>
          &times;
        </button>

        <div className="login-popup-header">
          <h2>Welcome to Adugalam</h2>
          <p>Login to access all features</p>
        </div>

        {error && <div className="login-popup-error">{error}</div>}

        <div className="login-popup-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button 
            className="login-popup-btn" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="login-popup-divider">
            <span>OR</span>
          </div>

          <button 
            className="login-popup-btn signup" 
            onClick={handleSignup}
          >
            Create New Account
          </button>
        </div>

        <div className="login-popup-footer">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
