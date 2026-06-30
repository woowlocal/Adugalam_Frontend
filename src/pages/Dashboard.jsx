import { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            stats: [
              { title: "Total Turfs Owned", value: 5, icon: "🏠" },
              { title: "Today’s Bookings", value: 12, icon: "📅" },
              { title: "Upcoming Bookings", value: 25, icon: "🗓️" },
              { title: "Monthly Earnings", value: "$4500", icon: "💲" },
              { title: "Pending Approvals", value: 3, icon: "⏳" },
            ],
            coaches: [
              { name: "Naveen", status: "online" },
              { name: "Surya Smith", status: "online" },
              { name: "Saravanan", status: "offline" },
            ],
            reviews: [
              { user: "Ravi", text: "The turf is awesome 👍" },
              { user: "Arjun", text: "Ground quality is very good ⚽" },
              { user: "Karthik", text: "Easy booking and friendly staff 😊" },
              { user: "Manoj", text: "Best turf in the area ⭐" },
            ],
          });
        }, 500)
      );

      setData(response);
    };

    fetchDashboard();
  }, []);

  if (!data) return <p className="dashboard-loading">Loading...</p>;

  return (
    <div className="dashboard-page">
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <h2>♻ Dashboard Overview</h2>
          <p>Smart turf booking & sports management system</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {data.stats.map((item, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{item.icon}</div>
              <h3>{item.value}</h3>
              <p>{item.title}</p>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="bottom-grid">
          <div className="info-card">
            <div className="card-header">
              <span>👤</span>
              <h4>Coach Monitoring</h4>
            </div>

            <h3>{data.coaches.length}</h3>

            <ul>
              {data.coaches.map((coach, index) => (
                <li key={index}>
                  <span className={`status-dot ${coach.status}`}></span>
                  {coach.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="info-card">
            <div className="card-header">
              <span>💬</span>
              <h4>User Experience</h4>
            </div>

            {data.reviews.map((review, index) => (
              <p key={index}>
                <strong>{review.user}:</strong> {review.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
