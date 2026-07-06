import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./UpcomingSportsEvents.css";
import "../Components/NearBy/Nearby.css";

const BASE = import.meta.env.VITE_API_BASE_URL;

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

export default function UpcomingSportsEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

    fetch(`${API_BASE}/api/events/?status=upcoming`)
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
          bg_color: e.bg_color || "#a5b4fc",
          map_url: e.map_url || null,
        }));
        setEvents(mapped);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);


  return (
    <section className="upcoming-events-page">
      <div className="upcoming-header">
        <h3>Upcoming Sports Events</h3>
        {events.length > 3 && (
          <button className="view-all-btn" style={{ background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', boxShadow: '0 3px 10px rgba(124,58,237,0.28)' }} onClick={() => setShowAll(s => !s)}>
            {showAll ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>Loading events...</p>
      ) : events.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>No upcoming events scheduled. Check back later!</p>
      ) : (
        <div className={`upcoming-grid${showAll ? " upcoming-grid--all" : ""}`}>
          {(showAll ? events : events.slice(0, 4)).map((e) => (
            <div className="upcoming-card" key={e.id} onClick={() => navigate("/eventbooking", { state: { eventId: e.id } })}>
              {/* Image */}
              <div className="upcoming-img-wrapper">
                {e.image ? (
                  <img src={e.image} className="upcoming-img" alt={e.title} />
                ) : (
                  <div className="upcoming-img upcoming-placeholder" style={{ background: e.bg_color || "#a5b4fc" }}>🏆</div>
                )}
                <span className="upcoming-badge-soon">Soon</span>
              </div>

              {/* Body */}
              <div className="upcoming-body">
                <h4 className="upcoming-title">{e.title}</h4>
                <p className="upcoming-location">📍 {e.location}</p>
                
                <div className="upcoming-date-time">
                  <span className="upcoming-tag">📅 {fmtDate(e.start_date)}</span>
                  <span className="upcoming-tag">🕒 {fmtTime(e.start_time)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="upcoming-footer">
                <button className="upcoming-btn-register">REGISTER NOW</button>
                <div className="upcoming-footer-right">
                  <span className="upcoming-price">{e.price}</span>
                  {e.map_url && (
                    <a
                      href={e.map_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(ev) => ev.stopPropagation()}
                      className="upcoming-map-btn"
                    >
                      📍
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}