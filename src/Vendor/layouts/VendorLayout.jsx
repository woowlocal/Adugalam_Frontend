import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import VendorSidebar from "../VendorSidebar";
import "./vendorLayout.css";

const VendorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [vendorName, setVendorName] = useState(localStorage.getItem("vendor_name") || "Vendor");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dynamic vendor name
    fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendor/profile/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data.venuename) {
          setVendorName(data.venuename);
          localStorage.setItem("vendor_name", data.venuename); // update local storage cache
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile for VendorLayout", err);
      });
  }, []);

  const initial = vendorName.charAt(0).toUpperCase();

  // Shorten long names (first word only if 3+ words)
  const words = vendorName.trim().split(/\s+/);
  const displayName = words.length > 2 ? words[0] : vendorName.trim();

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  // Add scroll shadow enhancement
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="vendor-layout">
      {/* ─── TOP NAVBAR ─── */}
      <nav className={`vendor-navbar${scrolled ? " vendor-navbar--scrolled" : ""}`}>

        {/* ── Glow shimmer bar along the top edge ── */}
        <div className="vendor-navbar-top-glow" aria-hidden="true" />

        {/* ── LEFT ── */}
        <div className="vendor-navbar-left">
          {/* Hamburger (mobile only) */}
          <button
            className="vendor-hamburger-btn"
            onClick={openSidebar}
            aria-label="Open navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Brand */}
          <span className="vendor-navbar-brand">Adugalam</span>

          {/* Vendor badge (desktop only) */}
          <span className="vendor-role-badge">Vendor Panel</span>
        </div>

        {/* ── RIGHT ── */}
        <div className="vendor-navbar-right">
          {/* Notification bell */}
          <button className="vendor-notif-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>

          {/* Profile pill */}
          <div
            className="vendor-profile-pill"
            onClick={() => navigate("/VendorProfile")}
            role="button"
            tabIndex={0}
            aria-label={`View profile for ${vendorName}`}
            onKeyDown={(e) => e.key === "Enter" && navigate("/VendorProfile")}
          >
            <span className="vendor-username">{displayName}</span>
            <div className="vendor-avatar" title={vendorName}>{initial}</div>
          </div>
        </div>

        {/* ── Bottom shimmer line ── */}
        <div className="vendor-navbar-bottom-glow" aria-hidden="true" />
      </nav>

      {/* ─── OVERLAY (mobile) ─── */}
      <div
        className={`vendor-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />

      {/* ─── SIDEBAR ─── */}
      <VendorSidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* ─── MAIN CONTENT ─── */}
      <div className="vendor-content">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
