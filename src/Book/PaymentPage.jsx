import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./payment.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

// Survives a killed/reloaded tab (common on mobile UPI-app redirects), unlike router state.
const PENDING_BOOKING_KEY = "adugalam_pending_payment_booking_id";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  const bookingId =
    location.state?.booking_id ||
    location.state?.booking?.id ||
    localStorage.getItem(PENDING_BOOKING_KEY);

  /* ================= LOAD BOOKING / DETECT ALREADY-CONFIRMED PAYMENT =================
     The Razorpay `handler` callback that normally drives the redirect can fail to fire
     if the tab is suspended or reloaded while the user is in a UPI app. If that happens,
     the booking may already be CONFIRMED server-side (via the Razorpay webhook) by the
     time we're back here — so every load checks status first instead of assuming PENDING. */
  const checkBookingStatus = useCallback(async () => {
    if (!bookingId) return false;
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE}/api/booking/${bookingId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return false;
      const data = await res.json();

      if (data.status === "CONFIRMED") {
        localStorage.removeItem(PENDING_BOOKING_KEY);
        navigate("/summary", { state: { booking_id: bookingId } });
        return true;
      }

      setBooking(data);
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (!bookingId) return;
    localStorage.setItem(PENDING_BOOKING_KEY, bookingId);
    checkBookingStatus().finally(() => setLoading(false));
  }, [bookingId, checkBookingStatus]);

  /* ================= RE-CHECK WHEN THE USER RETURNS FROM A UPI APP =================
     Covers the case where the tab wasn't killed, just backgrounded: re-check on regaining
     focus, polling briefly since the webhook can take a few seconds to land. */
  useEffect(() => {
    if (!bookingId) return;

    const recheck = () => {
      if (document.visibilityState !== "visible") return;

      clearInterval(pollRef.current);
      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts += 1;
        const confirmed = await checkBookingStatus();
        if (confirmed || attempts >= 6) {
          clearInterval(pollRef.current);
        }
      }, 4000);
    };

    document.addEventListener("visibilitychange", recheck);
    window.addEventListener("focus", recheck);

    return () => {
      document.removeEventListener("visibilitychange", recheck);
      window.removeEventListener("focus", recheck);
      clearInterval(pollRef.current);
    };
  }, [bookingId, checkBookingStatus]);

  /* ================= RAZORPAY PAYMENT ================= */
  const handlePayment = async () => {
    try {
      if (!bookingId) {
        alert("Booking ID missing");
        return;
      }

      const token = localStorage.getItem("access");

      const original = parseFloat(booking?.original_amount) || parseFloat(booking?.total_price) || 0;
      const advance = parseFloat(booking?.advance_amount) || Math.round(original * 0.30);
      const service = parseFloat(booking?.service_charge) || 1;
      const totalAmount = advance + service;

      if (totalAmount <= 0) {
        alert("Invalid payment amount");
        return;
      }

      const amountInPaise = Math.round(totalAmount * 100);

      // ✅ CREATE ORDER FROM DJANGO
      const orderRes = await fetch(
        `${API_BASE}/api/payment/create-order/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: bookingId,
            amount: amountInPaise,
          }),
        }
      );

      const order = await orderRes.json();

      if (!orderRes.ok) {
        alert(order.error || "Order creation failed");
        return;
      }


      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Adugalam",
        description: "Ground Booking Payment",
        order_id: order.order_id,

        handler: async function (response) {
          await verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
        },

        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  };

  /* ================= VERIFY PAYMENT ================= */
  const verifyPayment = async (paymentId, orderId, signature) => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch(
        `${API_BASE}/api/payment/verify/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: bookingId,
            payment_id: paymentId,
            order_id: orderId,
            signature: signature,
          }),
        }
      );

      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("Verify payment: non-JSON response", parseErr);
        alert(
          "Payment received but confirmation failed unexpectedly. Please check My Bookings or contact support before retrying payment."
        );
        return;
      }

      if (res.ok && data.success) {
        localStorage.removeItem(PENDING_BOOKING_KEY);
        alert("Payment Successful!");
        navigate("/summary", {
          state: { booking_id: bookingId },
        });
      } else {
        alert(data.error || "Payment verification failed");
      }
    } catch (err) {
      console.error(err);
      alert(
        "Could not confirm payment due to a network error. Please check My Bookings before retrying payment."
      );
    }
  };

  if (loading) return <h3>Loading payment...</h3>;
  if (!booking) return <h3>Unable to load booking details. Please go back and try again.</h3>;

  const originalAmount = parseFloat(booking.original_amount) || parseFloat(booking.total_price) || 0;
  const advanceAmount = parseFloat(booking.advance_amount) || Math.round(originalAmount * 0.30);
  const serviceCharge = parseFloat(booking.service_charge) || 1;
  const totalPayable = advanceAmount + serviceCharge;

  return (
    <div className="payment-page1">
      <Container className="payment-container py-4">

        <div className="payment-header" style={{ justifyContent: 'center' }}>
          <h3 className="payment-title">Payment</h3>
        </div>

        <div className="payment-card">

          <h5 className="turf-name">{booking.turf_name}</h5>
          <p className="booking-date">Date: {booking.date}</p>

          <div className="slot-list">
            {booking.slots?.map((s, i) => (
              <p key={i} className="slot-item">
                {s.time_display}
              </p>
            ))}
          </div>

          <hr />

          <div className="price-row">
            <span>Original Amount</span>
            <span>₹{originalAmount}</span>
          </div>

          <div className="price-row">
            <span>Advance (30%)</span>
            <span>₹{advanceAmount}</span>
          </div>

          <div className="price-row">
            <span>Service Charge</span>
            <span>₹{serviceCharge}</span>
          </div>

          <div style={{ color: "red", textAlign: "center" }}>
            <span>Advance you Pay 30% on Booking</span>
            <span style={{ color: "green" }}> Inclusive of 18% GST</span>
          </div>
          <div className="price-row grand">
            <span>Total Payable</span>
            <span>₹{totalPayable}</span>
          </div>

          <button className="pay-btn" onClick={handlePayment}>
            Pay Now
          </button>

        </div>
      </Container>
    </div>
  );
};

export default PaymentPage;