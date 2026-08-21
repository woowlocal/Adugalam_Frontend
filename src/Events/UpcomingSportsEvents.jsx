import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
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

const getDaysLeft = (dateStr) => {
  if (!dateStr) return "Soon";
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays > 0) return `${diffDays}d`;
  return "Soon";
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
        <div className={`nb-container1 ${showAll ? "grid-view1" : ""}`}>
          {(showAll ? events : events.slice(0, 4)).map((e) => (
            <div className="nb-card1" key={e.id} onClick={() => navigate("/eventbooking", { state: { eventId: e.id } })}>
              <div className="img-wrapper1">
                {e.image ? (
                  <img src={e.image} className="nb-img1" alt={e.title} />
                ) : (
                  <div className="nb-img1 upcoming-placeholder" style={{ background: e.bg_color || "#a5b4fc", display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTrophy size={32} color="#fff" /></div>
                )}
                <span className="distance1">{getDaysLeft(e.start_date)}</span>
              </div>

              <h4>{e.title}</h4>

              <div className="loc1">
                <FaMapMarkerAlt size={12} style={{ marginRight: '4px' }} />
                {e.location}
              </div>

              <div className="nb-games1">
                <span className="nb-game-tag1"><FaCalendarAlt size={10} style={{ marginRight: '4px' }} /> {fmtDate(e.start_date)}</span>
                <span className="nb-game-tag1"><FaClock size={10} style={{ marginRight: '4px' }} /> {fmtTime(e.start_time)}</span>
              </div>

              <div className="loc1" style={{ marginTop: 'auto', marginBottom: '10px', justifyContent: 'space-between', alignItems: 'center', paddingRight: '5px' }}>
                <span style={{ fontWeight: 'bold', color: '#0a7c3c', fontSize: '14px' }}>{e.price}</span>
                <button style={{ background: 'rgba(10, 124, 60, 0.08)', color: '#0a7c3c', border: '1px solid rgba(10, 124, 60, 0.18)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(ev) => { ev.currentTarget.style.background = 'rgba(234, 83, 12, 0.10)'; ev.currentTarget.style.color = '#ea530c'; ev.currentTarget.style.borderColor = 'rgba(234, 83, 12, 0.28)'; }}
                  onMouseOut={(ev) => { ev.currentTarget.style.background = 'rgba(10, 124, 60, 0.08)'; ev.currentTarget.style.color = '#0a7c3c'; ev.currentTarget.style.borderColor = 'rgba(10, 124, 60, 0.18)'; }}
                >
                  REGISTER NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}