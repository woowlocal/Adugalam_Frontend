
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Summary.css";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import RazorpayImg from "../assets/image copy 3.png";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

const Summary = () => {

  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("access");

        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${API_BASE}/api/booking/my-summary/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load summary");
        } else {
          setBooking(data);
          setShowSuccess(true);
        }

      } catch (err) {
        console.error("Summary fetch error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading summary...</h3>;

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h3>{error}</h3>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );

  return (
    <>
      <div className="summary-page">

        {/* HEADER */}
        <div className="summary-header">
          <button className="back-btnn" onClick={() => navigate("/home")}>
            <FaArrowLeft />
          </button>
          <h2>Summary</h2>
        </div>

        {/* BOOKING DETAILS */}
        <div className="summary-card">

          <div className="summary-row">
            <span>Booking ID</span>
            <span>#{booking.booking_id}</span>
          </div>

          <div className="summary-row">
            <span>Booking Date</span>
            <span>{booking.date}</span>
          </div>

          <div className="summary-row">
            <span>Ground / Turf</span>
            <span>{booking.turf_name}</span>
          </div>

          <div className="summary-row">
            <span>Game</span>
            <span>{booking.game_name}</span>
          </div>

          <div className="summary-row">
            <span>Slots</span>
            <span>
              {booking.slots?.map(
                s => `${s.start_time} - ${s.end_time}`
              ).join(", ")}
            </span>
          </div>

          <div className="summary-row">
            <span>Payment Status</span>
            <span style={{
              color: booking.payment?.status === "SUCCESS" ? "green" : "orange",
              fontWeight: "600"
            }}>
              {booking.payment?.status}
            </span>
          </div>

          <div className="summary-row">
            <span>Payment ID</span>
            <span>{booking.payment?.razorpay_payment_id || "-"}</span>
          </div>

        </div>

        {/* PAYMENT METHOD */}
        <div className="payment-method">
          <div className="method-left">
            <img src={RazorpayImg} alt="" />
            <span>Razorpay</span>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="payment-summary">
          <h3>Payment Summary</h3>

          <div className="summary-line">
            <span>Original Amount</span>
            <span>₹{booking.original_amount}</span>
          </div>

          <div className="summary-line">
            <span>Advance (30%)</span>
            <span>₹{booking.advance_amount}</span>
          </div>

          <div className="summary-line">
            <span>Service Charge</span>
            <span>₹{booking.service_charge}</span>
          </div>

          <hr />

          <div className="summary-line total">
            <span>Total Paid</span>
            <span>₹{booking.total_price}</span>
          </div>
        </div>

        <button
          className="outline-btn"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>

      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon">
              <FaCheck />
            </div>

            <h2>Payment Successful</h2>
            <p>Your ground booking is confirmed</p>

            <div className="success-actions">

              <button
                className="outline-btn"
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>

              <button
                className="outline-btn"
                onClick={() => navigate("/")}
              >
                Go Home
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Summary;
