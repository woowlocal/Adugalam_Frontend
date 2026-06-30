import React, { useEffect, useState } from "react";
import "./MyBooking.css";

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
} from "react-icons/fa";
import { VscChevronLeft } from "react-icons/vsc";
import { RiCloseCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com/";

const MyBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null); // click to open modal

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

        const data = await res.json();
        console.log("Booking API response:", data);

        if (!res.ok) {
          setError(data.error || "Failed to fetch bookings");
        } else {
          setBookings(data.filter((b) => b.payment_status === "SUCCESS"));
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
            <button className="mb-back-btn" onClick={() => navigate(-1)}>
              <VscChevronLeft size={24} color="#1a202c" />
            </button>
          </div>
          <h2 className="page-title">My Bookings</h2>
        </div>

        {/* Booking List */}
        {bookings.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>
            No bookings found
          </p>
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
        )}
      </div>

      {/* ===== DETAIL MODAL ===== */}
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