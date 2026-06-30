import React, { useState } from "react";
import "./tvl.css";
import heart from "../assets/heart.gif";

const Tvl = ({ onHit, hitCount }) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <div className="tvl-wrapper">
      {/* LEFT */}
      <div className="tvl-left">
        <p className="hashtag">#iLoveAdugalam</p>
        <h1 className="Play1">Play</h1>
        <p className="like-pro">like a Pro with</p>
        <h1 className="adugalam">Adugalam</h1>
      </div>

      {/* RIGHT */}
      <div className="tvl-right">
        <p className="hit-me">Hit me!</p>
        <div 
          className={`heart-container ${isPressed ? 'heart-pressed' : ''}`}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onClick={onHit} 
          style={{ cursor: "pointer" }}
        >
          <img
            src={heart}
            alt="Heart"
            className="heart-img animate-pulse-slow"
          />
          <div className="hit-counter-badge">{hitCount}</div>
        </div>
      </div>
    </div>
  );
};

export default Tvl;