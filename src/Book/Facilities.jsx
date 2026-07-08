import React from "react";
import "./Facilities.css";

const cleanArray = (data) => {
  if (!data) return [];

  let value = data;

  // If stringified JSON, parse repeatedly
  while (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      break;
    }
  }

  // If already array
  if (Array.isArray(value)) {
    return value
      .flatMap(item =>
        String(item)
          .replace(/["\[\]]/g, "")
          .split(",")
          .map(v => v.trim())
      )
      .filter(Boolean);
  }

  return String(value)
    .replace(/["\[\]]/g, "")
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);
};

const GroundFacilities = ({ turf }) => {
  if (!turf) return null;

  const facilities = cleanArray(turf.amenities);
  const features = cleanArray(turf.features);
  const games = cleanArray(turf.games);

  const getImageUrl = (img) => {
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}${img}`;
  };

  return (
    <div className="gf-wrapper">

      {/* Ground list */}
      <div className="gf-section">
        <h3 className="gp-section-title1">Ground List</h3>

        <div className="gf-card-row">
          <div className="gf-ground-card">
            <img
              src={getImageUrl(turf.banner_images?.[0])}
              alt={turf.name}
              className="gf-ground-img"
            />
            <div className="gf-ground-text">
              <span className="gf-ground-name" style={{ lineHeight: 1.2 }}>{turf.name}</span>
              <span className="gf-ground-min" style={{ color: '#0a7d34', fontSize: '13px' }}>
                ₹{turf.price_per_hour || 0} / hr
              </span>
              {games.length > 0 && (
                <span style={{ fontSize: '11px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {/* <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> */}
                  {games.join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Facilities */}
      {facilities.length > 0 && (
        <div className="gf-section">
          <h3 className="gp-section-title2">Facilities</h3>

          <div className="gf-chip-row">
            {facilities.map((f, index) => (
              <div className="gf-chip" key={index}>
                <span className="gf-chip-label">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className="gf-section">
          <h3 className="gp-section-title3">Our Popular Features</h3>

          <div className="gf-chip-row">
            {features.map((f, index) => (
              <div className="gf-chip" key={index}>
                <span className="gf-chip-label">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default GroundFacilities;