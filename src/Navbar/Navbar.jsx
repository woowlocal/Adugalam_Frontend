import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiArrowLeft } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import {
  FaHome,
  FaPlay,
  FaCalendarCheck,
  FaDumbbell,
  FaShoppingBag,
  FaTrophy,
  FaCalendarAlt,
  FaInfoCircle,
  FaEnvelope,
  FaHandshake,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa";
import "./Navbar.css";
import Logout from "../Components/Profile/Logout";
import { CiLocationOn } from "react-icons/ci";
import adugalamLogo from "../assets/Adugalam_English.jpg";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [locationName, setLocationName] = useState("Select City");
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);
  const [sidebarPartnerOpen, setSidebarPartnerOpen] = useState(false);
  const partnerDropdownRef = useRef(null);

  const handleInstallClick = async (e) => {
    e.preventDefault();
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      window.deferredPrompt = null;
    } else {
      alert("App is already installed or your browser doesn't support installation from this button. You may install from the browser menu.");
    }
  };

  // Show both words if two-word name; only first word if three+ words
  const words = userName.trim().split(/\s+/);
  const displayName = words.length > 2 ? words[0] : userName.trim();

  /* ================= AUTH SYNC ================= */
  useEffect(() => {
    const syncAuth = async () => {
      const accessToken = localStorage.getItem("access");
      let hasAuth = false;

      if (accessToken) {
        // Check if token is valid by trying to decode it
        try {
          const tokenParts = accessToken.split('.');
          if (tokenParts.length === 3) {
            const base64Url = tokenParts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join('')
            );
            const payload = JSON.parse(jsonPayload);
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (payload.exp && payload.exp < currentTime) {
              // Token is expired, try to refresh
              const refreshToken = localStorage.getItem("refresh");
              if (refreshToken) {
                try {
                  const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/token/refresh/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: refreshToken }),
                  });
                  const data = await res.json();
                  if (data.access) {
                    localStorage.setItem("access", data.access);
                    hasAuth = true;
                  } else {
                    // Refresh failed, clear tokens
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                  }
                } catch (e) {
                  localStorage.removeItem("access");
                  localStorage.removeItem("refresh");
                }
              } else {
                localStorage.removeItem("access");
              }
            } else {
              // Token is valid
              hasAuth = true;
            }
          } else {
            // Invalid token format, clear
            localStorage.removeItem("access");
          }
        } catch (e) {
          localStorage.removeItem("access");
        }
      }

      console.log("Navbar: Auth check -", hasAuth ? "Logged in" : "Logged out");
      setIsAuth(hasAuth);
      if (hasAuth) {
        setUserName(localStorage.getItem("userName") || "");
      } else {
        setUserName("");
      }
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  /* ================= LOCATION SYNC ================= */
  useEffect(() => {
    const syncLocation = () => {
      const savedLocation = localStorage.getItem("locationName");
      if (savedLocation) {
        setLocationName(savedLocation);
      }
    };

    syncLocation();
    window.addEventListener("locationChange", syncLocation);

    return () => {
      window.removeEventListener("locationChange", syncLocation);
    };
  }, []);

  const closeSidebar = () => {
    setOpen(false);
    setSidebarPartnerOpen(false);
  };

  // Close partner dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (partnerDropdownRef.current && !partnerDropdownRef.current.contains(e.target)) {
        setPartnerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoginPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className={`navbar ${isLoginPage ? "fixed-navbar" : ""}`}>
        <div className="navbar-container">

          {/* MENU */}
          <button className="menu-toggle" onClick={() => setOpen(true)}>
            <FiMenu size={22} />
          </button>

          {/* LOGO */}
          <NavLink to="/" className="navbar-logo">
            <img src={adugalamLogo} alt="Adugalam" className="navbar-logo-img" />
          </NavLink>

          {/* LOCATION (DYNAMIC) */}
          <NavLink to="/location" className="loca">
            <CiLocationOn />
            {locationName}
          </NavLink>

          {/* MOBILE PROFILE */}
          <div className="mobile-profile-right">
            {isAuth ? (
              <NavLink to="/profile" className="mobile-profile">
                <CgProfile size={27} />
              </NavLink>
            ) : (
              location.pathname !== "/login" && (
                <NavLink to="/login" className="btn-primary mobile-login-btn">
                  Login
                </NavLink>
              )
            )}
          </div>

          {/* DESKTOP MENU */}
          <nav className="navbar-menu">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/play">Play</NavLink>
            <NavLink to="/Bookhome">Book</NavLink>
            <NavLink to="/train">Train</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/tournaments">Tournaments</NavLink>
            <NavLink to="/events">Events</NavLink>
            {/* <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink> */}
            <NavLink to="/mybooking">My Booking</NavLink>
          </nav>

          {/* ACTIONS */}
          <div className="navbar-actions">
            <button onClick={handleInstallClick} className="btn-outline download-app-btn">
              Download App
            </button>

            {/* Partner With Us Dropdown */}
            <div
              className={`partner-dropdown-wrapper${partnerDropdownOpen ? " open" : ""}`}
              ref={partnerDropdownRef}
            >
              <button
                className="btn-primary partner-btn"
                onClick={() => setPartnerDropdownOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={partnerDropdownOpen}
              >
                Partner With Us
                <FaChevronDown className={`partner-chevron${partnerDropdownOpen ? " rotated" : ""}`} />
              </button>
              <div className="partner-dropdown-menu">
                <NavLink to="/partner" className="partner-dropdown-item" onClick={() => setPartnerDropdownOpen(false)}>
                  <FaUserPlus className="partner-dropdown-icon" />
                  Register Your Partnership
                </NavLink>
                <NavLink to="/AdminLogin" className="partner-dropdown-item" onClick={() => setPartnerDropdownOpen(false)}>
                  <FaSignInAlt className="partner-dropdown-icon" />
                  Login As Partner
                </NavLink>
              </div>
            </div>

            {!isAuth ? (
              <NavLink to="/login" className="btn-primary">
                Login
              </NavLink>
            ) : (
              <NavLink to="/profile" className="profile-icon user-profile-box">
                <CgProfile size={28} />
                {displayName && <span className="navbar-username">{displayName}</span>}
              </NavLink>
            )}
          </div>
        </div>

        <div className="navbar-shadow" />
      </header>

      {/* ================= SIDEBAR ================= */}
      {open && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <aside className={`mobile-sidebar ${open ? "open" : ""}`}>

        {/* Header */}
        <div className="sidebar-header">
          <span className="sidebar-logo">
            <img src={adugalamLogo} alt="Adugalam" className="sidebar-logo-img" />
          </span>
          <button className="sidebar-close" onClick={closeSidebar}>
            <FiArrowLeft size={22} />X
          </button>
        </div>

        {/* User greeting — shown only when logged in */}
        {isAuth && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              <FaUser />
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{displayName || "My Account"}</span>
              <NavLink to="/MyProfile" onClick={closeSidebar}> <span className="sidebar-user-sub" >View Profile</span>  </NavLink>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="sidebar-links">
          <NavLink to="/" end onClick={closeSidebar}>
            <FaHome className="sidebar-link-icon" /> Home
          </NavLink>
          <NavLink to="/play" onClick={closeSidebar}>
            <FaPlay className="sidebar-link-icon" /> Play
          </NavLink>
          <NavLink to="/Bookhome" onClick={closeSidebar}>
            <FaCalendarCheck className="sidebar-link-icon" /> Book
          </NavLink>
          <NavLink to="/train" onClick={closeSidebar}>
            <FaDumbbell className="sidebar-link-icon" /> Train
          </NavLink>
          <NavLink to="/shop" onClick={closeSidebar}>
            <FaShoppingBag className="sidebar-link-icon" /> Shop
          </NavLink>
          <NavLink to="/tournaments" onClick={closeSidebar}>
            <FaTrophy className="sidebar-link-icon" /> Tournaments
          </NavLink>
          <NavLink to="/events" onClick={closeSidebar}>
            <FaCalendarAlt className="sidebar-link-icon" /> Events
          </NavLink>
          <NavLink to="/about" onClick={closeSidebar}>
            <FaInfoCircle className="sidebar-link-icon" /> About
          </NavLink>
          <NavLink to="/contact" onClick={closeSidebar}>
            <FaEnvelope className="sidebar-link-icon" /> Contact
          </NavLink>
          {/* Partner With Us accordion in sidebar */}
          <div className="sidebar-partner-accordion">
            <button
              className={`sidebar-partner-toggle${sidebarPartnerOpen ? " active" : ""}`}
              onClick={() => setSidebarPartnerOpen((v) => !v)}
            >
              <FaHandshake className="sidebar-link-icon" />
              <span>Partner With Us</span>
              <FaChevronDown className={`sidebar-partner-chevron${sidebarPartnerOpen ? " rotated" : ""}`} />
            </button>
            <div className={`sidebar-partner-submenu${sidebarPartnerOpen ? " open" : ""}`}>
              <NavLink to="/partner" className="sidebar-partner-sublink" onClick={closeSidebar}>
                <FaUserPlus className="sidebar-link-icon" /> Register Your Partnership
              </NavLink>
              <NavLink to="/AdminLogin" className="sidebar-partner-sublink" onClick={closeSidebar}>
                <FaSignInAlt className="sidebar-link-icon" /> Login As Partner
              </NavLink>
            </div>
          </div>
          {isAuth && (
            <NavLink to="/profile" onClick={closeSidebar}>
              <FaUser className="sidebar-link-icon" /> Profile
            </NavLink>
          )}
        </nav>

        {/* Bottom actions */}
        <div className="sidebar-bottom">
          {!isAuth ? (
            <NavLink to="/login" onClick={closeSidebar} className="sidebar-login">
              Login
            </NavLink>
          ) : (
            <button className="sidebar-logout-btn" onClick={() => {
              setLogoutPopupOpen(true);
              closeSidebar();
            }}>
              <FaSignOutAlt className="sidebar-link-icon" /> Log out
            </button>
          )}
        </div>

      </aside>

      {/* LOGOUT POPUP */}
      {logoutPopupOpen && <Logout setOpen={setLogoutPopupOpen} />}
    </>
  );
};

export default Navbar;
