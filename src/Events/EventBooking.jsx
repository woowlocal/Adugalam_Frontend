import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./EventBooking.css";
import fallbackBanner from "../assets/aa.jpg";
import gallery1 from "../assets/aa.jpg";
import gallery2 from "../assets/aa.jpg";
import gallery3 from "../assets/aa.jpg";
import speaker1 from "../assets/aa.jpg";
import speaker2 from "../assets/aa.jpg";
import speaker3 from "../assets/aa.jpg";
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
  FaRegStar
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

export default function Eventbooking() {
  const location = useLocation();
  const id = location.state?.eventId;

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState(() => {
    const userObjStr = localStorage.getItem("user");
    if (userObjStr) {
      try {
        const userObj = JSON.parse(userObjStr);
        return userObj.name || "";
      } catch (e) { }
    }
    return "";
  });
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [msg, setMsg] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [showShare, setShowShare] = useState(false);
  const eventUrl = window.location.href;

  const STORAGE_KEY = id ? `reviews_event_${id}` : "reviews_event_default";

  const shareLinks = [
    {
      name: "Copy Link",
      icon: <FaLink />,
      action: () => {
        navigator.clipboard.writeText(eventUrl);
        alert("Link copied!");
      },
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp color="#25D366" />,
      url: `https://wa.me/?text=${encodeURIComponent(eventUrl)}`,
    },
    {
      name: "Instagram",
      icon: <FaInstagram color="#E4405F" />,
      url: "https://www.instagram.com/",
    },
    {
      name: "Facebook",
      icon: <FaFacebook color="#1877F2" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
    },
    {
      name: "Telegram",
      icon: <FaTelegramPlane color="#229ED9" />,
      url: `https://t.me/share/url?url=${eventUrl}`,
    },
  ];

  // Fetch dynamic event data
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

    fetch(`${API_BASE}/api/admin/events/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load event");
        return res.json();
      })
      .then(data => {
        setEventData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");
    fetch(`${API_BASE}/api/events/${id}/reviews/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        }
      })
      .catch(err => console.error("Error fetching reviews", err));
  }, [id]);

  const avg =
    reviews.length === 0
      ? 0
      : (+
        reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
      ).toFixed(1);

  const submitReview = async () => {
    const userObjStr = localStorage.getItem("user");
    let userId = null;
    if (userObjStr) {
      try {
        const userObj = JSON.parse(userObjStr);
        userId = userObj.id;
      } catch (e) { }
    }

    if (!userId) {
      return setMsg("Please login to submit a review.");
    }

    if (!name) return setMsg("Please enter your name.");
    if (!rating) return setMsg("Please select a rating.");
    if (!text) return setMsg("Please write a review.");

    const newReview = { name, rating, text, user: userId };
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

    try {
      const res = await fetch(`${API_BASE}/api/events/${id}/reviews/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview)
      });
      if (res.ok) {
        const addedReview = await res.json();
        setReviews([addedReview, ...reviews]);
        setName("");
        setText("");
        setRating(0);
        setMsg("Thanks! Your review was added.");
      } else {
        setMsg("Failed to add review.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Error connecting to server.");
    }
  };

  const stars = (val) => (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[...Array(5)].map((_, i) => (
        i < val ? <FaStar key={i} color="#ffc107" /> : <FaRegStar key={i} color="#e4e5e9" />
      ))}
    </span>
  );

  if (loading) {
    return <main className="container"><p style={{ padding: "40px", textAlign: "center" }}>Loading event details...</p></main>;
  }

  if (!eventData) {
    return <main className="container"><p style={{ padding: "40px", textAlign: "center" }}>Event not found!</p></main>;
  }

  // Derived values from eventData
  const displayTitle = eventData.title || "Untitled Event";
  const displayLocation = eventData.location || eventData.address || "Location TBA";
  const displayPrice = eventData.is_free ? "Free" : eventData.amount ? `₹${eventData.amount}` : "Free";
  const displayStartDate = fmtDate(eventData.start_date);
  const displayEndDate = fmtDate(eventData.end_date);
  const displayStartTime = fmtTime(eventData.start_time);
  const displayEndTime = fmtTime(eventData.end_time);

  // Derived seat info
  const totalSeats = eventData?.total_seats || 0;
  const bookedSeats = eventData?.booked_seats || 0;
  const seatsLeft = Math.max(totalSeats - bookedSeats, 0);
  const isFull = totalSeats > 0 && seatsLeft <= 0;
  const seatPercent = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  const handleBookNow = async () => {
    setBookingLoading(true);
    setBookingMsg("");
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");
    try {
      const res = await fetch(`${API_BASE}/api/events/${id}/book/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setBookingMsg(data.message);
        // Update local state
        setEventData(prev => ({
          ...prev,
          booked_seats: data.booked_seats,
        }));
      } else {
        setBookingMsg(+ (data.error || "Booking failed"));
      }
    } catch (err) {
      console.error(err);
      setBookingMsg("Error connecting to server.");
    } finally {
      setBookingLoading(false);
    }
  };

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
          <div className="pill"><FaHandshake style={{ marginRight: '6px' }} /> {eventData.category || "Events"}</div>
          <h1 className="title">{displayTitle}</h1>

          <div className="meta">
            <div className="meta-item"><FaCalendarAlt style={{ marginRight: '6px' }} /> {displayStartDate} {displayStartTime && `at ${displayStartTime}`} {displayEndDate && `to ${displayEndDate}`}</div>
            <div className="meta-item">
              <FaMapMarkerAlt style={{ marginRight: '4px' }} /> <a className="meta-link" href={eventData.map_url || "#"}>{displayLocation}</a>
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
                <div className="location-name">
                  {eventData.address || displayLocation}
                </div>
                {eventData.map_url && (
                  <a className="view-map" href={eventData.map_url} target="_blank" rel="noreferrer"><FaMapMarkerAlt style={{ marginRight: '4px' }} /> View on map</a>
                )}
              </div>
              <div className="map-wrap">
                {eventData.map_url ? (
                  <a href={eventData.map_url} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', height: '100%', background: '#eee', textAlign: 'center', paddingTop: '100px', borderRadius: '12px', color: '#111', textDecoration: 'none' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}><FaMap /></div>
                    <strong>Click to Open Google Maps</strong>
                  </a>
                ) : (
                  <iframe
                    title="map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(displayLocation)}&output=embed`}
                  />
                )}
              </div>
            </div>

            <div className="block">
              <h2 className="block-title">Event Gallery</h2>
              <div className="gallery">
                <img src={eventData.image || gallery1} alt="" />
                {gallery2 && <img src={gallery2} alt="" />}
                {gallery3 && <img src={gallery3} alt="" />}
              </div>
            </div>

            {/* Dynamic Event Description could go here if added to backend */}

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

            {/* Dynamic Business Benefits / FAQ could go here if added to backend */}
          </div>
          <aside className="right-col">

            {/* TICKET / PRICE CARD */}
            <div className="card sticky-card">
              <h3 className="card-title" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <FaTicketAlt style={{ marginRight: '8px' }} /> Book Your Ticket
              </h3>

              <div className="price-amount">{displayPrice}</div>

              {/* Seat Info */}
              {totalSeats > 0 && (
                <div className="seat-info-box">
                  <div className="seat-stats">
                    <div className="seat-stat">
                      <span className="seat-stat-num">{totalSeats}</span>
                      <span className="seat-stat-label">Total Seats</span>
                    </div>
                    <div className="seat-stat">
                      <span className="seat-stat-num">{bookedSeats}</span>
                      <span className="seat-stat-label">Booked</span>
                    </div>
                    <div className="seat-stat">
                      <span className={`seat-stat-num ${seatsLeft <= 5 ? 'low' : ''}`}>{seatsLeft}</span>
                      <span className="seat-stat-label">Available</span>
                    </div>
                  </div>

                  <div className="seat-progress-wrap">
                    <div className="seat-progress-bar">
                      <div
                        className={`seat-progress-fill ${seatPercent >= 90 ? 'critical' : seatPercent >= 70 ? 'warning' : ''}`}
                        style={{ width: `${seatPercent}%` }}
                      />
                    </div>
                    <div className="seat-progress-text">{seatPercent}% Filled</div>
                  </div>

                  {seatsLeft <= 10 && seatsLeft > 0 && (
                    <div className="seat-urgency">
                      <FaFire style={{ color: 'orange', marginRight: '6px' }} /> Only {seatsLeft} seat{seatsLeft > 1 ? 's' : ''} left! Book now!
                    </div>
                  )}
                </div>
              )}

              <button
                className={`btn btn-book ${isFull ? 'btn-disabled' : ''}`}
                onClick={handleBookNow}
                disabled={isFull || bookingLoading}
              >
                {bookingLoading ? <><FaHourglassHalf style={{ marginRight: '6px' }} /> Booking...</> : isFull ? <><FaBan style={{ marginRight: '6px' }} /> Slot Full</> : <><FaTicketAlt style={{ marginRight: '6px' }} /> Book Now</>}
              </button>

              {bookingMsg && <div className="booking-msg">{bookingMsg}</div>}
            </div>

            {/* ORGANIZER CARD */}
            <div className="card">
              <h3 className="card-title">Organized By</h3>

              <div className="org-row">
                <div className="org-logo">
                  <img src={orgLogo} alt="Organizer Logo" />
                </div>

                <div>
                  <div className="org-name">{eventData.organized_by || "ADUGALAM"}</div>
                  <div className="org-sub">
                    For any event-related inquiries, contact at
                    <br />
                    <a href="mailto:adugalaminfo@gmail.com">
                      adugalaminfo@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="card-divider"></div>

              <button className="link-btn">Contact this event</button>


            </div>



            <button
              className="link-btn"
              onClick={() => setShowShare(!showShare)}
            >
              <FaLink style={{ marginRight: '6px' }} /> Share this event
            </button>

            {showShare && (
              <div className="share-box">
                {shareLinks.map((item, i) => (
                  item.action ? (
                    <button
                      key={i}
                      className="share-item"
                      onClick={item.action}
                    >
                      <span>{item.icon}</span>
                      {item.name}
                    </button>
                  ) : (
                    <a
                      key={i}
                      className="share-item"
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>{item.icon}</span>
                      {item.name}
                    </a>
                  )
                ))}
              </div>
            )}


            <div className="card review-card">
              <h3 className="card-title">Reviews</h3>

              {/* SUMMARY */}
              <div className="review-summary">
                <div className="avg">{avg}</div>
                <div className="stars">{stars(Math.round(avg))}</div>
                <div className="count">{reviews.length} reviews</div>
              </div>

              {/* FORM */}
              <div className="review-form">

                <label className="field">
                  <span>Your Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </label>

                <div className="field">
                  <span>Your Rating</span>
                  <div className="star-picker" style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        className={`star-btn ${rating >= val ? "active" : ""}`}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() => setRating(val)}
                      >
                        {rating >= val ? <FaStar color="#ffc107" size={24} /> : <FaRegStar color="#e4e5e9" size={24} />}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="field">
                  <span>Your Review</span>
                  <textarea
                    rows="3"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your review..."
                  />
                </label>

                <button
                  className="btn btn-book"
                  type="button"
                  onClick={submitReview}
                >
                  Submit Review
                </button>

                {msg && <div className="review-msg">{msg}</div>}
              </div>

              <div className="card-divider"></div>

              {/* REVIEW LIST */}
              <div className="review-list">
                {reviews.length === 0 && (
                  <p className="muted">No reviews yet. Be the first!</p>
                )}
                {reviews.map((r) => (
                  <div key={r.id || r.created_at || Math.random()} className="review-item">
                    <div className="review-head">
                      <strong>{r.name}</strong>
                      <div className="stars">{stars(r.rating)}</div>
                    </div>
                    <p>{r.text}</p>
                    <small>
                      {r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "Just now"}
                    </small>
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