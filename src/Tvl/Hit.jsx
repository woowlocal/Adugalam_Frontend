import React from "react";
import "./hit.css";
import heart from "../assets/heart.gif";

const Hit = ({ hitCount }) => {
  return (
    <div className="hit-wrapper">
      {/* LEFT SIDE */}
      <div className="hit-left">
        <p className="hit-hashtag">#iLoveAdugalam</p>

        <h1 className="hit-play">Play</h1>
        <p className="hit-like">like a Pro with</p>
        <h1 className="hit-brand">Adugalam</h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="hit-right">
        <p className="hit-text">Thank</p>

        <div className="hit-heart-row">
          <span className="hit-you">Y</span>
          <div className="hit-heart-container">
            <img src={heart} alt="heart" className="hit-heart animate-pulse-slow" />
            <div className="hit-count-bottom">{hitCount}</div>
          </div>
          <span className="hit-you">U</span>
        </div>

        <p className="hit-made">made with love from Adugalam</p>
      </div>
    </div>
  );
};

export default Hit;