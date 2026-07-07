import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaCalendarAlt, FaEllipsisH } from "react-icons/fa";
import "./FeaturedEvents.css";
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
                // Map backend fields to component-expected fields and filter out finished events
                const mapped = data
                    .filter(e => {
                        const status = (e.status || "").toLowerCase();
                        if (status === "completed" || status === "finished" || status === "past") return false;
                        
                        // Also check if the event has already ended
                        if (e.end_date) {
                            const end = new Date(e.end_date);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            // Only hide if the end date was STRICTLY before today 
                            // (so we keep events ending today)
                            if (end < today) return false;
                        } else if (e.start_date) {
                            // If there is no end date, check the start date
                            const start = new Date(e.start_date);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            if (start < today) return false;
                        }
                        return true;
                    })
                    .map(e => ({
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

    const getFilteredEvents = () => {
        let result = [...events];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (filter === "Date") {
            // Events starting today
            result = result.filter(e => {
                if (!e.start_date) return false;
                const d = new Date(e.start_date);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === now.getTime();
            });
        } else if (filter === "Week") {
            // Events within the next 7 days
            const nextWeek = new Date(now);
            nextWeek.setDate(now.getDate() + 7);
            result = result.filter(e => {
                if (!e.start_date) return false;
                const d = new Date(e.start_date);
                return d >= now && d <= nextWeek;
            });
        } else if (filter === "Month") {
            // Events in the current month
            result = result.filter(e => {
                if (!e.start_date) return false;
                const d = new Date(e.start_date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        } else if (filter === "Price") {
            // Sort by price (Free first, then ascending)
            result.sort((a, b) => {
                const pA = a.price === "Free" ? 0 : parseInt(String(a.price).replace(/\D/g, "")) || 0;
                const pB = b.price === "Free" ? 0 : parseInt(String(b.price).replace(/\D/g, "")) || 0;
                return pA - pB;
            });
        }
        return result;
    };

    const processedEvents = getFilteredEvents();
    const displayedEvents = showAll ? processedEvents : processedEvents.slice(0, 4);

    return (
        <div className="featured-events-page">
            {/* ── CATEGORIES ── */}
            {/* <section className="category-section">
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
            </section> */}

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
                            <div className="poster-card" key={event.id} onClick={() => navigate("/eventbooking", { state: { eventId: event.id } })}>
                                {/* Image */}
                                <div className="poster-img-wrapper">
                                    {event.image ? (
                                        <img src={event.image} className="poster-img" alt={event.title} />
                                    ) : (
                                        <div className="poster-img poster-placeholder" style={{ background: event.bg_color || "#a5b4fc" }}>🎉</div>
                                    )}
                                    <span className="poster-badge-featured">Featured</span>
                                </div>

                                {/* Body */}
                                <div className="poster-body">
                                    <h4 className="poster-title">{event.title}</h4>
                                    <p className="poster-location">📍 {event.location}</p>

                                    <div className="poster-date-time">
                                        <span className="poster-tag">📅 {fmtDate(event.start_date)}</span>
                                        <span className="poster-tag">🕒 {fmtTime(event.start_time)}</span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="poster-footer">
                                    <button className="poster-btn-book">BOOK NOW</button>
                                    <div className="poster-footer-right">
                                        <span className="poster-price">{event.price}</span>
                                        {event.map_url && (
                                            <a href={event.map_url} target="_blank" rel="noreferrer" onClick={(ev) => ev.stopPropagation()} className="poster-map-btn">📍</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}