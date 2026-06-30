import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import {
  FaLock,
  FaShieldAlt,
  FaFileAlt,
  FaUserTimes,
  FaChevronRight,
  FaTrash,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";
import { VscChevronLeft } from "react-icons/vsc";

const Settings = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 SUBMIT RETIRE REQUEST TO BACKEND
  const handleDeleteAccount = async () => {
    if (!reason.trim()) {
      setError("Please enter a reason before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access");

      const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/user/retire-request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Logout after successful request
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("isAuthenticated");
      window.dispatchEvent(new Event("authChange"));

      setShowConfirm(false);
      alert("Your account deletion request has been submitted. Admin will review it shortly.");
      navigate("/login");

    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowConfirm(false);
    setReason("");
    setError("");
  };

  return (
    <div className="Settings-Page">
      <div className="settings-inner">

        {/* ✅ HEADER */}
        <div className="setting-header">
          <button
            className="animated-back-btn"
            data-text="Back"
            onClick={() => navigate(-1)}
          >
            <VscChevronLeft className="animated-back-icon" />
          </button>

          <h2 className="Setting-heading">Settings</h2>

          {/* Invisible spacer to keep title centered */}
          <div className="header-spacer" />
        </div>

        <div className="Setting-List">

        <div
          className="Setting-items"
          onClick={() => navigate("/ChangePassword")}
        >
          <FaLock />
          <span>Change Password</span>
          <FaChevronRight />
        </div>

        <div
          className="Setting-items"
          onClick={() => navigate("/Privacy")}
        >
          <FaShieldAlt />
          <span>Privacy &amp; Policy</span>
          <FaChevronRight />
        </div>

        <div
          className="Setting-items"
          onClick={() => navigate("/Terms")}
        >
          <FaFileAlt />
          <span>Terms &amp; Conditions</span>
          <FaChevronRight />
        </div>

        {/* DELETE ACCOUNT */}
        <div
          className="Setting-items danger"
          onClick={() => setShowConfirm(true)}
        >
          <FaUserTimes />
          <span>Delete Account</span>
          <FaChevronRight />
        </div>

        </div>

      </div>{/* end settings-inner */}

      {/* ✅ DELETE ACCOUNT POPUP WITH REASON */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box delete-reason-box">

            <div className="modal-icon">
              <FaExclamationTriangle />
            </div>

            <h3 className="modal-title">Delete Account</h3>

            <p className="modal-text">
              Please tell us <strong>why</strong> you want to delete your account.
              Your request will be reviewed by our admin team.
            </p>

            <textarea
              className="retire-reason-input"
              placeholder="Enter your reason here..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              rows={4}
            />

            {error && <p className="retire-error">{error}</p>}

            <div className="modal-actions">

              <button
                className="btn-no"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="btn-yes"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

            </div>

            <p className="retire-note">
              ⚠️ Your account will be deactivated after admin approval.
            </p>

          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;