import React, { useEffect, useState } from "react";
import "./EventReviews.css";

export default function EventReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/event-reviews/`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load event reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/event-reviews/${id}/`, {
        method: "DELETE"
      });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
      } else {
        alert("Failed to delete review");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  if (loading) return <div className="admin-p-body">Loading...</div>;
  if (error) return <div className="admin-p-body text-red-500">{error}</div>;

  return (
    <div className="admin-p-body">
      <div className="admin-p-header">
        <h2>Event Reviews Management</h2>
      </div>

      <div className="admin-table-container">
        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>User ID</th>
                <th>Name (from Form)</th>
                <th>Rating</th>
                <th>Review Text</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.event_title}</td>
                  <td>{r.user_id ? <span style={{fontSize:"12px", color:"#6b7280"}}>{r.user_id}</span> : "Guest"}</td>
                  <td>{r.name}</td>
                  <td style={{ color: "#fbbf24", letterSpacing: "1px" }}>{"★".repeat(r.rating)}</td>
                  <td style={{ maxWidth: "300px" }}>{r.text}</td>
                  <td>{new Date(r.created_at).toLocaleDateString("en-IN")}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(r.id)}
                      style={{ background: "#ef4444", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
