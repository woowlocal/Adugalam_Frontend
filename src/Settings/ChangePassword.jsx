import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { VscChevronLeft } from "react-icons/vsc";
import "./ChangePassword.css";
import { logoutUser } from "../utils/auth";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Client-side validation before hitting the API
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    const accessToken = localStorage.getItem("access");
    if (!accessToken) {
      setError("You are not logged in. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/user/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show the backend error message (e.g. "Old password is incorrect")
        setError(data.error || "Failed to change password. Please try again.");
        return;
      }

      setSuccess("Password changed successfully. Please login again.");

      // Log the user out so they re-authenticate with the new password
      setTimeout(() => {
        logoutUser();
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">

      {/* ✅ HEADER WITH BACK BUTTON */}
      <div className="change-header">
        <button
          className="animated-back-btn"
          data-text="Back"
          onClick={() => navigate(-1)}
        >
          <VscChevronLeft className="animated-back-icon" />
        </button>

        <h2>Change Password</h2>
      </div>

      <form className="change-password-card" onSubmit={handleChangePassword}>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <label>Old Password</label>
        <input
          type="password"
          placeholder="Enter old password"
          value={oldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value);
            setError("");
          }}
        />

        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setError("");
          }}
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError("");
          }}
        />

        <button type="submit" className="change-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>

      </form>
    </div>
  );
};

export default ChangePassword;