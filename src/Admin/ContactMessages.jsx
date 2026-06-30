import React, { useEffect, useState } from "react";
import AdminAPI from "../api/adminApi";
import "./ContactMessages.css";

/* ── Icon Components ── */
const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconInbox = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M8 16H3v5"/>
  </svg>
);

/* ── Helper: format date string ── */
const formatDate = (raw) => {
  if (!raw) return { date: "—", time: "" };
  try {
    const d = new Date(raw);
    const date = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    return { date, time };
  } catch {
    return { date: raw, time: "" };
  }
};

/* ── Helper: get initials ── */
const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setSpinning(true);
    try {
      const res = await AdminAPI.get("api/contact/list/");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setSpinning(false), 600);
    }
  };

  const now = new Date();

  /* ── Summary Stat Cards ── */
  const STAT_CARDS = [
    {
      icon: <IconMail />,
      value: messages.length,
      label: "Total Messages",
      color: "blue",
    },
    {
      icon: <IconUsers />,
      value: new Set(messages.map((m) => m.email)).size,
      label: "Unique Senders",
      color: "green",
    },
    {
      icon: <IconCalendar />,
      value: messages.filter((m) => {
        try {
          const d = new Date(m.created_at);
          return d.toDateString() === now.toDateString();
        } catch { return false; }
      }).length,
      label: "Today's Messages",
      color: "purple",
    },
  ];

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="cm-loading">
        <div className="cm-spinner" />
        <span>Loading messages…</span>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     JSX
  ═══════════════════════════════════════════════════════════ */
  return (
    <div className="cm-page">
      <div className="cm-wrap">

        {/* ══ HERO HEADER ══ */}
        <div className="cm-hero">
          <div className="cm-hero-shimmer" aria-hidden="true" />
          <div className="cm-hero-orb cm-hero-orb-1" aria-hidden="true" />
          <div className="cm-hero-orb cm-hero-orb-2" aria-hidden="true" />

          <div className="cm-hero-text">
            <div className="cm-hero-eyebrow">📬 Admin Panel</div>
            <h1 className="cm-hero-title">Contact Messages</h1>
            <p className="cm-hero-sub">
              Manage all user inquiries submitted via the contact form ·{" "}
              {now.toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="cm-hero-right">
            <div className="cm-hero-badge-group">
              <span className="cm-hero-badge cm-hero-badge--count">
                <span className="cm-live-dot" />
                {messages.length} messages
              </span>
              <span className="cm-hero-badge cm-hero-badge--inbox">
                <IconInbox />
                Inbox
              </span>
            </div>

            <button
              className={`cm-refresh-btn${spinning ? " spinning" : ""}`}
              onClick={fetchMessages}
              disabled={spinning}
            >
              <IconRefresh />
              {spinning ? "Refreshing…" : "Refresh List"}
            </button>
          </div>
        </div>

        {/* ══ SUMMARY STAT CARDS ══ */}
        <div className="cm-stats-grid">
          {STAT_CARDS.map((card, i) => (
            <div
              key={i}
              className={`cm-stat-card cm-stat-card--${card.color}`}
              style={{ animationDelay: `${0.05 + i * 0.06}s` }}
            >
              <div className="cm-stat-card-shine" aria-hidden="true" />
              <div className="cm-stat-icon-wrap">{card.icon}</div>
              <div className="cm-stat-info">
                <div className="cm-stat-value">{card.value.toLocaleString()}</div>
                <div className="cm-stat-label">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ══ SECTION HEADER ══ */}
        <div className="cm-section-header">
          <div className="cm-section-title-wrap">
            <h2 className="cm-section-title">All Messages</h2>
            <span className="cm-section-sub">
              {messages.length === 0 ? "No submissions yet" : `${messages.length} total`}
            </span>
          </div>
        </div>

        {/* ══ GLASS CARD — TABLE (desktop) ══ */}
        <div className="cm-glass-card">

          {/* ── Desktop Table ── */}
          <div className="cm-table-scroll">
            <table className="cm-table">
              <thead>
                <tr>
                  <th>Date &amp; Time</th>
                  <th>User Name</th>
                  <th>Contact Details</th>
                  <th>Subject</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="cm-empty-state">
                        <span className="cm-empty-icon">📭</span>
                        <h3 className="cm-empty-title">No Messages Found</h3>
                        <p className="cm-empty-sub">
                          New submissions from the contact form will appear here automatically.
                        </p>
                        <span className="cm-empty-badge">
                          <span className="cm-live-dot" style={{ background: "currentColor" }} />
                          Table structure is ready
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  messages.map((m, idx) => {
                    const { date, time } = formatDate(m.created_at);
                    return (
                      <tr key={m.id} style={{ animationDelay: `${0.05 + idx * 0.04}s` }}>
                        {/* Date & Time */}
                        <td className="cm-td-date">
                          <div className="cm-date-main">{date}</div>
                          {time && <div className="cm-date-time">{time}</div>}
                        </td>

                        {/* Name with avatar */}
                        <td>
                          <div className="cm-name-wrap">
                            <div className="cm-avatar">{getInitials(m.name)}</div>
                            <span className="cm-td-name">{m.name}</span>
                          </div>
                        </td>

                        {/* Contact Details */}
                        <td>
                          <div className="cm-contact-email">{m.email}</div>
                          {m.phone && <div className="cm-contact-phone">{m.phone}</div>}
                        </td>

                        {/* Subject Badge */}
                        <td>
                          <span className="cm-subject-badge">{m.subject}</span>
                        </td>

                        {/* Message */}
                        <td className="cm-td-message">{m.message}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Card Layout ── */}
          <div className="cm-mobile-cards">
            {messages.length === 0 ? (
              <div className="cm-empty-state">
                <span className="cm-empty-icon">📭</span>
                <h3 className="cm-empty-title">No Messages Found</h3>
                <p className="cm-empty-sub">New submissions will appear here automatically.</p>
              </div>
            ) : (
              messages.map((m, idx) => {
                const { date, time } = formatDate(m.created_at);
                return (
                  <div
                    key={m.id}
                    className="cm-msg-card"
                    style={{ animationDelay: `${0.05 + idx * 0.05}s` }}
                  >
                    <div className="cm-msg-card-header">
                      <div className="cm-msg-card-name-row">
                        <div className="cm-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                          {getInitials(m.name)}
                        </div>
                        <span className="cm-msg-card-name">{m.name}</span>
                      </div>
                      <span className="cm-msg-card-date">
                        {date} {time && `· ${time}`}
                      </span>
                    </div>

                    <div className="cm-msg-card-contact">
                      <span className="cm-msg-card-email">{m.email}</span>
                      {m.phone && <span className="cm-msg-card-phone">{m.phone}</span>}
                    </div>

                    <div className="cm-msg-card-subject">
                      <span className="cm-subject-badge">{m.subject}</span>
                    </div>

                    <div className="cm-msg-card-message">{m.message}</div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* ══ FOOTER ══ */}
        <footer className="cm-footer">
          © 2025 Adugalam Turf Booking Platform · Admin Panel
        </footer>

      </div>
    </div>
  );
};

export default ContactMessages;