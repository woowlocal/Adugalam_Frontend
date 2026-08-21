import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { VscChevronLeft } from "react-icons/vsc";
import API from "../api/api";
import "./MyProfile.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    // 1. Initial fast load from localStorage
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) setUser(savedUser);
    } catch (e) { }

    // 2. Fetch fresh profile from backend
    const fetchProfile = async () => {
      try {
        const res = await API.get("api/user/profile/");
        if (res.data) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="myprofile-page">
      {/* Header */}
      <div className="myprofile-header">
        <button className="animated-back-btn" data-text="Back" onClick={() => navigate(-1)}>
          <VscChevronLeft className="animated-back-icon" />
        </button>
        <h3>My profile</h3>
        <button className="animated-edit-btn" onClick={() => navigate("/EditProfile")} title="Edit Profile">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a7c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </button>
      </div>

      {/* Details */}
      <div className="myprofile-box">
        {/* <label>First name</label>
        <div className="myprofile-field">{user.firstname}</div> */}

        {/* <label>Last name</label>
        <div className="myprofile-field">{user.lastname}</div> */}

        <label>Username</label>
        <div className="myprofile-field">{user.name || user.username || "N/A"}</div>

        <label>Email address</label>
        <div className="myprofile-field">{user.email || "N/A"}</div>

        <label>Phone number</label>
        <div className="myprofile-field">{user.mobile ? `+91 ${user.mobile}` : "N/A"}</div>
      </div>
    </div>
  );
};

export default MyProfile;
