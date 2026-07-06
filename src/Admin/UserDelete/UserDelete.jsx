import { useEffect, useState } from "react";
import "./UserDelete.css";

export default function UserDelete() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState(null); // { msg, type }

  const getToken = () => localStorage.getItem("access");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadRequests = () => {
    setLoading(true);
    fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/admin/retire-requests/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setRequests([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (userId, action) => {
    const label = action === "approve" ? "permanently DELETE" : "REJECT and restore";
    if (!window.confirm(`Are you sure you want to ${label} this account?`)) return;

    setProcessingId(userId);

    try {
      const res = await fetch(
        `${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/admin/retire-requests/${userId}/action/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ action }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        showToast(
          data.message || "Done.",
          action === "approve" ? "danger" : "success"
        );
        loadRequests();
      } else {
        showToast(data.error || "Something went wrong.", "danger");
      }
    } catch {
      showToast("Network error. Please try again.", "danger");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="ud-page">

      {/* ── TOAST ── */}
      {toast && (
        <div className={`ud-toast ud-toast--${toast.type}`}>{toast.msg}</div>
      )}

      {/* ── HEADER ── */}
      <div className="ud-header">
        <div className="ud-header-left">
          <span className="ud-header-icon">🗑️</span>
          <div>
            <h2 className="ud-title">Account Deletion Requests</h2>
            <p className="ud-subtitle">
              Users pending approval to delete their account
            </p>
          </div>
        </div>
        <div className="ud-count-badge">
          {requests.length} Pending
        </div>
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="ud-loading">
          <div className="ud-spinner" />
          <span>Loading requests…</span>
        </div>
      )}

      {/* ── EMPTY ── */}
      {!loading && requests.length === 0 && (
        <div className="ud-empty">
          <div className="ud-empty-icon">📁</div>
          <h3>No Pending Requests</h3>
          <p>No users have requested account deletion.</p>
        </div>
      )}

      {/* ── CARDS ── */}
      {!loading && requests.length > 0 && (
        <div className="ud-cards">
          {requests.map((user) => (
            <div key={user.id} className="ud-card">

              {/* Card top — user info */}
              <div className="ud-card-top">
                <div className="ud-avatar">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="ud-user-info">
                  <span className="ud-user-name">{user.name}</span>
                  <span className="ud-user-email">{user.email}</span>
                  <span className="ud-user-phone">📞 {user.mobile || "—"}</span>
                </div>
                <span className="ud-status-pill">Pending</span>
              </div>

              {/* Reason */}
              <div className="ud-reason-block">
                <span className="ud-reason-label">Reason for deletion</span>
                <p className="ud-reason-text">
                  {user.retire_reason || "No reason provided"}
                </p>
              </div>

              {/* Requested at */}
              <div className="ud-meta">
                <span className="ud-meta-icon">🕐</span>
                <span>Requested on {formatDate(user.retire_requested_at)}</span>
              </div>

              {/* Actions */}
              <div className="ud-actions">
                <button
                  className="ud-btn ud-btn--reject"
                  onClick={() => handleAction(user.id, "reject")}
                  disabled={processingId === user.id}
                >
                  {processingId === user.id ? "…" : "❌ Reject"}
                </button>
                <button
                  className="ud-btn ud-btn--approve"
                  onClick={() => handleAction(user.id, "approve")}
                  disabled={processingId === user.id}
                >
                  {processingId === user.id ? "…" : "Approve & Delete"}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
