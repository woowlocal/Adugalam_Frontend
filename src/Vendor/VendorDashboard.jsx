import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorDashboard.css";

/* ── Icon components ── */
const IconBookings = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>;
const IconEarnings = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="1" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const IconTurfs = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const IconUpcoming = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></svg>;
const IconPending = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconPlus = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconList = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>;
const IconClock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconDiscount = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
const IconTrendUp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
const IconTrendDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>;

const QUICK_ACTIONS = [
  { label: "Add Turf", icon: <IconPlus />, path: "/VendorAddTurf", color: "green" },
  { label: "Turf List", icon: <IconList />, path: "/VendorTurfList", color: "blue" },
  { label: "Peak Hours", icon: <IconClock />, path: "/VendorPeakHours", color: "amber" },
  { label: "Discounts", icon: <IconDiscount />, path: "/VendorDiscountPage", color: "purple" },
  { label: "Bookings", icon: <IconBookings />, path: "/VendorBookingManagement", color: "teal" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_INDEX = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

/* Map backend stat icons → React SVG components */
const ICON_MAP = {
  "🏠": <IconTurfs />,
  "🏟️": <IconTurfs />,
  "📅": <IconBookings />,
  "🗓️": <IconUpcoming />,
  "💲": <IconEarnings />,
  "💰": <IconEarnings />,
  "⏳": <IconPending />,
};

const CARD_COLORS = ["green", "amber", "blue", "purple", "teal"];

const API = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "") + "/api";

/* ─────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();

  // Raw API state
  const [stats, setStats] = useState([]);
  const [bookings, setBookings] = useState([]);   // ALL vendor bookings
  const [coaches, setCoaches] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const vendorName = localStorage.getItem("vendor_name") || "Vendor";
  const firstName = vendorName.trim().split(/\s+/)[0];

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? "Good Morning" :
      now.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  /* ── Fetch both APIs in parallel ── */
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { setLoading(false); return; }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API}/vendor/dashboard/`, { headers }).then(r => r.json()),
      fetch(`${API}/vendor/bookings/`, { headers }).then(r => r.json()),
    ])
      .then(([dashData, bookData]) => {
        setStats(dashData?.stats || []);
        setCoaches(dashData?.coaches || []);
        setReviews(dashData?.reviews || []);
        // bookData may be an array directly or { results: [] }
        setBookings(Array.isArray(bookData) ? bookData : bookData?.results || []);
      })
      .catch(err => {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Recent 5 bookings ── */
  const recentBookings = useMemo(() => bookings.slice(0, 5), [bookings]);

  /* ── Weekly bar chart: count bookings per weekday (last 7 days) ── */
  const weeklyData = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    const today = new Date();
    const sevenDays = new Date(today);
    sevenDays.setDate(today.getDate() - 6);

    bookings.forEach(b => {
      if (!b.date) return;
      // date comes as "DD-MM-YYYY"
      const [dd, mm, yyyy] = b.date.split("-");
      const d = new Date(`${yyyy}-${mm}-${dd}`);
      if (d >= sevenDays && d <= today) {
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" }); // "Mon"
        const idx = DAY_INDEX[dayName];
        if (idx !== undefined) counts[idx]++;
      }
    });

    const max = Math.max(...counts, 1); // avoid div-by-zero
    return counts.map(c => Math.round((c / max) * 100));  // percentages
  }, [bookings]);

  /* ── Real week-over-week trend per stat ── */
  const weeklyTrends = useMemo(() => {
    // Compare this week vs last week booking counts per turf stat
    const today = new Date();
    const startThisWeek = new Date(today); startThisWeek.setDate(today.getDate() - 7);
    const startLastWeek = new Date(today); startLastWeek.setDate(today.getDate() - 14);

    const thisWeekCount = bookings.filter(b => {
      if (!b.date) return false;
      const [dd, mm, yyyy] = b.date.split("-");
      const d = new Date(`${yyyy}-${mm}-${dd}`);
      return d >= startThisWeek && d <= today;
    }).length;

    const lastWeekCount = bookings.filter(b => {
      if (!b.date) return false;
      const [dd, mm, yyyy] = b.date.split("-");
      const d = new Date(`${yyyy}-${mm}-${dd}`);
      return d >= startLastWeek && d < startThisWeek;
    }).length;

    const pct = lastWeekCount === 0
      ? (thisWeekCount > 0 ? 100 : 0)
      : Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);

    return pct; // single number applied contextually
  }, [bookings]);

  /* ── Turf occupancy from real data ── */
  const turfOccupancy = useMemo(() => {
    if (!bookings.length) return [];
    const counts = {};
    bookings.forEach(b => {
      const t = b.turf || "Unknown";
      counts[t] = (counts[t] || 0) + 1;
    });
    const maxVal = Math.max(...Object.values(counts), 1);
    const colors = ["green", "blue", "amber", "purple", "teal"];
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count], i) => ({
        name,
        pct: Math.round((count / maxVal) * 100),
        color: colors[i % colors.length],
      }));
  }, [bookings]);

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dash-spinner" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  /* ─── Error ─── */
  if (error) {
    return (
      <div className="dashboard-loading">
        <span style={{ color: "#ef4444" }}>{error}</span>
      </div>
    );
  }

  /* ─── Fallback stat cards if API returned nothing ─── */
  const statCards = stats.length > 0 ? stats : [
    { icon: "🏠", title: "Total Turfs Owned", value: "—" },
    { icon: "📅", title: "Today's Bookings", value: "—" },
    { icon: "🗓️", title: "Upcoming Bookings", value: "—" },
    { icon: "💲", title: "Monthly Earnings", value: "—" },
    { icon: "⏳", title: "Pending Approvals", value: "—" },
  ];

  /* ─── JSX ─── */
  return (
    <div className="dashboard-page">
      <div className="dashboard">

        {/* ══ HERO HEADER ══ */}
        <div className="dashboard-hero">
          <div className="hero-shimmer" aria-hidden="true" />
          <div className="hero-orb hero-orb-1" aria-hidden="true" />
          <div className="hero-orb hero-orb-2" aria-hidden="true" />
          <div className="hero-text">
            <div className="hero-greeting">{greeting}, {firstName}! 👋</div>
            <h1 className="hero-title">Dashboard Overview</h1>
            <p className="hero-sub">
              Smart turf booking &amp; sports management ·{" "}
              {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="hero-badge-group">
            <span className="hero-badge hero-badge--live">
              <span className="live-dot" /> Live
            </span>
            <span className="hero-badge hero-badge--sync">Auto-sync</span>
          </div>
        </div>

        {/* ══ KPI STAT CARDS ══ */}
        <div className="stats-grid">
          {statCards.map((item, i) => {
            const isUp = weeklyTrends >= 0;
            const trendPct = i === 1 || i === 2
              ? Math.abs(weeklyTrends)  // booking-related stats use real WoW
              : null;                    // others: no fake trend

            return (
              <div key={i} className={`stat-card stat-card--${CARD_COLORS[i % CARD_COLORS.length]}`}>
                <div className="stat-card-shine" aria-hidden="true" />
                <div className="stat-icon-wrap">
                  {ICON_MAP[item.icon] || <span style={{ fontSize: 20 }}>{item.icon}</span>}
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {item.title.toLowerCase().includes("earnings")
                      ? `₹${item.value}`
                      : item.value}
                  </div>
                  <div className="stat-label">{item.title}</div>
                </div>
                {trendPct !== null ? (
                  <div className={`stat-trend ${isUp ? "" : "stat-trend--down"}`}>
                    {isUp ? <IconTrendUp /> : <IconTrendDown />}
                    {isUp ? "+" : "-"}{trendPct}% this week
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* ══ QUICK ACTIONS ══ */}
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
          <span className="section-sub">Jump to key features</span>
        </div>
        <div className="quick-actions-row">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.path}
              className={`quick-action-btn quick-action-btn--${action.color}`}
              onClick={() => navigate(action.path)}
            >
              <span className="qa-icon">{action.icon}</span>
              <span className="qa-label">{action.label}</span>
            </button>
          ))}
        </div>

        {/* ══ MAIN CONTENT GRID ══ */}
        <div className="dash-main-grid">

          {/* Weekly Bookings – real data from last 7 days */}
          <div className="glass-card perf-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">Weekly Bookings</h3>
                <p className="card-sub">Last 7 days · {bookings.length} total bookings</p>
              </div>
              <span className="card-badge card-badge--green">This Week</span>
            </div>
            <div className="bar-chart">
              {DAYS.map((day, i) => (
                <div className="bar-col" key={day}>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${weeklyData[i] || 0}%` }}
                      title={`${weeklyData[i] || 0}% of peak`}
                    />
                  </div>
                  <span className="bar-label">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings – real data */}
          <div className="glass-card bookings-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">Recent Bookings</h3>
                <p className="card-sub">
                  {bookings.length > 0
                    ? `Showing latest ${Math.min(5, bookings.length)} of ${bookings.length}`
                    : "No bookings yet"}
                </p>
              </div>
              <button className="card-link-btn" onClick={() => navigate("/VendorBookingManagement")}>
                View All →
              </button>
            </div>

            {recentBookings.length > 0 ? (
              <div className="bookings-table-wrap">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Player</th>
                      <th>Ground</th>
                      <th>Game</th>
                      <th>Date &amp; Slot</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b) => (
                      <tr key={b.raw_id || b.id}>
                        <td className="booking-id">{b.id}</td>
                        <td>{b.player || b.player_name || "—"}</td>
                        <td>{b.turf || "—"}</td>
                        <td>{Array.isArray(b.game) ? b.game.join(', ') : (typeof b.game === 'string' ? b.game.replace(/[\[\]"']/g, '') : (b.game || "—"))}</td>
                        <td className="booking-slot">
                          <span>{b.date || "—"}</span>
                          {b.time && <span className="slot-time"> · {b.time}</span>}
                        </td>
                        <td>
                          <span className={`status-pill status-pill--${(b.status || "pending").toLowerCase()}`}>
                            {b.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <p>No bookings yet.</p>
                <p className="empty-hint">Bookings from players will appear here once received.</p>
              </div>
            )}
          </div>

        </div>

        {/* ══ BOTTOM GRID ══ */}
        <div className="dash-bottom-grid">

          {/* Coach Monitoring */}
          <div className="glass-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">Coach Monitoring</h3>
                <p className="card-sub">{coaches.length} coach{coaches.length !== 1 ? "es" : ""} registered</p>
              </div>
              <span className="card-badge card-badge--blue">Active</span>
            </div>
            {coaches.length > 0 ? (
              <ul className="coach-list">
                {coaches.map((coach, i) => (
                  <li key={i} className="coach-row">
                    <div className="coach-avatar">{(coach.name || "C").charAt(0)}</div>
                    <div className="coach-info">
                      <span className="coach-name">{coach.name}</span>
                      <span className={`coach-status coach-status--${coach.status || "offline"}`}>
                        <span className={`status-dot status-dot--${coach.status || "offline"}`} />
                        {coach.status || "offline"}
                      </span>
                    </div>
                    <span className="coach-sport">{coach.sport || "Fitness"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">👤</span>
                <p>No coaches registered yet.</p>
                <p className="empty-hint">Add coaches to monitor their availability here.</p>
              </div>
            )}
          </div>

          {/* User Reviews */}
          <div className="glass-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">User Reviews</h3>
                <p className="card-sub">{reviews.length} review{reviews.length !== 1 ? "s" : ""} received</p>
              </div>
              <span className="card-badge card-badge--amber">⭐ Recent</span>
            </div>
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((r, i) => (
                  <div key={i} className="review-item">
                    <div className="review-avatar">{(r.user || "U").charAt(0)}</div>
                    <div className="review-body">
                      <span className="review-user">{r.user}</span>
                      <p className="review-text">{r.text}</p>
                    </div>
                    <div className="review-stars">{"★".repeat(r.rating || 5)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">💬</span>
                <p>No reviews yet.</p>
                <p className="empty-hint">Reviews from players will appear here once received.</p>
              </div>
            )}
          </div>

          {/* Turf Occupancy – real data from bookings */}
          <div className="glass-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-title">Turf Occupancy</h3>
                <p className="card-sub">
                  {turfOccupancy.length > 0
                    ? "Booking share per ground"
                    : "No booking data yet"}
                </p>
              </div>
            </div>
            {turfOccupancy.length > 0 ? (
              <div className="perf-list">
                {turfOccupancy.map((item) => (
                  <div key={item.name} className="perf-row">
                    <div className="perf-meta">
                      <span className="perf-name">{item.name}</span>
                      <span className="perf-pct">{item.pct}%</span>
                    </div>
                    <div className="perf-track">
                      <div className={`perf-bar perf-bar--${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📊</span>
                <p>No booking data yet.</p>
                <p className="empty-hint">Ground usage will appear once bookings are received.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;