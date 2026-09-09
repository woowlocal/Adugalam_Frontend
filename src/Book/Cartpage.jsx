import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Cart.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

const Cartpage = () => {

  const { state } = useLocation();
  const navigate = useNavigate();

  const booking = state?.booking;

  // ================= REFRESH PROTECTION =================
  if (!booking) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>No booking found</h3>
        <button onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  // ================= SLOT DISPLAY =================
  const slotTimes = booking.slots
    ?.map(slot => slot.time_display)
    .join(", ");

  // ================= PRICE STATE (filled from API after confirm) =================
  const [pricing, setPricing] = useState(null);

  // Preview before confirm (client-side estimate)
  const previewOriginal = parseFloat(booking.total_price) || 0;
  const previewAdvance = Math.round(previewOriginal * 0.30 * 100) / 100;
  const previewService = 3;
  const previewTotal = previewAdvance + previewService;

  const handleCheckout = async () => {

    try {

      const token = localStorage.getItem("access");

      if (!token) {
        alert("Login required to complete checkout.");
        navigate("/login", {
          state: {
            from: location.pathname,
            booking
          }
        });
        return;
      }

      if (!booking.turf_id || !booking.slot_ids?.length || !booking.date) {
        alert("Booking data missing");
        return;
      }
      const payload = {
        turf_id: booking.turf_id,
        date: booking.date,
        slot_ids: booking.slot_ids,
      };
      if (booking.game_id) {
        payload.game_id = booking.game_id;
      }



      const response = await fetch(
        `${API_BASE}/api/booking/confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      // ================= ERROR HANDLE =================
      if (!response.ok) {
        alert(data.error || "Booking failed");
        return;
      }

      // ================= NAVIGATE AFTER SAVE =================
      // Pass all amounts from DB so PaymentPage shows exact figures
      navigate("/payment", {
        state: {
          booking,
          booking_id: data.booking_id,
          original_amount: data.original_amount,
          advance_amount: data.advance_amount,
          service_charge: data.service_charge,
          total_payable: data.total_payable,
        },
      });

    } catch (err) {
      alert("Server error");
    }
  };

  // ===================================================

  return (
    <div className="summary-wrapper">

      {/* ===== CART CARD ===== */}
      <div className="cart-card">
        <img src={booking.image} alt="ground" />

        <div className="cart-info">
          <h3>{booking.turf_name}</h3>
          <p>Date: {booking.date}</p>
          <p>Time: {slotTimes}</p>
        </div>
      </div>

      {/* ===== PRICE BREAKDOWN ===== */}
      <div className="price-breakdown">
        <div className="price-row">
          <span>Original Price</span>
          <span>₹{previewOriginal}</span>
        </div>
        <div className="price-row">
          <span>Service Charge</span>
          <span>₹{previewService}</span>
        </div>
        <div className="price-row">
          <span>Advance (30%)</span>
          <span>₹{previewAdvance}</span>
        </div>
        <div className="price-row grand">
          <span>Total Payable Now</span>
          <span>₹{previewTotal.toFixed(2)}</span>
        </div>
        <p className="advance-note">
          30% advance now · Balance at venue · Inclusive of 18% GST
        </p>
      </div>

      {/* ===== GRAND TOTAL ===== */}
      <div className="grandcheck">
        <div className="grand-left">
          <p className="grand-label">Advance Payable</p>
          <h2 className="grand-amount">₹{previewTotal.toFixed(2)}</h2>
        </div>

        <button
          className="checkout-btn-fixed"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>


    </div>
  );
};

export default Cartpage;