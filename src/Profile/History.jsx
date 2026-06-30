import React, { useEffect, useState } from "react";
import "./History.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { VscChevronLeft } from "react-icons/vsc";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "") + "/api/booking/my-bookings/";

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("access");

        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError("Failed to load history");
        } else {
          // ✅ ALL transactions (no filter)
          const list = Array.isArray(data) ? data : data.results || [];
          setHistory(list);
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading)
    return <h3 style={{ textAlign: "center" }}>Loading history...</h3>;

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h3>{error}</h3>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );

  return (
    <div className="history-page">

      {/* Header */}
      <div className="history-header">
        <button className="animated-back-btn" data-text="Back" onClick={() => navigate(-1)}>
          <VscChevronLeft className="animated-back-icon" />
        </button>
        <h2>History</h2>
      </div>

      {history.length === 0 ? (
        <p style={{ textAlign: "center" }}>No transactions found</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div className="history-card" key={item.booking_id}>

              <div className="history-info">

                <span className="history-id">
                  Booking ID: #{item.booking_id}
                </span>

                <h3>{item.turf_name}</h3>

                <p className="history-date">{item.date}</p>

                <p className="history-time">
                  {item.slots?.join(", ")}
                </p>

                <span
                  className="history-status"
                  style={{
                    background:
                      item.payment_status === "SUCCESS"
                        ? "#27ae60"
                        : item.payment_status === "FAILED"
                        ? "#e74c3c"
                        : "#f39c12",
                    color: "#fff",
                  }}
                >
                  {item.payment_status}
                </span>
              </div>

              <div className="history-price">
                ₹{item.total_price}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;