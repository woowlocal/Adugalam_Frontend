import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [today, setToday] = useState({});
  const [chartData, setChartData] = useState([]);


  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "https://api.adugalam.com";
      const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;

      const token = localStorage.getItem("access");

      const res = await fetch(
        `${baseUrl}/api/admin/dashboard/`,
        {
          headers: token ? {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          } : {
            "Content-Type": "application/json",
          }
        }
      );

      if (!res.ok) {
        console.error("Dashboard fetch failed:", res.status);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
        setToday(data.today);
        setChartData(data.weekly);
      } else {
        console.error("Dashboard error:", data.error);
      }
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    }
  };



  const data = {
    labels: chartData.map((d) => d.day),
    datasets: [
      {
        label: "Bookings",
        data: chartData.map((d) => d.bookings),
        backgroundColor: "#22c55e",
        barThickness: 14,
      },
      {
        label: "Revenue (₹)",
        data: chartData.map((d) => d.revenue),
        backgroundColor: "#14532d",
        barThickness: 14,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
      x: { grid: { display: false } },
    },
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <main className="main">
      <header className="header">
        <h1>Adugalam – Admin Dashboard</h1>
        <p>Complete control over turfs, bookings, vendors & users</p>
      </header>


      <section className="stats-cards">
        <div className="stat-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0 }}>Total Users</h4>
          <p style={{ margin: 0 }}>{stats.users || 0}</p>
        </div>
        <div className="stat-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0 }}>Total Vendors</h4>
          <p style={{ margin: 0 }}>{stats.vendors || 0}</p>
        </div>
        <div className="stat-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0 }}>Total Turfs</h4>
          <p style={{ margin: 0 }}>{stats.turfs || 0}</p>
        </div>
        <div className="stat-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0 }}>Total Bookings</h4>
          <p style={{ margin: 0 }}>{stats.bookings || 0}</p>
        </div>
      </section>


      <section className="today">
        <h2>Today’s Overview</h2>
        <div className="today-box">
          <div className="today-card">Bookings <span>{today.bookings}</span></div>
          <div className="today-card">Revenue <span>₹{today.revenue}</span></div>
          <div className="today-card">New Users <span>{today.users}</span></div>
          <div className="today-card">New Vendors <span>{today.vendors}</span></div>
        </div>
      </section>


      <section className="analytics">
        <h2>Booking & Revenue Comparison</h2>
        <div className="chart-wrapper">
          <Bar data={data} options={options} />
        </div>
      </section>

      <footer className="footer">
        © 2025 Adugalam Turf Booking Platform
      </footer>
    </main>
  );
}