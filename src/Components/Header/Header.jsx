import React, { useEffect, useState, useRef } from "react";
import "./Header.css";
import { CiBellOn } from "react-icons/ci";
import { LuSettings2 } from "react-icons/lu";
import Notification from "../Notification/Notification";

const Header = () => {
  const [firstname, setFirstname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [greeting, setGreeting] = useState("Hello");
  const [showNotification, setShowNotification] = useState(false);
  const notificationRef = useRef(null);

  const updateName = () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const storedName = localStorage.getItem("userName");
    const token = localStorage.getItem("access");

    if (token) {
      setIsLoggedIn(true);
      if (savedUser && savedUser.name) {
        setFirstname(savedUser.name);
      } else if (savedUser && savedUser.firstname) {
        setFirstname(savedUser.firstname);
      } else if (storedName) {
        setFirstname(storedName);
      } else {
        setFirstname("User");
      }
    } else {
      setIsLoggedIn(false);
      setFirstname("");
    }
  };

  useEffect(() => {
    updateName();
    window.addEventListener("authChange", updateName);

    // Get greeting based on time
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning 🌤️");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon ☀️");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good evening 🌆");
    } else {
      setGreeting("Good night 🌙");
    }

    return () => window.removeEventListener("authChange", updateName);
  }, []);

  useEffect(() => {
    // Close notification if clicked outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header-container">
      <div className="header-top">
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          {isLoggedIn && <p>Hello, {firstname}</p>}
          <h2>{greeting}</h2>
        </div>

        <div className="notification-wrapper" ref={notificationRef} style={{ position: "relative" }}>
          <button
            type="button"
            className="bell-btn"
            aria-label="Notifications"
            onClick={() => setShowNotification((prev) => !prev)}
          >
            <CiBellOn size={28} color="#fff" />
          </button>
          {showNotification && <Notification />}
        </div>
      </div>

      {/*}<div className="search-area">
        <input type="text" placeholder="Search" />
        <button className="filter-btn">
          <LuSettings2 className="settingIcon" />
        </button>
      </div>{*/}
      <br></br>

    </div>
  );
};

export default Header;
