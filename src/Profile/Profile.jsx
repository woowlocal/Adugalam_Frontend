import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHistory,
  FaHeart,
  FaStar,
  FaInfoCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaBookmark,
} from "react-icons/fa";
import "./Profile.css";
import { useState } from "react";
import Logout from "../Components/Profile/Logout.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="profile-page">
      <h2 className="profile-title">Profile</h2>

      <div className="profile-list">
        {/* ✅ My Profile */}
        <div
          className="profile-item"
          onClick={() => navigate("/MyProfile")}
        >
          <FaUser />
          <span>My profile</span>
          <FaChevronRight />
        </div>

        <div className="profile-item" onClick={() => navigate("/profilehistory")}>
          <FaHistory />
          <span>History</span>
          <FaChevronRight />
        </div>

        <div className="profile-item" onClick={() => navigate("/myfavourite")}>
          <FaHeart />
          <span>My favourite</span>
          <FaChevronRight />
        </div>

        {/* Bookings */}
        <div className="profile-item" onClick={() => navigate("/mybooking")}>
          <FaBookmark />
          <span>My bookings</span>
          <FaChevronRight />
        </div>

        {/* <div className="profile-item" onClick={() => navigate("/myreviews")}>
          <FaStar />
          <span>My reviews</span>
          <FaChevronRight />
        </div> */}

        <div
          className="profile-item"
          onClick={() => navigate("/about")}
        >
          <FaInfoCircle />
          <span>About us</span>
          <FaChevronRight />
        </div>

        <div
          className="profile-item"
          onClick={() => navigate("/Settings")}
        >
          <FaCog />
          <span>Settings</span>
          <FaChevronRight />
        </div>

        <div className="profile-item logout" onClick={() => setShowLogout(true)}>
          <FaSignOutAlt />
          <span>Log out</span>
          <FaChevronRight />
        </div>
      </div>

      {showLogout && <Logout setOpen={setShowLogout} />}
    </div>
  );
};

export default Profile;

// 