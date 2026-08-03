import { useEffect, useState } from "react";
import "./BookingManagement.css";

const API = import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com";

/* ── Icon components ── */
const IconCalendar  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const IconRefresh   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>;
const IconEye       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconRefund    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>;
const IconClose     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconClock     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconLocation  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconSearch    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>;

/* ── Status config ── */
const STATUS_CONFIG = {
  CONFIRMED: { label: "Confirmed", cls: "bm-status--confirmed" },
  PENDING:   { label: "Pending",   cls: "bm-status--pending"   },
  CANCELLED: { label: "Cancelled", cls: "bm-status--cancelled" },
  REFUNDED:  { label: "Refunded",  cls: "bm-status--refunded"  },
  COMPLETED: { label: "Completed", cls: "bm-status--completed" },
};

const formatTime = t =>
  t ? new Date(`1970-01-01T${t}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

export default function BookingManagement() {
  const [bookings,         setBookings]         = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [actionLoading,    setActionLoading]    = useState(false);
  const [selectedBooking,  setSelectedBooking]  = useState(null);
  const [search,           setSearch]           = useState("");
  const [statusFilter,     setStatusFilter]     = useState("ALL");
  const [toast,            setToast]            = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/bookings/`);
      const data = await res.json();
      setBookings(data.results || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      showToast("Failed to load bookings.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const refundBooking = async id => {
    if (!window.confirm("Refund this booking? The amount will be returned to the user.")) return;
    setActionLoading(true);
    try {
      const res  = await fetch(`${API}/api/admin/bookings/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REFUNDED" }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Refund processed successfully! 💸");
        fetchBookings();
      } else {
        showToast(data.error || "Refund failed.", "error");
      }
    } catch {
      showToast("Server error. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── derived data ── */
  const manualCount = bookings.filter(b => b.booking_type === "MANUAL").length;

  const filtered = bookings.filter(b => {
    const matchSearch =
      (b.player_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.turf?.name  || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL"
      ? true
      : statusFilter === "MANUAL"
        ? b.booking_type === "MANUAL"
        : b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});
  const totalRevenue = bookings
    .filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((s, b) => s + Number(b.amount || 0), 0);

  return (
    <div className="bm-page">

      {/* ── Toast (fixed, outside content) ── */}
      {toast.msg && (
        <div className={`bm-toast bm-toast--${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      <div className="bm-content">

      {/* ── Hero Header ── */}
      <div className="bm-hero">
        <div className="bm-hero-shimmer" aria-hidden />
        <div className="bm-hero-orb bm-hero-orb1" aria-hidden />
        <div className="bm-hero-orb bm-hero-orb2" aria-hidden />
        <div className="bm-hero-inner">
          <div className="bm-hero-icon"><IconCalendar /></div>
          <div className="bm-hero-text">
            <div className="bm-hero-greeting">Booking Overview</div>
            <h1 className="bm-hero-title">Booking Management</h1>
            <p className="bm-hero-sub">View and manage all turf bookings · {bookings.length} total</p>
          </div>
        </div>
        <div className="bm-hero-right">
          <div className="bm-hero-badges">
            <span className="bm-hero-badge bm-hero-badge--live"><span className="bm-live-dot" />Live</span>
            <span className="bm-hero-badge bm-hero-badge--sync">Auto-sync</span>
          </div>
          <button className="bm-refresh-btn" onClick={fetchBookings}>
            <IconRefresh /> Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="bm-kpi-strip">
        {[
          { label: "Total",     value: bookings.length,       color: "blue"   },
          { label: "Confirmed", value: counts.CONFIRMED || 0, color: "green"  },
          { label: "Cancelled", value: counts.CANCELLED || 0, color: "red"    },
          { label: "Refunded",  value: counts.REFUNDED  || 0, color: "amber"  },
          { label: "Manual",    value: manualCount,            color: "orange" },
          { label: "Revenue",   value: `₹${totalRevenue.toLocaleString()}`, color: "purple" },
        ].map((k, i) => (
          <div key={i} className={`bm-kpi bm-kpi--${k.color}`} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="bm-kpi-value">{k.value}</div>
            <div className="bm-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bm-filters">
        <div className="bm-search-wrap">
          <span className="bm-search-icon"><IconSearch /></span>
          <input
            className="bm-search"
            placeholder="Search by user or turf…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="bm-status-pills">
          {["ALL", "CONFIRMED", "PENDING", "CANCELLED", "REFUNDED", "MANUAL"].map(s => (
            <button
              key={s}
              className={`bm-pill ${statusFilter === s ? "bm-pill--active" : ""} ${s === "MANUAL" ? "bm-pill--manual" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "MANUAL" ? "🏢 Manual" : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="bm-skeleton-list">
          {[1,2,3,4,5].map(i => <div key={i} className="bm-skeleton-row" />)}
        </div>
      )}

      {/* ── Desktop Table ── */}
      {!loading && (
        <div className="bm-table-wrap">
          <table className="bm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Turf</th>
                <th>Date</th>
                <th>Slot Time</th>
                <th>Game</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="bm-empty-cell">No bookings found.</td></tr>
              )}
              {filtered.map((b, idx) => {
                const sc = STATUS_CONFIG[b.status] || { label: b.status, cls: "" };
                return (
                  <tr key={b.id} style={{ animationDelay: `${idx * 0.03}s` }}>
                    <td className="bm-td-num">{idx + 1}</td>
                    <td>
                      <div className="bm-td-user">
                        <div className="bm-avatar" style={b.booking_type === "MANUAL" ? {background: "linear-gradient(135deg, #f97316, #ea580c)"} : {}}>{(b.player_name || "?")[0].toUpperCase()}</div>
                        <div>
                          <span>{b.player_name}</span>
                          {b.booking_type === "MANUAL" && (
                            <span style={{display:"block",fontSize:"10px",color:"#f97316",fontWeight:600,marginTop:2}}>🏢 Vendor Manual</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="bm-td-turf">{b.turf?.name || "—"}</td>
                    <td className="bm-td-date">{b.date || "—"}</td>
                    <td className="bm-td-slots">
                      {b.slots?.length > 0
                        ? b.slots.map((s, i) => (
                            <div key={i} className="bm-slot-chip">
                              <IconClock /> {formatTime(s.start_time)}–{formatTime(s.end_time)}
                            </div>
                          ))
                        : "—"}
                    </td>
                    <td>{b.game?.name?.replace(/[\[\]"]/g, "") || "—"}</td>
                    <td className="bm-td-amount">₹{Number(b.amount || 0).toLocaleString()}</td>
                    <td><span className={`bm-status ${sc.cls}`}>{sc.label}</span></td>
                    <td>
                      <div className="bm-actions">
                        <button className="bm-btn bm-btn--view" onClick={() => setSelectedBooking(b)}>
                          <IconEye /> View
                        </button>
                        {b.status !== "REFUNDED" && b.status !== "CANCELLED" && (
                          <button className="bm-btn bm-btn--refund" disabled={actionLoading} onClick={() => refundBooking(b.id)}>
                            <IconRefund /> Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Mobile Cards ── */}
      {!loading && (
        <div className="bm-card-list">
          {filtered.length === 0 && (
            <div className="bm-empty-state">
              <span className="bm-empty-icon">📅</span>
              <p>No bookings found.</p>
            </div>
          )}
          {filtered.map((b, idx) => {
            const sc = STATUS_CONFIG[b.status] || { label: b.status, cls: "" };
            return (
              <div key={b.id} className="bm-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="bm-card-head">
                  <div className="bm-avatar bm-avatar--lg">{(b.player_name || "?")[0].toUpperCase()}</div>
                  <div className="bm-card-info">
                    <div className="bm-card-name">{b.player_name}</div>
                    <div className="bm-card-turf">
                      <IconLocation /> {b.turf?.name || "—"}
                    </div>
                  </div>
                  <span className={`bm-status ${sc.cls}`}>{sc.label}</span>
                </div>

                <div className="bm-card-meta">
                  <div className="bm-card-row">
                    <span className="bm-card-key">Date</span>
                    <span className="bm-card-val">{b.date || "—"}</span>
                  </div>
                  <div className="bm-card-row">
                    <span className="bm-card-key">Slot</span>
                    <span className="bm-card-val">
                      {b.slots?.length > 0
                        ? b.slots.map((s, i) => `${formatTime(s.start_time)}–${formatTime(s.end_time)}`).join(", ")
                        : "—"}
                    </span>
                  </div>
                  <div className="bm-card-row">
                    <span className="bm-card-key">Game</span>
                    <span className="bm-card-val">{b.game?.name?.replace(/[\[\]"]/g, "") || "—"}</span>
                  </div>
                  <div className="bm-card-row">
                    <span className="bm-card-key">Amount</span>
                    <span className="bm-card-val bm-card-val--highlight">₹{Number(b.amount || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bm-card-actions">
                  <button className="bm-btn bm-btn--view" onClick={() => setSelectedBooking(b)}>
                    <IconEye /> View
                  </button>
                  {b.status !== "REFUNDED" && b.status !== "CANCELLED" && (
                    <button className="bm-btn bm-btn--refund" disabled={actionLoading} onClick={() => refundBooking(b.id)}>
                      <IconRefund /> Refund
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Details Modal ── */}
      {selectedBooking && (
        <div className="bm-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSelectedBooking(null); }}>
          <div className="bm-modal">
            <div className="bm-modal-header">
              <h3 className="bm-modal-title">📋 Booking Details</h3>
              <button className="bm-modal-close" onClick={() => setSelectedBooking(null)}><IconClose /></button>
            </div>

            <div className="bm-modal-body">
              {/* Status banner */}
              <div className={`bm-modal-status-bar ${STATUS_CONFIG[selectedBooking.status]?.cls || ""}`}>
                {STATUS_CONFIG[selectedBooking.status]?.label || selectedBooking.status}
              </div>

              <div className="bm-modal-grid">
                {[
                  { label: "Booking ID",  value: `#${selectedBooking.id}` },
                  { label: "User",        value: selectedBooking.player_name },
                  { label: "Turf",        value: selectedBooking.turf?.name },
                  { label: "Date",        value: selectedBooking.date },
                  { label: "Game",        value: selectedBooking.game?.name?.replace(/[\[\]"]/g, "") },
                  { label: "Amount",      value: `₹${Number(selectedBooking.amount || 0).toLocaleString()}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bm-modal-row">
                    <span className="bm-modal-key">{label}</span>
                    <span className="bm-modal-val">{value || "—"}</span>
                  </div>
                ))}

                <div className="bm-modal-row bm-modal-row--full">
                  <span className="bm-modal-key">Slot Time(s)</span>
                  <div className="bm-modal-slots">
                    {selectedBooking.slots?.length > 0
                      ? selectedBooking.slots.map((s, i) => (
                          <span key={i} className="bm-slot-chip">
                            <IconClock /> {formatTime(s.start_time)}–{formatTime(s.end_time)}
                          </span>
                        ))
                      : <span className="bm-modal-val">—</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bm-modal-footer">
              {selectedBooking.status !== "REFUNDED" && selectedBooking.status !== "CANCELLED" && (
                <button
                  className="bm-btn bm-btn--refund"
                  disabled={actionLoading}
                  onClick={() => { refundBooking(selectedBooking.id); setSelectedBooking(null); }}
                >
                  <IconRefund /> Process Refund
                </button>
              )}
              <button className="bm-modal-btn--close" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      </div>{/* end bm-content */}
    </div>
  );
}