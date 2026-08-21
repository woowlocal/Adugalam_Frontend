import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaCalendarAlt, FaEllipsisH, FaMapMarkerAlt, FaClock, FaStar } from "react-icons/fa";
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

                const mapped = data
                    .filter(e => {
                        const status = (e.status || "").toLowerCase();
                        if (status === "completed" || status === "finished" || status === "past") return false;


                        if (e.end_date) {
                            const end = new Date(e.end_date);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            if (end < today) return false;
                        } else if (e.start_date) {

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
            result = result.filter(e => {
                if (!e.start_date) return false;
                const d = new Date(e.start_date);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === now.getTime();
            });
        } else if (filter === "Week") {
            const nextWeek = new Date(now);
            nextWeek.setDate(now.getDate() + 7);
            result = result.filter(e => {
                if (!e.start_date) return false;
                const d = new Date(e.start_date);
                return d >= now && d <= nextWeek;
            });
        } else if (filter === "Month") {
            result = result.filter(e => {
                if (!e.start_date) return false;
                const d = new Date(e.start_date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        } else if (filter === "Price") {

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
                    <div className={`nb-container1 ${showAll ? "grid-view1" : ""}`}>
                        {displayedEvents.map((event) => (
                            <div className="nb-card1" key={event.id} onClick={() => navigate("/eventbooking", { state: { eventId: event.id } })}>
                                <div className="img-wrapper1">
                                    {event.image ? (
                                        <img src={event.image} className="nb-img1" alt={event.title} />
                                    ) : (
                                        <div className="nb-img1 poster-placeholder" style={{ background: event.bg_color || "#a5b4fc", display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaStar size={32} color="#fff" /></div>
                                    )}
                                    <span className="distance1">Featured</span>
                                </div>

                                <h4>{event.title}</h4>

                                <div className="loc1">
                                    <FaMapMarkerAlt size={12} style={{ marginRight: '4px' }} />
                                    {event.location}
                                </div>

                                <div className="nb-games1">
                                    <span className="nb-game-tag1"><FaCalendarAlt size={10} style={{ marginRight: '4px' }} /> {fmtDate(event.start_date)}</span>
                                    <span className="nb-game-tag1"><FaClock size={10} style={{ marginRight: '4px' }} /> {fmtTime(event.start_time)}</span>
                                </div>

                                <div className="loc1" style={{ marginTop: 'auto', marginBottom: '10px', justifyContent: 'space-between', alignItems: 'center', paddingRight: '5px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#0a7c3c', fontSize: '14px' }}>{event.price}</span>
                                    <button style={{ background: 'rgba(10, 124, 60, 0.08)', color: '#0a7c3c', border: '1px solid rgba(10, 124, 60, 0.18)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(234, 83, 12, 0.10)'; e.currentTarget.style.color = '#ea530c'; e.currentTarget.style.borderColor = 'rgba(234, 83, 12, 0.28)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(10, 124, 60, 0.08)'; e.currentTarget.style.color = '#0a7c3c'; e.currentTarget.style.borderColor = 'rgba(10, 124, 60, 0.18)'; }}
                                    >
                                        BOOK NOW
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}