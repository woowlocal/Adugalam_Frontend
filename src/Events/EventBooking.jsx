import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import "./EventBooking.css";
import fallbackBanner from "../assets/aa.jpg";
import orgLogo from "../assets/aa.jpg";
import {
  FaLink,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTelegramPlane,
  FaHandshake,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMap,
  FaTicketAlt,
  FaHourglassHalf,
  FaBan,
  FaFire,
  FaStar,
  FaRegStar,
  FaUser,
  FaEnvelope,
  FaCrown,
  FaChair,
  FaCheckCircle,
  FaMinus,
  FaPlus,
  FaLock,
  FaQrcode,
  FaDownload
} from "react-icons/fa";

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

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

export default function Eventbooking() {
  const location = useLocation();
  const id = location.state?.eventId;

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  // Review form
  const [name, setName] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user"))?.name || ""; } catch { return ""; }
  });
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [msg, setMsg] = useState("");

  // Share
  const [showShare, setShowShare] = useState(false);
  const eventUrl = window.location.href;

  // ── Booking state ──────────────────────────────────────────────────
  const [selectedType, setSelectedType] = useState(null); // "normal" | "vip"
  const [qty, setQty] = useState(1);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeWhatsapp, setAttendeeWhatsapp] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [bookingStep, setBookingStep] = useState("select");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState("");
  const receiptRef = useRef(null);

  const shareLinks = [
    { name: "Copy Link", icon: <FaLink />, action: () => { navigator.clipboard.writeText(eventUrl); alert("Link copied!"); } },
    { name: "WhatsApp", icon: <FaWhatsapp color="#25D366" />, url: `https://wa.me/?text=${encodeURIComponent(eventUrl)}` },
    { name: "Instagram", icon: <FaInstagram color="#E4405F" />, url: "https://www.instagram.com/" },
    { name: "Facebook", icon: <FaFacebook color="#1877F2" />, url: `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}` },
    { name: "Telegram", icon: <FaTelegramPlane color="#229ED9" />, url: `https://t.me/share/url?url=${eventUrl}` },
  ];

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetch(`${API_BASE}/api/admin/events/${id}/`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setEventData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/api/events/${id}/reviews/`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => { });
  }, [id]);

  const avg = reviews.length === 0
    ? 0
    : (+reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);

  const submitReview = async () => {
    let userId = null;
    try { userId = JSON.parse(localStorage.getItem("user"))?.id; } catch { }
    if (!userId) return setMsg("Please login to submit a review.");
    if (!name) return setMsg("Please enter your name.");
    if (!rating) return setMsg("Please select a rating.");
    if (!text) return setMsg("Please write a review.");
    try {
      const res = await fetch(`${API_BASE}/api/events/${id}/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text, user: userId })
      });
      if (res.ok) {
        setReviews([await res.json(), ...reviews]);
        setName(""); setText(""); setRating(0);
        setMsg("Thanks! Your review was added.");
      } else setMsg("Failed to add review.");
    } catch { setMsg("Error connecting to server."); }
  };

  const stars = (val) => (
    <span style={{ display: "inline-flex", gap: "2px", alignItems: "center" }}>
      {[...Array(5)].map((_, i) =>
        i < val ? <FaStar key={i} color="#ffc107" /> : <FaRegStar key={i} color="#e4e5e9" />
      )}
    </span>
  );

  if (loading) return <main className="container"><p style={{ padding: "40px", textAlign: "center" }}>Loading event details...</p></main>;
  if (!eventData) return <main className="container"><p style={{ padding: "40px", textAlign: "center" }}>Event not found!</p></main>;

  // ── Derived values ─────────────────────────────────────────────────
  const displayTitle = eventData.title || "Untitled Event";
  const displayLocation = eventData.location || eventData.address || "Location TBA";
  const displayStartDate = fmtDate(eventData.start_date);
  const displayEndDate = fmtDate(eventData.end_date);
  const displayStartTime = fmtTime(eventData.start_time);
  const displayEndTime = fmtTime(eventData.end_time);

  const totalSeats = eventData?.total_seats || 0;
  const bookedSeats = eventData?.booked_seats || 0;
  const seatsLeft = Math.max(totalSeats - bookedSeats, 0);
  const isFull = totalSeats > 0 && seatsLeft <= 0;
  const seatPercent = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  // Ticket types — use backend data if available, else derive from amount
  const isFreeEvent = eventData.is_free;
  const normalPrice = eventData.normal_price ?? eventData.amount ?? 0;
  const vipPrice = eventData.vip_price ?? (eventData.amount ? parseFloat(eventData.amount) * 1.5 : 0);
  const normalSeats = eventData.normal_seats ?? Math.ceil(totalSeats * 0.7);
  const vipSeats = eventData.vip_seats ?? Math.floor(totalSeats * 0.3);

  const ticketTypes = isFreeEvent
    ? [{ key: "normal", label: "General Entry", icon: <FaChair />, price: 0, seats: totalSeats, badge: "Free", color: "#059669" }]
    : [
      { key: "normal", label: "Normal", icon: <FaChair />, price: parseFloat(normalPrice), seats: normalSeats, badge: "Standard", color: "#059669" },
      { key: "vip", label: "VIP", icon: <FaCrown />, price: parseFloat(vipPrice), seats: vipSeats, badge: "Premium", color: "#7c3aed" },
    ];

  const currentTicket = ticketTypes.find(t => t.key === selectedType);
  const totalAmount = currentTicket ? currentTicket.price * qty : 0;

  // ── Razorpay payment flow ──────────────────────────────────────────
  const handlePayAndBook = async () => {
    if (!attendeeName.trim()) { setBookingMsg("Please enter your name."); return; }
    if (!attendeeWhatsapp.trim() || !/^\d{10}$/.test(attendeeWhatsapp.trim())) { setBookingMsg("Please enter a valid 10-digit WhatsApp number."); return; }
    if (!attendeeEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeEmail.trim())) { setBookingMsg("Please enter a valid email address."); return; }

    setBookingLoading(true);
    setBookingMsg("");

    if (isFreeEvent || totalAmount === 0) {
      try {
        const res = await fetch(`${API_BASE}/api/events/${id}/book/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticket_type: selectedType, qty, name: attendeeName, whatsapp: attendeeWhatsapp, email: attendeeEmail }),
        });
        const data = await res.json();
        if (res.ok) {
          setEventData(prev => ({ ...prev, booked_seats: data.booked_seats }));
          if (data.booking_ref) setBookingRef(data.booking_ref);
          setBookingStep("success");
        } else {
          setBookingMsg(data.error || "Booking failed. Please try again.");
        }
      } catch { setBookingMsg("Connection error. Please try again."); }
      setBookingLoading(false);
      return;
    }

    // Paid booking → Razorpay
    try {
      const orderRes = await fetch(`${API_BASE}/api/events/${id}/create-order/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_type: selectedType, qty, name: attendeeName, whatsapp: attendeeWhatsapp, email: attendeeEmail }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { setBookingMsg(orderData.error || "Could not create order."); setBookingLoading(false); return; }

      const options = {
        key: orderData.razorpay_key || import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "Adugalam Events",
        description: `${selectedType?.toUpperCase()} × ${qty} — ${displayTitle}`,
        order_id: orderData.order_id,
        prefill: { name: attendeeName, contact: attendeeWhatsapp, email: attendeeEmail },
        theme: { color: selectedType === "vip" ? "#7c3aed" : "#059669" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/events/${id}/verify-payment/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, ticket_type: selectedType, qty, name: attendeeName, whatsapp: attendeeWhatsapp, email: attendeeEmail }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              setEventData(prev => ({ ...prev, booked_seats: verifyData.booked_seats }));
              if (verifyData.booking_ref) setBookingRef(verifyData.booking_ref);
              setBookingStep("success");
            } else {
              setBookingMsg(verifyData.error || "Payment verification failed.");
            }
          } catch { setBookingMsg("Payment verification failed."); }
          setBookingLoading(false);
        },
        modal: { ondismiss: () => { setBookingMsg("Payment cancelled."); setBookingLoading(false); } },
      };

      if (!window.Razorpay) { setBookingMsg("Payment gateway not loaded. Please refresh."); setBookingLoading(false); return; }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch { setBookingMsg("Error connecting to server."); setBookingLoading(false); }
  };

  const resetBooking = () => {
    setSelectedType(null); setQty(1); setAttendeeName(""); setAttendeeWhatsapp(""); setAttendeeEmail(""); setBookingRef("");
    setBookingStep("select"); setBookingMsg(""); setBookingLoading(false);
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Adugalam-Receipt-${bookingRef || "Event"}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate receipt image:", err);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <>
      <main className="container">
        {/* BANNER */}
        <section className="banner-card">
          <div className="banner-img">
            <img src={eventData.image || fallbackBanner} alt={displayTitle} />
          </div>
        </section>

        {/* TOP INFO */}
        <section className="top-info">
          <div className="pill"><FaHandshake style={{ marginRight: "6px" }} /> {eventData.category || "Events"}</div>
          <h1 className="title">{displayTitle}</h1>
          <div className="meta">
            <div className="meta-item">
              <FaCalendarAlt style={{ marginRight: "6px" }} />
              {displayStartDate} {displayStartTime && `at ${displayStartTime}`} {displayEndDate && `— ${displayEndDate}`} {displayEndTime && `at ${displayEndTime}`}
            </div>
            <div className="meta-item">
              <FaMapMarkerAlt style={{ marginRight: "4px" }} />
              <a className="meta-link" href={eventData.map_url || "#"}>{displayLocation}</a>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="content-grid">
          {/* LEFT */}
          <div className="left-col">
            <div className="block">
              <h2 className="block-title">Event Location</h2>
              <div className="location-text">
                <div className="location-name">{eventData.address || displayLocation}</div>
                {eventData.map_url && (
                  <a className="view-map" href={eventData.map_url} target="_blank" rel="noreferrer">
                    <FaMapMarkerAlt style={{ marginRight: "4px" }} /> View on map
                  </a>
                )}
              </div>
              <div className="map-wrap">
                {eventData.map_url ? (
                  <a href={eventData.map_url} target="_blank" rel="noreferrer" style={{ display: "block", width: "100%", height: "100%", background: "#eee", textAlign: "center", paddingTop: "100px", borderRadius: "12px", color: "#111", textDecoration: "none" }}>
                    <div style={{ fontSize: "32px", marginBottom: "10px" }}><FaMap /></div>
                    <strong>Click to Open Google Maps</strong>
                  </a>
                ) : (
                  <iframe title="map" src={`https://www.google.com/maps?q=${encodeURIComponent(displayLocation)}&output=embed`} />
                )}
              </div>
            </div>

            {eventData.gallery && eventData.gallery.length > 0 && (
              <div className="block">
                <h2 className="block-title">Event Gallery</h2>
                <div className="gallery">
                  {eventData.gallery.map(g => (
                    <img key={g.id} src={g.image.startsWith('http') ? g.image : `${API_BASE}${g.image}`} alt="Event Gallery" />
                  ))}
                </div>
              </div>
            )}

            {eventData.agenda && (
              <div className="block">
                <h2 className="block-title">Agenda</h2>
                <div className="agenda">
                  <p style={{ whiteSpace: "pre-wrap", color: "#4b5563" }}>{eventData.agenda}</p>
                </div>
              </div>
            )}

            {eventData.vips && (
              <div className="block">
                <h2 className="block-title">Speakers & VIPs</h2>
                <div className="people">
                  <p style={{ whiteSpace: "pre-wrap", color: "#4b5563" }}>{eventData.vips}</p>
                </div>
              </div>
            )}


            {/* SHARE IN LEFT COL */}
            <div className="block">
              <h3 className="block-title">Share this event</h3>
              <div className="share-box" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
                {shareLinks.map((item, i) =>
                  item.action ? (
                    <button key={i} className="share-item" onClick={item.action} style={{ flex: "1 1 calc(50% - 10px)" }}><span>{item.icon}</span>{item.name}</button>
                  ) : (
                    <a key={i} className="share-item" href={item.url} target="_blank" rel="noreferrer" style={{ flex: "1 1 calc(50% - 10px)" }}><span>{item.icon}</span>{item.name}</a>
                  )
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="right-col">

            {/* ── BOOKING CARD ── */}
            <div className="card eb-booking-card">

              {/* SUCCESS STATE — Booking Receipt */}
              {bookingStep === "success" ? (
                <div style={{ padding: "4px" }}>
                  <div ref={receiptRef} style={{ background: "#fff", padding: "16px", borderRadius: "12px" }}>
                    {/* Header */}
                    <div style={{ background: `linear-gradient(135deg,${totalAmount > 0 ? "#7c3aed, #a78bfa" : "#059669, #10b981"})`, borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "16px" }}>
                      <div style={{ fontSize: "36px", marginBottom: "4px" }}>🎟️</div>
                      <h3 style={{ margin: 0, color: "#fff", fontSize: "18px", fontWeight: 700 }}>{totalAmount > 0 ? "Payment Successful!" : "Booking Confirmed!"}</h3>
                      <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>Receipt sent to your email</p>
                    </div>

                    {/* Booking Ref */}
                    {bookingRef && (
                      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "12px", textAlign: "center", marginBottom: "12px" }}>
                        <div style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "1px" }}>Booking Reference</div>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: "#059669", letterSpacing: "3px", fontFamily: "monospace", marginTop: "4px" }}>{bookingRef}</div>
                      </div>
                    )}

                    {/* Details Table */}
                    <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", marginBottom: "14px" }}>
                      {[
                        ["Event", displayTitle],
                        ["Date", displayStartDate || "TBA"],
                        ["Venue", displayLocation],
                        ["Attendee", attendeeName],
                        ["Email", attendeeEmail],
                        ["WhatsApp", attendeeWhatsapp],
                        ["Ticket", currentTicket?.label],
                        ["Quantity", qty],
                        ["Amount", totalAmount > 0 ? `₹${totalAmount.toFixed(2)}` : "FREE"],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f3f4f6" }}>
                          <span style={{ color: "#6b7280" }}>{k}</span>
                          <span style={{ fontWeight: 600, color: k === "Amount" && totalAmount > 0 ? "#7c3aed" : k === "Amount" ? "#059669" : "#111", maxWidth: "55%", textAlign: "right", wordBreak: "break-word" }}>{v}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "#92400e", marginBottom: "14px" }}>
                      📩 Check your email for the full receipt. Show this booking reference at the venue.
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="eb-reset-btn"
                      onClick={handleDownloadReceipt}
                      style={{ flex: 1, padding: "12px", background: "#3b82f6", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "14px", color: "#fff" }}
                    >
                      <FaDownload style={{ marginRight: "6px" }} /> Download
                    </button>
                    <button
                      className="eb-reset-btn"
                      onClick={resetBooking}
                      style={{ flex: 1, padding: "12px", background: "#f3f4f6", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "14px", color: "#374151" }}
                    >
                      🎫 Book Another
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaTicketAlt /> Book Your Ticket
                  </h3>

                  {/* Seat overview bar */}
                  {totalSeats > 0 && (
                    <div className="seat-info-box" style={{ marginBottom: "20px" }}>
                      <div className="seat-stats">
                        <div className="seat-stat"><span className="seat-stat-num">{totalSeats}</span><span className="seat-stat-label">Total</span></div>
                        <div className="seat-stat"><span className="seat-stat-num">{bookedSeats}</span><span className="seat-stat-label">Booked</span></div>
                        <div className="seat-stat"><span className={`seat-stat-num ${seatsLeft <= 5 ? "low" : ""}`}>{seatsLeft}</span><span className="seat-stat-label">Available</span></div>
                      </div>
                      <div className="seat-progress-wrap">
                        <div className="seat-progress-bar">
                          <div className={`seat-progress-fill ${seatPercent >= 90 ? "critical" : seatPercent >= 70 ? "warning" : ""}`} style={{ width: `${seatPercent}%` }} />
                        </div>
                        <div className="seat-progress-text">{seatPercent}% Filled</div>
                      </div>
                      {seatsLeft <= 10 && seatsLeft > 0 && (
                        <div className="seat-urgency"><FaFire style={{ color: "orange", marginRight: "6px" }} /> Only {seatsLeft} seat{seatsLeft > 1 ? "s" : ""} left!</div>
                      )}
                    </div>
                  )}

                  {isFull ? (
                    <div className="eb-full-box">
                      <FaBan style={{ fontSize: "28px", marginBottom: "8px" }} />
                      <strong>Seats Full</strong>
                      <p>All seats for this event are booked.</p>
                    </div>
                  ) : (
                    <>
                      {/* STEP 1 — Ticket Type */}
                      <div className="eb-section-label">
                        <span className="eb-step-badge">1</span> Choose Ticket Type
                      </div>
                      <div className="eb-ticket-types">
                        {ticketTypes.map(t => (
                          <button
                            key={t.key}
                            data-type={t.key}
                            className={`eb-ticket-type-btn ${selectedType === t.key ? "active" : ""}`}
                            style={selectedType === t.key ? { borderColor: t.color } : {}}
                            onClick={() => { setSelectedType(t.key); setQty(1); setBookingStep("select"); setBookingMsg(""); }}
                          >
                            {/* Left accent bar */}
                            <div className="eb-ticket-accent" style={{ background: t.color }} />

                            {/* Icon */}
                            <span className="eb-ticket-icon" style={{ color: t.color }}>{t.icon}</span>

                            {/* Info */}
                            <div className="eb-ticket-info">
                              <div className="eb-ticket-name">{t.label}</div>
                              <div className="eb-ticket-badge" style={{ background: t.color }}>{t.badge}</div>
                            </div>

                            {/* Price */}
                            <div className="eb-ticket-right">
                              <div className="eb-ticket-price" style={{ color: t.color }}>
                                {t.price === 0 ? "Free" : `₹${t.price.toFixed(2)}`}
                              </div>
                              <div className="eb-ticket-avail">{t.seats} seats</div>
                            </div>

                            {/* Checkmark when selected */}
                            <div className={`eb-ticket-check ${selectedType === t.key ? "visible" : ""}`} style={{ background: t.color }}>
                              <FaCheckCircle />
                            </div>
                          </button>
                        ))}
                      </div>

                      {selectedType && (
                        <>
                          {/* STEP 2 — Quantity */}
                          <div className="eb-section-label" style={{ marginTop: "20px" }}>
                            <span className="eb-step-badge">2</span> Number of Tickets
                          </div>
                          <div className="eb-qty-row">
                            <button className="eb-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>
                              <FaMinus />
                            </button>
                            <div className="eb-qty-center">
                              <span className="eb-qty-value">{qty}</span>
                              <span className="eb-qty-label">ticket{qty > 1 ? "s" : ""}</span>
                            </div>
                            <button className="eb-qty-btn" onClick={() => setQty(q => Math.min(10, q + 1))} disabled={qty >= 10}>
                              <FaPlus />
                            </button>
                          </div>

                          {/* STEP 3 — Attendee Details */}
                          <div className="eb-section-label" style={{ marginTop: "20px" }}>
                            <span className="eb-step-badge">3</span> Your Details
                          </div>
                          <div className="eb-attendee-form">
                            <div className="eb-input-group">
                              <span className="eb-input-icon"><FaUser /></span>
                              <input
                                type="text"
                                placeholder="Full Name *"
                                value={attendeeName}
                                onChange={e => setAttendeeName(e.target.value)}
                              />
                            </div>
                            <div className="eb-input-group">
                              <span className="eb-input-icon"><FaWhatsapp color="#25D366" /></span>
                              <input
                                type="tel"
                                placeholder="WhatsApp Number (10 digits) *"
                                value={attendeeWhatsapp}
                                onChange={e => setAttendeeWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
                              />
                            </div>
                            <div className="eb-input-group">
                              <span className="eb-input-icon"><FaEnvelope /></span>
                              <input
                                type="email"
                                placeholder="Email Address *"
                                value={attendeeEmail}
                                onChange={e => setAttendeeEmail(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* TOTAL + PAY */}
                          <div className="eb-total-row">
                            <div>
                              <div className="eb-total-label">Total Amount</div>
                              <div className="eb-total-amount" style={{ color: currentTicket?.color }}>
                                {totalAmount === 0 ? "Free" : `₹${totalAmount.toFixed(2)}`}
                              </div>
                              {qty > 1 && totalAmount > 0 && (
                                <div className="eb-total-sub">₹{currentTicket?.price.toFixed(2)} × {qty}</div>
                              )}
                            </div>
                            <button
                              className="eb-pay-btn"
                              style={currentTicket ? { background: `linear-gradient(135deg, ${currentTicket.color}dd, ${currentTicket.color})` } : {}}
                              onClick={handlePayAndBook}
                              disabled={bookingLoading}
                            >
                              {bookingLoading
                                ? <><FaHourglassHalf style={{ marginRight: "6px" }} /> Processing...</>
                                : totalAmount === 0
                                  ? <><FaTicketAlt style={{ marginRight: "6px" }} /> Book Free</>
                                  : <><FaLock style={{ marginRight: "6px" }} /> Pay ₹{totalAmount.toFixed(2)}</>
                              }
                            </button>
                          </div>

                          {totalAmount > 0 && (
                            <div className="eb-secure-note"><FaLock style={{ marginRight: "4px", fontSize: "10px" }} /> Secured by Razorpay</div>
                          )}

                          {bookingMsg && <div className="booking-msg" style={{ color: bookingMsg.includes("error") || bookingMsg.includes("fail") || bookingMsg.includes("invalid") ? "#dc2626" : "#059669" }}>{bookingMsg}</div>}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* ORGANIZER CARD */}
            <div className="card">
              <h3 className="card-title">Organized By</h3>
              <div className="org-row">
                <div className="org-logo"><img src={orgLogo} alt="Organizer Logo" /></div>
                <div>
                  <div className="org-name">{eventData.organized_by || "ADUGALAM"}</div>
                  <div className="org-sub">
                    For inquiries, contact at<br />
                    <a href="mailto:myadugalam@gmail.com">myadugalam@gmail.com</a>
                  </div>
                </div>
              </div>
              <div className="card-divider" />
              <button className="link-btn">Contact this event</button>
            </div>

            {/* REVIEWS IN RIGHT COL */}
            <div className="card review-card" style={{ marginTop: "24px" }}>
              <h3 className="card-title">Reviews</h3>
              <div className="review-summary">
                <div className="avg">{avg}</div>
                <div className="stars">{stars(Math.round(avg))}</div>
                <div className="count">{reviews.length} reviews</div>
              </div>
              <div className="review-form">
                <label className="field">
                  <span>Your Name</span>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
                </label>
                <div className="field">
                  <span>Your Rating</span>
                  <div className="star-picker" style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map(val => (
                      <button key={val} type="button" className={`star-btn ${rating >= val ? "active" : ""}`}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        onClick={() => setRating(val)}>
                        {rating >= val ? <FaStar color="#ffc107" size={24} /> : <FaRegStar color="#e4e5e9" size={24} />}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="field">
                  <span>Your Review</span>
                  <textarea rows="3" value={text} onChange={e => setText(e.target.value)} placeholder="Write your review..." />
                </label>
                <button className="btn btn-book" type="button" onClick={submitReview}>Submit Review</button>
                {msg && <div className="review-msg">{msg}</div>}
              </div>
              <div className="card-divider" />
              <div className="review-list">
                {reviews.length === 0 && <p className="muted">No reviews yet. Be the first!</p>}
                {reviews.map(r => (
                  <div key={r.id || r.created_at || Math.random()} className="review-item">
                    <div className="review-head">
                      <strong>{r.name}</strong>
                      <div className="stars">{stars(r.rating)}</div>
                    </div>
                    <p>{r.text}</p>
                    <small>{r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "Just now"}</small>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </section>
      </main>
    </>
  );
}