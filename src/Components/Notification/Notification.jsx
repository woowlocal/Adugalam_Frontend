import React, { useState, useEffect } from 'react';
import './Notification.css';
import API from '../../api/api';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setLoading(false); // Not logged in
    }
  }, []);

  useEffect(() => {
    if (!user || !user.email) return;

    const fetchNotifications = async () => {
      try {
        const trimmedEmail = user.email.trim();
        console.log(`Fetching notifications for: ${trimmedEmail}`);
        const response = await API.get(`api/notifications/?email=${encodeURIComponent(trimmedEmail)}`);
        console.log("Notifications received:", response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    // Refresh every 10 seconds while open
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="notification-popup">
      <div className="notification-header">
        <h4>Recent Notifications</h4>
      </div>
      <div className="notification-body">
        {loading ? (
          <div className="notification-empty">Loading...</div>
        ) : !user ? (
          <div className="notification-empty">Please log in to view notifications.</div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">No recent notifications.</div>
        ) : (
          notifications.map((item) => (
            <div key={item.id} className="notification-item">
              <div className="notification-icon">
                {item.type === 'booking' ? '🏟️' : '🔒'}
              </div>
              <div className="notification-content">
                {item.type === 'booking' ? (
                  <div className="notification-text">
                    <p>
                      Your booking is <span style={{
                        color: item.status === 'CONFIRMED' ? "green" : (item.status === 'PENDING' ? "orange" : "red"),
                        fontWeight: "bold"
                      }}>
                        {item.status || 'PENDING'}
                      </span>
                    </p>
                    <ul style={{ margin: "5px 0", paddingLeft: "20px", fontSize: "0.9em", color: "#555" }}>
                      <li><strong>Turf:</strong> {item.turf_name}</li>
                      {item.game_name && (
                        <li>
                          <strong>Game:</strong> {Array.isArray(item.game_name) ? item.game_name.join(', ') : (typeof item.game_name === 'string' ? item.game_name.replace(/[\[\]"']/g, '') : item.game_name)}
                        </li>
                      )}
                      <li><strong>Date:</strong> {item.date}</li>
                      {item.slots && item.slots.length > 0 && <li><strong>Time:</strong> {item.slots.join(', ')}</li>}
                    </ul>
                  </div>
                ) : (
                  <p className="notification-text">An OTP <span className="highlight-otp">{item.otp}</span> has been sent to <strong>{item.email}</strong></p>
                )}
                <span className="notification-time">{formatTimeAgo(item.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notification;