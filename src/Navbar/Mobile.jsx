import React, { useState } from "react";
import "./Mobile.css";

import {
  FaHome,
  FaHistory,
  FaCog,
} from "react-icons/fa";
import { RiTranslate } from "react-icons/ri";
import { MdSwapHoriz } from "react-icons/md";

const Mobile = () => {
  const [active, setActive] = useState("home");

  return (
    <div className="mobile-nav">
      <div
        className={`nav-item ${active === "translate" ? "active" : ""}`}
        onClick={() => setActive("translate")}
      >
        <RiTranslate />
      </div>

      <div
        className={`nav-item ${active === "swap" ? "active" : ""}`}
        onClick={() => setActive("swap")}
      >
        <MdSwapHoriz />
      </div>

      <div
        className={`nav-item ${active === "home" ? "active" : ""}`}
        onClick={() => setActive("home")}
      >
        <FaHome />
      </div>

      <div
        className={`nav-item ${active === "history" ? "active" : ""}`}
        onClick={() => setActive("history")}
      >
        <FaHistory />
      </div>

      <div
        className={`nav-item ${active === "settings" ? "active" : ""}`}
        onClick={() => setActive("settings")}
      >
        <FaCog />
      </div>
    </div>
  );
};

export default Mobile;
