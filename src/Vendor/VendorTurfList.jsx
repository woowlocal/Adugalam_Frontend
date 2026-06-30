import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorTurfList.css";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "") + "/api/vendor/my-turfs/";
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${API_BASE}${img}`;
};

/* SVG Icons */
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default function VendorTurfList() {
  const [turfs, setTurfs]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [maintenancePopup, setMaintenancePopup] = useState(null); // { turfId, turfName }
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const navigate = useNavigate();

  /* ── Fetch ── */
  const fetchTurfs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("access");
      if (!token) { setError("Session expired. Please login again."); return; }

      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setTurfs(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || "Failed to load turf list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTurfs(); }, []);

  /* ── Maintenance toggle ── */
  const handleMaintenanceToggle = (turf) => {
    if (!turf.is_maintenance) {
      setMaintenancePopup({ turfId: turf.id, turfName: turf.name });
    } else {
      doToggleMaintenance(turf.id);
    }
  };

  const doToggleMaintenance = async (turfId) => {
    setMaintenanceLoading(true);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(
        `${API_BASE}/api/vendor/turfs/${turfId}/maintenance/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle maintenance.");

      setTurfs((prev) =>
        prev.map((t) =>
          t.id === turfId ? { ...t, is_maintenance: data.is_maintenance } : t
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setMaintenanceLoading(false);
      setMaintenancePopup(null);
    }
  };

  /* ── Delete Turf ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this turf? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE}/api/vendor/turfs/${id}/update/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete turf");
      alert("Turf deleted successfully!");
      fetchTurfs(); // Refetch list
    } catch (err) {
      console.error(err);
      alert("Error deleting turf");
    }
  };


  /* ── Render ── */
  return (
    <div className="vtl-page">
      <div className="vtl-container">

        {/* HERO HEADER */}
        <div className="vtl-hero">
          <div className="vtl-hero-text">
            <div className="vtl-hero-eyebrow">Turf Management</div>
            <h1>My Turf Listings</h1>
            <p>View, manage, and control all your registered grounds from one place.</p>
          </div>
          <div className="vtl-hero-right">
            {!loading && !error && (
              <span className="vtl-hero-count">
                {turfs.length} turf{turfs.length !== 1 ? "s" : ""} total
              </span>
            )}
            <button className="vtl-add-btn" onClick={() => navigate("/VendorAddTurf")}>
              <PlusIcon /> Add Turf
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="vtl-loading">
            <div className="vtl-spinner" />
            <span>Loading your turfs…</span>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="vtl-error">⚠ {error}</div>
        )}

        {/* EMPTY */}
        {!loading && !error && turfs.length === 0 && (
          <div className="vtl-empty">
            <div className="vtl-empty-icon">🏟️</div>
            <h3>No turfs listed yet</h3>
            <p>Add your first ground to start accepting bookings from players.</p>
            <button className="vtl-empty-cta" onClick={() => navigate("/VendorAddTurf")}>
              <PlusIcon /> Add Your First Turf
            </button>
          </div>
        )}

        {/* TURF CARDS GRID */}
        {!loading && !error && turfs.length > 0 && (
          <div className="vtl-grid">
            {turfs.map((turf) => {
              const bannerImg  = turf.banner_images?.[0]  ? getImageUrl(turf.banner_images[0])  : null;
              const galleryArr = (turf.gallery_images || []).slice(0, 3).map(getImageUrl);
              const isMaint    = !!turf.is_maintenance;

              return (
                <div key={turf.id} className={`vtl-card${isMaint ? " vtl-card--maintenance" : ""}`}>
                  
                  {/* BANNER */}
                  <div className="vtl-banner">
                    {bannerImg ? (
                      <img src={bannerImg} alt={turf.name} />
                    ) : (
                      <div className="vtl-banner-placeholder">
                        <span>🏟️</span>
                        <span>No Banner</span>
                      </div>
                    )}

                    {/* Maintenance overlay badge */}
                    {isMaint && (
                      <span className="vtl-maintenance-badge">🔧 Maintenance</span>
                    )}

                    {/* Gallery thumbnail strip */}
                    {galleryArr.length > 0 && (
                      <div className="vtl-gallery-strip">
                        {galleryArr.slice(0, 2).map((src, i) => (
                          <img key={i} src={src} alt="" className="vtl-gallery-thumb" />
                        ))}
                        {(turf.gallery_images?.length || 0) > 2 && (
                          <div className="vtl-gallery-more">
                            +{turf.gallery_images.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CARD BODY */}
                  <div className="vtl-body">

                    {/* Name */}
                    <h3 className="vtl-name">{turf.name}</h3>

                    {/* Location */}
                    {turf.location && (
                      <div className="vtl-location">
                        <span className="vtl-location-icon">📍</span>
                        <span>{turf.location}</span>
                      </div>
                    )}

                    {/* Price + Slots count */}
                    <div className="vtl-meta">
                      <span className="vtl-price">
                        ₹{turf.price_per_hour}
                        <span className="vtl-price-sub"> / hr</span>
                      </span>
                      {turf.slots?.length > 0 && (
                        <span className="vtl-slots-badge">
                          🕐 {turf.slots.length} slot{turf.slots.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Games chips */}
                    {(() => {
                      let games = turf.games;
                      if (typeof games === "string") {
                        try { games = JSON.parse(games); } catch { games = []; }
                      }
                      if (!Array.isArray(games)) games = [];
                      // Deduplicate
                      games = [...new Set(games.map(g => String(g).replace(/[\[\]"']/g, "").trim()))].filter(Boolean);
                      return games.length > 0 ? (
                        <div className="vtl-chips">
                          {games.map((g, i) => (
                            <span key={i} className="vtl-chip">{g}</span>
                          ))}
                        </div>
                      ) : null;
                    })()}

                    {/* Slots preview */}
                    {turf.slots?.length > 0 && (
                      <div className="vtl-slots-list">
                        {turf.slots.slice(0, 2).map((s, i) => (
                          <div key={i} className="vtl-slot-row">
                            <span className="vtl-slot-time">{s.time_display || `${s.start_time} – ${s.end_time}`}</span>
                            <span className="vtl-slot-price">₹{s.price}</span>
                          </div>
                        ))}
                        {turf.slots.length > 2 && (
                          <span className="vtl-more-slots">+{turf.slots.length - 2} more slots</span>
                        )}
                      </div>
                    )}

                  </div>

                  {/* CARD FOOTER */}
                  <div className="vtl-footer">
                    {/* Maintenance toggle */}
                    <div className="vtl-toggle-wrap">
                      <span className="vtl-toggle-label-text">Maintenance</span>
                      <label className="vtl-toggle">
                        <input
                          type="checkbox"
                          checked={isMaint}
                          onChange={() => handleMaintenanceToggle(turf)}
                          disabled={maintenanceLoading}
                        />
                        <span className="vtl-toggle-slider" />
                      </label>
                      <span className={`vtl-toggle-status vtl-toggle-status--${isMaint ? "on" : "off"}`}>
                        {isMaint ? "ON" : "OFF"}
                      </span>
                    </div>

                    {/* Edit button */}
                    <div className="vtl-actions">
                      <button
                        className="vtl-edit-btn"
                        onClick={() => navigate(`/VendorEditTurf/${turf.id}`)}
                      >
                        <EditIcon /> Edit
                      </button>
                      <button
                        className="vtl-delete-btn"
                        onClick={() => handleDelete(turf.id)}
                        style={{ marginLeft: "10px", backgroundColor: "#ef4444", color: "white", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MAINTENANCE CONFIRMATION POPUP */}
      {maintenancePopup && (
        <div className="vtl-popup-overlay">
          <div className="vtl-popup">
            <div className="vtl-popup-icon">🔧</div>
            <h3 className="vtl-popup-name">{maintenancePopup.turfName}</h3>
            <span className="vtl-popup-tag">Maintenance Mode</span>
            <p className="vtl-popup-desc">
              This turf will be <strong>hidden from players</strong> while maintenance
              mode is active. You can disable it anytime.
            </p>
            <div className="vtl-popup-btns">
              <button
                className="vtl-popup-cancel"
                onClick={() => setMaintenancePopup(null)}
                disabled={maintenanceLoading}
              >
                Cancel
              </button>
              <button
                className="vtl-popup-confirm"
                onClick={() => doToggleMaintenance(maintenancePopup.turfId)}
                disabled={maintenanceLoading}
              >
                {maintenanceLoading ? "Enabling…" : "Enable Maintenance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}