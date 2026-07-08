import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./OngoingSportsEvents.css";

const fmtDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${((hr % 12) || 12).toString().padStart(2, "0")}:${m} ${hr >= 12 ? "PM" : "AM"}`;
};

export default function OngoingSportsEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

    fetch(`${API_BASE}/api/events/?status=ongoing`)
      .then(r => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then(data => {
        const mapped = data.map(e => ({
          id: e.id,
          title: e.title,
          location: e.location || "TBA",
          start_date: e.start_date || "",
          end_date: e.end_date || "",
          start_time: e.start_time || "",
          end_time: e.end_time || "",
          price: e.price || (e.is_free ? "Free" : `₹${e.amount}`),
          image: e.image || null,
          bg_color: e.bg_color || "#f59e0b",
          map_url: e.map_url || null,
        }));
        setEvents(mapped);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="ongoing-section">
      <div className="ongoing-header">
        <h3>🔥 Ongoing Sports Events</h3>
        {events.length > 3 && (
          <button className="view-all-btn" style={{ background: 'linear-gradient(135deg,#dc2626,#ef4444)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', boxShadow: '0 3px 10px rgba(220,38,38,0.28)' }} onClick={() => setShowAll(s => !s)}>
            {showAll ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>Loading events...</p>
      ) : events.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>No ongoing events for today. Check back later!</p>
      ) : (
        <div className={`ongoing-grid${showAll ? " ongoing-grid--all" : ""}`}>
          {(showAll ? events : events.slice(0, 4)).map((e, index) => (
            <div className={`ongoing-card ${index === 0 ? "ongoing-card--featured" : ""}`} key={e.id} onClick={() => navigate("/eventbooking", { state: { eventId: e.id } })}>
              {/* Image */}
              <div className="ongoing-card-image">
                {e.image ? (
                  <img src={e.image} alt={e.title} />
                ) : (
                  <div className="ongoing-placeholder" style={{ background: e.bg_color || "#f59e0b" }}>🎉</div>
                )}
                <span className="ongoing-live-badge">{index === 0 ? "★ FEATURED LIVE" : "LIVE"}</span>
              </div>

              {/* Body */}
              <div className="ongoing-card-body">
                <h4>{e.title}</h4>
                <p className="ongoing-card-meta">📍 {e.location}</p>
                <p className="ongoing-card-meta">
                  📅 {fmtDate(e.start_date)} – {fmtDate(e.end_date)}
                </p>
                <p className="ongoing-card-meta">
                  🕒 {fmtTime(e.start_time)} – {fmtTime(e.end_time)}
                </p>
              </div>

              {/* Footer */}
              <div className="ongoing-card-footer">
                <span className="ongoing-price">{e.price}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {e.map_url && (
                    <a
                      href={e.map_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(ev) => ev.stopPropagation()}
                      className="ongoing-map-btn"
                    >
                      📍
                    </a>
                  )}
                  <button className="ongoing-btn">Join Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}