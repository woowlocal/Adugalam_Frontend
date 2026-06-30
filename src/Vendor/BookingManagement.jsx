import { useState, useEffect } from "react";
import "./BookingManagement.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("vendor_token") || localStorage.getItem("access");
      const apiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "https://api.adugalam.com";
      const res = await fetch(`${apiUrl}/api/vendor/bookings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("API Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map payment/status strings to css modifier classes and icons
  const getBadgeProps = (type, value) => {
    const valMap = (value || "").toLowerCase();
    
    if (type === "payment") {
      if (valMap === "paid" || valMap === "success") 
        return { className: "bm-badge--paid", icon: "💎" };
      if (valMap === "failed") 
        return { className: "bm-badge--failed", icon: "❌" };
      return { className: "", icon: "💳" };
    }

    if (type === "status") {
      if (valMap === "confirmed" || valMap === "approved") 
        return { className: "bm-badge--status-approved", icon: "✅" };
      if (valMap === "pending") 
        return { className: "bm-badge--status-pending", icon: "⏳" };
      if (valMap === "cancelled" || valMap === "rejected") 
        return { className: "bm-badge--status-rejected", icon: "🚫" };
    }

    return { className: "", icon: "" };
  };

  return (
    <div className="bm-container">
      <div className="bm-inner">
        
        {/* ── Hero Banner ── */}
        <div className="bm-hero">
          <div className="bm-hero-text">
            <p className="bm-hero-tag">Vendor · Analytics View</p>
            <h1 className="bm-hero-title">Booking Management</h1>
            <p className="bm-hero-sub">
              Monitor incoming reservations, track player details, and verify payments in one place.
            </p>
          </div>
          <div className="bm-hero-badge">
            <span className="bm-live-dot" />
            Live Sync
          </div>
        </div>

        {/* ── Main Bookings Card ── */}
        <div className="bm-card">
          
          <div className="bm-card-header">
            <div className="bm-card-header-icon">📋</div>
            <div className="bm-card-header-text">
              <h3>Latest Bookings</h3>
              <p>All transactions and reservations for your turfs</p>
            </div>
          </div>

          <div className="bm-table-wrapper">
            {loading ? (
              <div className="bm-loading">
                <div className="bm-spinner" />
                <p>Loading your booking logs...</p>
              </div>
            ) : bookings.length > 0 ? (
              <table className="bm-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Player</th>
                    <th>Turf & Game</th>
                    <th>Date & Time</th>
                    <th>Payment</th>
                    <th>Refund</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const paymentDisplay = getBadgeProps("payment", b.payment);
                    const statusDisplay = getBadgeProps("status", b.status);

                    return (
                      <tr key={b.id}>
                        <td data-label="Booking ID">
                          <span className="bm-id">#{b.id}</span>
                        </td>
                        
                        <td data-label="Player">
                          <span className="bm-player">{b.player}</span>
                        </td>
                        
                        <td data-label="Turf & Game">
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontWeight: 600, color: "var(--bm-text)" }}>{b.turf}</span>
                            <span style={{ fontSize: "11.5px", color: "var(--bm-muted)" }}>
                              {Array.isArray(b.game) ? b.game.join(', ') : (typeof b.game === 'string' ? b.game.replace(/[\[\]"']/g, '') : b.game)}
                            </span>
                          </div>
                        </td>

                        <td data-label="Date & Time">
                          <div className="bm-date-time">
                            <span className="bm-date">{b.date}</span>
                            <span className="bm-time">{b.time}</span>
                          </div>
                        </td>

                        <td data-label="Payment">
                          {b.payment ? (
                            <span className={`bm-badge ${paymentDisplay.className}`}>
                              {paymentDisplay.icon} {b.payment}
                            </span>
                          ) : (
                            <span style={{ color: "var(--bm-muted)" }}>-</span>
                          )}
                        </td>

                        <td data-label="Refund">
                          {b.refund && b.refund !== "-" ? (
                            <span className="bm-badge bm-badge--failed">
                              💸 {b.refund}
                            </span>
                          ) : (
                            <span style={{ color: "var(--bm-muted)" }}>-</span>
                          )}
                        </td>

                        <td data-label="Status">
                          <span className={`bm-badge ${statusDisplay.className}`}>
                            {statusDisplay.icon} {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="bm-empty">
                <div className="bm-empty-icon">📂</div>
                <p>No bookings found yet.</p>
                <span>Reservations will appear here once players start booking your turfs.</span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
