import React, { useRef, useState } from "react";
import "./Categories.css";
import { useNavigate } from "react-router-dom";

const Categories = ({ selectedSport, onSelectSport }) => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const categories = [
    { id: 1, name: "Football",   icon: "/Football.png" },
    { id: 2, name: "Tennis",     icon: "/Tennis.png" },
    { id: 3, name: "Swimming",   icon: "/Swimming.png" },
    { id: 4, name: "Volleyball", icon: "/VolleyBall.png" },
    { id: 5, name: "Cricket",    icon: "/cricket.png" },
    { id: 6, name: "Badminton",  icon: "/Badminton.png" },
  ];

  // Duplicate so the carousel loops seamlessly
  const looped = [...categories, ...categories];

  const handleSelect = (sport) => {
    if (selectedSport === sport) {
      onSelectSport(null);
    } else {
      onSelectSport(sport);
    }
  };

  return (
    <div className="gc-wrapper">

      {/* ── Glacier background blobs ── */}
      <div className="gc-blob gc-blob--1" aria-hidden="true" />
      <div className="gc-blob gc-blob--2" aria-hidden="true" />
      <div className="gc-blob gc-blob--3" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="gc-header">
        <h3 className="gc-title">Categories</h3>
        <button className="gc-view-all" onClick={() => navigate("/allcategories")}>
          View all →
        </button>
      </div>

      {/* ── Sliding track ── */}
      <div
        className="gc-track-outer"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {/* ── Fade edges ── */}
        <div className="gc-fade gc-fade--left"  aria-hidden="true" />
        <div className="gc-fade gc-fade--right" aria-hidden="true" />

        <div
          ref={trackRef}
          className={`gc-track ${paused ? "gc-track--paused" : ""}`}
        >
          {looped.map((cat, idx) => {
            const isActive = selectedSport === cat.name;
            return (
              <div
                key={`${cat.id}-${idx}`}
                className={`gc-card ${isActive ? "gc-card--active" : ""}`}
                onClick={() => handleSelect(cat.name)}
                aria-label={cat.name}
              >
                {/* Icon circle */}
                <div className="gc-icon-ring">
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="gc-icon"
                    draggable="false"
                  />
                  {/* Glow halo */}
                  <div className="gc-icon-glow" aria-hidden="true" />
                </div>

                <p className="gc-label">{cat.name}</p>

                {/* Active indicator */}
                {isActive && <span className="gc-active-dot" />}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Categories;