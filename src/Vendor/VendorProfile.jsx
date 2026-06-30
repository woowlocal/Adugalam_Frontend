import React, { useEffect, useState } from "react";
import "./VendorProfile.css";

const VendorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="vp-page-container">
      <div className="vp-card">
        {loading ? (
          <div className="vp-page-loading">Loading Profile Details...</div>
        ) : profile ? (
          <>
            <div className="vp-card-header">
              <div className="vp-avatar-large">
                {profile.venuename ? profile.venuename.charAt(0).toUpperCase() : "V"}
              </div>
              <h2>{profile.venuename}</h2>
              <span className="vp-role-badge">Vendor Account</span>
            </div>

            <div className="vp-card-body">
              <div className="vp-info-group">
                <label>Vendor ID</label>
                <p>{profile.vendor_id || "N/A"}</p>
              </div>
              <div className="vp-info-group">
                <label>Email Address</label>
                <p>{profile.email}</p>
              </div>
              <div className="vp-info-group">
                <label>Phone Number</label>
                <p>{profile.phone || "N/A"}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="vp-page-loading">Failed to load profile details.</div>
        )}
      </div>
    </div>
  );
};

export default VendorProfile;
