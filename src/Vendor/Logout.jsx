import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";
import { logoutUser } from "../utils/auth";

function Logout() {
  const navigate = useNavigate();

  // "logout" | "delete"
  const [activeTab, setActiveTab] = useState("logout");
  const [confirmed, setConfirmed] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [shaking, setShaking] = useState(false);

  const isDelete = activeTab === "delete";

  /* ── Switch tab, reset delete state ── */
  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === "logout") {
      setConfirmed(false);
      setDeleteReason("");
    }
  };

  /* ── Handlers ── */
  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise((res) => setTimeout(res, 750));
    logoutUser();
    navigate("/");
  };

  const handleDeleteAttempt = () => {
    if (!confirmed) {
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
      return;
    }
    // Replace with your real API call
    console.log("Deletion reason:", deleteReason);
    alert("Account deletion request submitted.");
  };

  return (
    <div className="lo-container">
      <div className={`lo-card ${isDelete ? "lo-mode-delete" : ""}`}>

        {/* ══════════════════════════════
            TWO BUTTONS AT TOP
            ══════════════════════════════ */}
        <div className="lo-tabs" role="tablist">
          <button
            id="lo-tab-logout"
            role="tab"
            aria-selected={!isDelete}
            className={`lo-tab lo-tab--logout ${!isDelete ? "lo-active" : ""}`}
            onClick={() => switchTab("logout")}
          >
            <span className="lo-tab-icon">🔒</span>
            Logout
          </button>

          <button
            id="lo-tab-delete"
            role="tab"
            aria-selected={isDelete}
            className={`lo-tab lo-tab--delete ${isDelete ? "lo-active" : ""}`}
            onClick={() => switchTab("delete")}
          >
            <span className="lo-tab-icon">🗑️</span>
            Delete Account
          </button>
        </div>

        {/* ══════════════════════════════
            LOGOUT PANEL (shown when logout tab active)
            ══════════════════════════════ */}
        {!isDelete && (
          <div
            className="lo-panel"
            key="panel-logout"
            role="tabpanel"
            aria-labelledby="lo-tab-logout"
          >
            {/* Icon */}
            <div className="lo-avatar lo-avatar--green" aria-hidden="true">🔓</div>

            {/* Heading */}
            <h2 className="lo-title">Secure Logout</h2>

            {/* Status badge */}
            <div className="lo-badge lo-badge--green">
              <span className="lo-badge-dot" />
              Session Active
            </div>

            {/* Description */}
            <p className="lo-desc">
              Ready to step away? Your turf data stays safe and your listings
              remain active. Log back in anytime to manage your bookings.
            </p>

            {/* Info chips */}
            <div className="lo-chips">
              <span className="lo-chip">📋 Bookings Preserved</span>
              <span className="lo-chip">🔐 Data Secured</span>
              <span className="lo-chip">⚡ Quick Re-login</span>
            </div>

            {/* CTA */}
            <div className="lo-actions">
              <button
                id="lo-btn-logout"
                className="lo-btn lo-btn--logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <><span className="lo-spinner" /> Signing out…</>
                ) : (
                  <>🔒 Logout Now</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            DELETE PANEL (shown when delete tab active)
            ══════════════════════════════ */}
        {isDelete && (
          <div
            className="lo-panel"
            key="panel-delete"
            role="tabpanel"
            aria-labelledby="lo-tab-delete"
          >
            {/* Icon */}
            <div className="lo-avatar lo-avatar--red" aria-hidden="true">⚠️</div>

            {/* Heading */}
            <h2 className="lo-title lo-title--danger">Delete Account</h2>

            {/* Danger badge */}
            <div className="lo-badge lo-badge--red">
              <span className="lo-badge-dot" />
              Danger Zone
            </div>

            {/* Description */}
            <p className="lo-desc">
              This action is <strong style={{ color: "#dc2626" }}>permanent and cannot be undone</strong>.
              All your turf listings, bookings, and financial records will be
              permanently removed.
            </p>

            {/* Warning list */}
            <ul className="lo-warnings">
              <li className="lo-warn-item">
                <span className="lo-warn-icon">🏟️</span>
                All turf listings will be permanently removed
              </li>
              <li className="lo-warn-item">
                <span className="lo-warn-icon">📅</span>
                Active &amp; past booking history deleted
              </li>
              <li className="lo-warn-item">
                <span className="lo-warn-icon">💳</span>
                Payout history &amp; payment records lost forever
              </li>
            </ul>

            {/* Reason For Deletion */}
            <div className="lo-reason">
              <label htmlFor="lo-reason-input" className="lo-reason-label">
                Why are you leaving? <span style={{ color: "var(--vl-red)" }}>*</span>
              </label>
              <textarea
                id="lo-reason-input"
                className="lo-reason-textarea"
                placeholder="Please tell us why you are deleting your account..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                rows="3"
              ></textarea>
            </div>

            {/* Confirm checkbox */}
            <label className="lo-confirm" htmlFor="lo-chk">
              <input
                type="checkbox"
                id="lo-chk"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <span className="lo-confirm-text">
                I understand this is irreversible and want to permanently delete my account
              </span>
            </label>

            {/* Actions */}
            <div className="lo-actions">
              <button
                id="lo-btn-back"
                className="lo-btn lo-btn--ghost"
                onClick={() => switchTab("logout")}
              >
                ← Back
              </button>
              <button
                id="lo-btn-delete"
                className={`lo-btn lo-btn--danger${shaking ? " lo-shake" : ""}`}
                disabled={!confirmed || !deleteReason.trim()}
                onClick={handleDeleteAttempt}
              >
                🗑️ Delete Forever
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="lo-footer">
          Need help?&nbsp;
          <a href="/support">Contact our support team</a> before deleting.
        </div>

      </div>
    </div>
  );
}

export default Logout;
