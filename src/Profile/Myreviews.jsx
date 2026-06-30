import React, { useEffect, useState } from "react";
import "./Myreviews.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Myreviews = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = [
      // test panna venumna uncomment
      /*
      {
        id: "42798",
        title: "Summer sports carnival",
        date: "Nov 8, 2025",
        time: "03:00 pm - 06:00 pm",
        price: "$20.00",
        status: "Completed",
        image:
          "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      },
      */
    ];

    const completedBookings = data.filter(
      (item) => item.status === "Completed"
    );

    setHistory(completedBookings);
  }, []);

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h2>My reviews</h2>
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <div className="empty-icon">🕘</div>
          <h3>No reviews</h3>
          <p>Your reviews are empty, please add review to view</p>
          <button onClick={() => navigate("/")}>Go to home</button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div className="history-card" key={item.id}>
              <img src={item.image} alt={item.title} />

              <div className="history-info">
                <span className="history-id">
                  Booking ID: #{item.id}
                </span>
                <h3>{item.title}</h3>
                <p>{item.date}</p>
                <p>{item.time}</p>
                <span className="history-status">
                  {item.status}
                </span>
              </div>

              <div className="history-price">
                {item.price}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Myreviews;