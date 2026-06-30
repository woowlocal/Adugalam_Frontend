import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaCalendarAlt, FaEllipsisH } from "react-icons/fa";
import "./FeaturedEvents.css";

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

export default function FeaturedEvents() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");
    const [showAll, setShowAll] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

        fetch(`${API_BASE}/api/events/`)
            .then(r => {
                if (!r.ok) throw new Error("API not found");
                return r.json();
            })
            .then(data => {
                // Map backend fields to component-expected fields
                const mapped = data.map(e => ({
                    id: e.id,
                    title: e.title,
                    location: e.location || e.address || "TBA",
                    start_date: e.start_date || "",
                    end_date: e.end_date || "",
                    start_time: e.start_time || "",
                    end_time: e.end_time || "",
                    price: e.price || (e.is_free ? "Free" : `₹${e.amount}`),
                    image: e.image || null,
                    bg_color: e.bg_color || "#a5b4fc",
                    status: e.status,
                }));
                setEvents(mapped);
            })
            .catch(() => setEvents([]))
            .finally(() => setLoading(false));
    }, []);


    const displayedEvents = showAll ? events : events.slice(0, 4);

    return (
        <div className="featured-events-page">
            {/* ── CATEGORIES ── */}
            <section className="category-section">
                <h3>Categories</h3>
                <div className="categories">
                    <div className="category-card">
                        <div className="icon-box"><FaTrophy className="category-icon" /></div>
                        <h4>Sports</h4>
                    </div>
                    <div className="category-card">
                        <div className="icon-box"><FaCalendarAlt className="category-icon" /></div>
                        <h4>Events</h4>
                    </div>
                    <div className="category-card">
                        <div className="icon-box"><FaEllipsisH className="category-icon" /></div>
                        <h4>Others</h4>
                    </div>
                </div>
            </section>

            {/* ── FEATURED EVENTS ── */}
            <section className="events-section">
                <div className="featured-top">
                    <h3>Featured Events</h3>
                    <div className="featured-actions">
                        <select
                            className="featured-filter"
                            value={filter}
                            onChange={(e) => { setFilter(e.target.value); setShowAll(false); }}
                        >
                            <option>All</option>
                            <option>Date</option>
                            <option>Week</option>
                            <option>Month</option>
                            <option>Price</option>
                        </select>
                        <button className="view-all-btn" onClick={() => setShowAll(!showAll)}>
                            {showAll ? "Show Less" : "View All"}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="fe-status-msg">Loading events…</p>
                ) : displayedEvents.length === 0 ? (
                    <p className="fe-status-msg">No featured events right now. Check back soon!</p>
                ) : (
                    <div className={`poster-grid${showAll ? " poster-grid--all" : ""}`}>
                        {displayedEvents.map((event) => (
                            <div
                                className="poster-card"
                                key={event.id}
                                onClick={() => navigate("/eventbooking", { state: { eventId: event.id } })}
                                style={{ cursor: "pointer" }}
                            >
                                {/* Image */}
                                <div className="poster-image">
                                    {event.image ? (
                                        <img src={event.image} alt={event.title} />
                                    ) : (
                                        <div className="poster-placeholder" style={{ background: event.bg_color || "#a5b4fc" }}>
                                            🎉
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="poster-info" style={{ background: event.bg_color || "#a5b4fc" }}>
                                    <h4>{event.title}</h4>
                                    <p className="poster-location">📍 {event.location}</p>
                                    <div className="poster-meta">
                                        <span>📅 {fmtDate(event.start_date)} – {fmtDate(event.end_date)}</span>
                                        <span>🕒 {fmtTime(event.start_time)} – {fmtTime(event.end_time)}</span>
                                    </div>
                                    <span className="poster-price">{event.price}</span>
                                </div>

                                {/* Map & Book */}
                                <div className="poster-footer">
                                    {event.map_url && (
                                        <a
                                            href={event.map_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="poster-map-btn"
                                        >
                                            📍 Map
                                        </a>
                                    )}
                                    <div className="poster-book">BOOK NOW</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}