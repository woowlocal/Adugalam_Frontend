import React, { useEffect, useState, useRef } from "react";
import "./MyBooking.css";
import html2canvas from "html2canvas";

import {
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaTimes,
  FaHashtag,
  FaRunning,
  FaUser,
  FaDownload
} from "react-icons/fa";
import { VscChevronLeft } from "react-icons/vsc";
import { RiCloseCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com/";

const MyBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("turfs");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null); // click to open modal
  const [selectedEventCard, setSelectedEventCard] = useState(null);
  const eventReceiptRef = useRef(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/booking/my-bookings/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const eventRes = await fetch(`${API_BASE}/api/events/my-bookings/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const eventData = await eventRes.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch turf bookings");
        } else {
          setBookings(data.filter((b) => b.payment_status === "SUCCESS"));
        }

        if (eventRes.ok) {
          setEventBookings(eventData);
        }

      } catch (err) {
        console.error("Booking fetch error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const openModal = (item) => setSelectedCard(item);
  const closeModal = () => setSelectedCard(null);
  const openEventModal = (item) => setSelectedEventCard(item);
  const closeEventModal = () => setSelectedEventCard(null);

  const handleDownloadEventTicket = async () => {
    if (!eventReceiptRef.current) return;
    try {
      const canvas = await html2canvas(eventReceiptRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Adugalam-EventTicket-${selectedEventCard?.booking_ref || "ticket"}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate ticket image:", err);
    }
  };

  const getStatusConfig = (status) => {
    if (status === "SUCCESS")
      return {
        icon: <FaCheckCircle />,
        label: "Payment Successful",
        className: "success",
        color: "#16a34a",
        bg: "#dcfce7",
      };
    if (status === "FAILED")
      return {
        icon: <FaTimesCircle />,
        label: "Payment Failed",
        className: "failed",
        color: "#dc2626",
        bg: "#fee2e2",
      };
    return {
      icon: <FaHourglassHalf />,
      label: "Payment Pending",
      className: "pending",
      color: "#d97706",
      bg: "#fef3c7",
    };
  };

  const formatGameName = (name) => {
    if (!name) return "";
    try {
      const parsed = JSON.parse(name);
      return Array.isArray(parsed) ? parsed.join(", ") : name;
    } catch {
      return name;
    }
  };

  if (loading)
    return <h3 style={{ textAlign: "center", marginTop: "60px" }}>Loading bookings...</h3>;

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h3>{error}</h3>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Header */}
        <div className="booking-header">
          <div className="back-btn-wrapper">
            <button className="animated-back-btn" data-text="Back" onClick={() => navigate(-1)}>
              <VscChevronLeft className="animated-back-icon" />
            </button>
          </div>
          <h2 className="page-title">My Bookings</h2>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", margin: "0 20px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <button
            onClick={() => setActiveTab("turfs")}
            style={{ padding: "10px 16px", background: "none", border: "none", borderBottom: activeTab === "turfs" ? "3px solid #16a34a" : "3px solid transparent", color: activeTab === "turfs" ? "#16a34a" : "#64748b", fontWeight: 600, fontSize: "16px", cursor: "pointer" }}
          >
            Turfs
          </button>
          <button
            onClick={() => setActiveTab("events")}
            style={{ padding: "10px 16px", background: "none", border: "none", borderBottom: activeTab === "events" ? "3px solid #7c3aed" : "3px solid transparent", color: activeTab === "events" ? "#7c3aed" : "#64748b", fontWeight: 600, fontSize: "16px", cursor: "pointer" }}
          >
            Events
          </button>
        </div>

        {/* Booking List */}
        {activeTab === "turfs" ? (
          bookings.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>No turf bookings found</p>
          ) : (
            <div className="booking-list">
            {bookings.map((item) => {
              const status = getStatusConfig(item.payment_status);
              return (
                <div
                  className="booking-card"
                  key={item.booking_id}
                  onClick={() => openModal(item)}
                >
                  {/* Turf Image */}
                  {item.turf_image && (
                    <div className="booking-image-container">
                      <img
                        src={item.turf_image}
                        alt={item.turf_name}
                        className="booking-turf-image"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="booking-info">
                    {/* <span className="booking-id">#{item.booking_id}</span> */}
                    <h3>{item.turf_name}</h3>
                    <p className="booking-game" style={{ fontSize: "13px", color: "#475569", marginBottom: "4px", fontWeight: "600" }}>{formatGameName(item.game_name)}</p>
                    <p className="booking-date">{item.date}</p>
                    <p className="booking-time">{item.slots.join(", ")}</p>
                    <span
                      className="booking-status-badge"
                      style={{ color: status.color, background: status.bg }}
                    >
                      {item.payment_status}
                    </span>
                  </div>

                  {/* Price + tap hint */}
                  <div className="booking-right">
                    <div className="booking-price">₹{item.total_price}</div>
                    <div className="tap-hint">Tap for details</div>
                  </div>
                </div>
              );
            })}
            </div>
          )
        ) : (
          eventBookings.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>No event bookings found</p>
          ) : (
            <div className="booking-list">
              {eventBookings.map((item) => (
                <div className="booking-card" key={item.id} onClick={() => openEventModal(item)} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="booking-info">
                    <h3 style={{ color: "#7c3aed" }}>{item.event_title}</h3>
                    <p className="booking-game" style={{ fontSize: "13px", color: "#475569", marginBottom: "4px", fontWeight: "600" }}>{item.event_location}</p>
                    <p className="booking-date">{item.event_date || "Date TBA"}</p>
                    <span className="booking-status-badge" style={{ color: "#059669", background: "#dcfce7" }}>
                      ✅ Confirmed
                    </span>
                  </div>
                  <div className="booking-right" style={{ textAlign: "right" }}>
                    <div className="booking-price">{item.is_free ? "FREE" : `₹${item.total_amount}`}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{item.qty} {item.ticket_type} ticket(s)</div>
                    <div className="tap-hint" style={{ marginTop: "8px" }}>Tap for details</div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* ===== EVENT DETAIL MODAL ===== */}
      {selectedEventCard && (
        <div className="modal-backdrop" onClick={closeEventModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeEventModal}>X</button>
            <div ref={eventReceiptRef} style={{ background: "#fff", padding: "16px", borderRadius: "12px", width: "100%", boxSizing: "border-box" }}>
              <div style={{ background: `linear-gradient(135deg, ${!selectedEventCard.is_free ? "#7c3aed, #a78bfa" : "#059669, #10b981"})`, borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "16px" }}>
                <div style={{ fontSize: "36px", marginBottom: "4px" }}>🎟️</div>
                <h3 style={{ margin: 0, color: "#fff", fontSize: "18px", fontWeight: 700 }}>{selectedEventCard.is_free ? "Booking Confirmed!" : "Payment Successful!"}</h3>
                <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>Event Ticket</p>
              </div>

              {selectedEventCard.booking_ref && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px", textAlign: "center", marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "1px" }}>Booking Reference</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#059669", letterSpacing: "3px", fontFamily: "monospace", marginTop: "4px" }}>{selectedEventCard.booking_ref}</div>
                </div>
              )}

              <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", marginBottom: "14px" }}>
                {[
                  ["Event", selectedEventCard.event_title],
                  ["Date", selectedEventCard.event_date || "TBA"],
                  ["Venue", selectedEventCard.event_location],
                  ["Attendee", selectedEventCard.attendee_name],
                  ["Ticket", selectedEventCard.ticket_type],
                  ["Quantity", selectedEventCard.qty],
                  ["Amount", selectedEventCard.is_free ? "FREE" : `₹${selectedEventCard.total_amount}`],
                ].map(([label, val], idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: idx < 6 ? "1px dashed #e5e7eb" : "none" }}>
                    <span style={{ color: "#6b7280" }}>{label}</span>
                    <span style={{ fontWeight: 600, color: "#1f2937", textAlign: "right" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Download Button */}
            <div style={{ padding: "0 20px 20px" }}>
              <button
                onClick={handleDownloadEventTicket}
                style={{ width: "100%", padding: "12px", background: "#3b82f6", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "14px", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
              >
                <FaDownload /> Download Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TURF DETAIL MODAL ===== */}
      {selectedCard && (() => {
        const status = getStatusConfig(selectedCard.payment_status);
        return (
          <div className="modal-backdrop" onClick={closeModal}>
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button className="modal-close-btn" onClick={closeModal}>
                {/* <RiCloseCircleFill /> */} X
              </button>

              {/* Hero Image */}
              {selectedCard.turf_image ? (
                <div className="modal-hero">
                  <img
                    src={selectedCard.turf_image}
                    alt={selectedCard.turf_name}
                    className="modal-hero-img"
                  />
                  <div className="modal-hero-overlay" />
                  <div className="modal-hero-text">
                    <h2>{selectedCard.turf_name}</h2>
                    {/* <span className="modal-booking-id-chip">
                      Booking #{selectedCard.booking_id}
                    </span> */}
                  </div>
                </div>
              ) : (
                <div className="modal-no-image">
                  <h2>{selectedCard.turf_name}</h2>
                  {/* <span className="modal-booking-id-chip">
                    Booking #{selectedCard.booking_id}
                  </span> */}
                </div>
              )}

              {/* Detail Body */}
              <div className="modal-body">

                {/* Status Banner */}
                <div
                  className="modal-status-banner"
                  style={{ background: status.bg, color: status.color }}
                >
                  <span className="modal-status-icon">{status.icon}</span>
                  <span className="modal-status-label">{status.label}</span>
                </div>

                {/* Detail Rows */}
                <div className="modal-details">
                  <div className="modal-detail-row">
                    <div className="modal-detail-icon">
                      <FaCalendarAlt />
                    </div>
                    <div className="modal-detail-content">
                      <span className="modal-detail-label">Date</span>
                      <span className="modal-detail-value">{selectedCard.date}</span>
                    </div>
                  </div>

                  <div className="modal-detail-row">
                    <div className="modal-detail-icon">
                      <FaRunning />
                    </div>
                    <div className="modal-detail-content">
                      <span className="modal-detail-label">Game</span>
                      <span className="modal-detail-value">{formatGameName(selectedCard.game_name)}</span>
                    </div>
                  </div>

                  <div className="modal-detail-row">
                    <div className="modal-detail-icon">
                      <FaClock />
                    </div>
                    <div className="modal-detail-content">
                      <span className="modal-detail-label">Time Slots</span>
                      <span className="modal-detail-value">
                        {selectedCard.slots?.join("  •  ")}
                      </span>
                    </div>
                  </div>

                  <div className="modal-detail-row">
                    <div className="modal-detail-icon">
                      <FaRupeeSign />
                    </div>
                    <div className="modal-detail-content">
                      <span className="modal-detail-label">Total Amount</span>
                      <span className="modal-detail-value modal-price">
                        ₹{selectedCard.total_price}
                      </span>
                    </div>
                  </div>

                  {/* <div className="modal-detail-row">
                    <div className="modal-detail-icon">
                      <FaHashtag />
                    </div>
                    <div className="modal-detail-content">
                      <span className="modal-detail-label">Booking ID</span>
                      <span className="modal-detail-value">
                        #{selectedCard.booking_id}
                      </span>
                    </div>
                  </div> */}
                </div>

                {/* Close Button */}
                <button className="modal-done-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default MyBooking;