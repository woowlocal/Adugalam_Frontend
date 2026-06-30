import React, { useState } from "react";
import "./Eventlist.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function Eventlist() {
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );
  const [search, setSearch] = useState("");

  const totalTransactions = events.length;
  const totalWithdraw = events.length * 100;

  const handleDelete = (id) => {
    if (!window.confirm("Delete this event?")) return;
    const updated = events.filter((event) => event.id !== id);
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
  };

  const filtered = events.filter((e) =>
    (e.eventName || e.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="el-page">

      {/* ── HERO ── */}
      <div className="el-hero">
        <div className="el-hero-inner">
          <div className="el-hero-icon">📋</div>
          <div>
            <p className="el-hero-label">Admin Panel</p>
            <h2 className="el-hero-title">Event List</h2>
            <p className="el-hero-sub">View and manage all created events</p>
          </div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="el-kpi-strip">
        <div className="el-kpi el-kpi--blue">
          <div className="el-kpi-value">{events.length}</div>
          <div className="el-kpi-label">Total Events</div>
        </div>
        <div className="el-kpi el-kpi--green">
          <div className="el-kpi-value">{totalTransactions}</div>
          <div className="el-kpi-label">Total Transactions</div>
        </div>
        <div className="el-kpi el-kpi--amber">
          <div className="el-kpi-value">₹{totalWithdraw.toFixed(2)}</div>
          <div className="el-kpi-label">Total Withdraws</div>
        </div>
      </div>

      {/* ── TABLE SECTION ── */}
      <div className="el-table-card">
        <div className="el-table-header">
          <h3 className="el-table-title">
            Events List
            <span className="el-count">({filtered.length})</span>
          </h3>

          <div className="el-controls">
            <input
              type="text"
              placeholder="Search Event Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="el-search"
            />
            <button
              className="el-export-btn"
              onClick={() => {
                const csv = [
                  ["Sl", "Event Name", "Category", "Location", "Start Date", "Amount", "Organized By"],
                  ...events.map((ev, i) => [
                    i + 1,
                    ev.eventName || ev.name || "-",
                    ev.eventCategory || "-",
                    ev.location || "-",
                    ev.startDate || "-",
                    ev.amount || "-",
                    ev.organizedBy || "-",
                  ]),
                ]
                  .map((r) => r.join(","))
                  .join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "events.csv";
                a.click();
              }}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="el-table-scroll">
          <table className="el-table">
            <thead>
              <tr>
                <th>Sl</th>
                <th>Event Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Organized By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="el-empty">
                    <span className="el-empty-icon">📭</span>
                    <p>No events found. Add events from the Add Events page.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((event, index) => (
                  <tr key={event.id}>
                    <td className="el-td-num">{index + 1}</td>
                    <td>
                      <strong className="el-event-name">
                        {event.eventName || event.name || "—"}
                      </strong>
                      <p className="el-event-id">ID: {event.id}</p>
                    </td>
                    <td>
                      <span className="el-category-badge">
                        {event.eventCategory || "—"}
                      </span>
                    </td>
                    <td className="el-td-location">{event.location || "—"}</td>
                    <td className="el-td-date">{event.startDate || "—"}</td>
                    <td>
                      <span className="el-price-chip">
                        {event.amount ? `₹${event.amount}` : "Free"}
                      </span>
                    </td>
                    <td>{event.organizedBy || "—"}</td>
                    <td>
                      <div className="el-actions">
                        <button className="el-btn el-btn--view" title="View">
                          <FaEye />
                        </button>
                        <button className="el-btn el-btn--edit" title="Edit">
                          <FaEdit />
                        </button>
                        <button
                          className="el-btn el-btn--delete"
                          title="Delete"
                          onClick={() => handleDelete(event.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
