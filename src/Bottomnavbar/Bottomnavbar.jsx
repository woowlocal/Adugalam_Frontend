import React, { useEffect, useState } from "react";
import { GiBurningRoundShot } from "react-icons/gi";
import "./Bottomnavbar.css";
import {
  FaHome,
  FaCalendarAlt,
  FaShoppingCart,
  FaBookmark,
  FaUser,
} from "react-icons/fa";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { RiFontSize } from "react-icons/ri";

const Bottomnavbar = () => {


  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {

    const fetchBookings = async () => {
      const data = [
        {
          id: "42798",
          title: "Summer sports carnival",
          date: "Nov 8, 2025",
          time: "03:00 pm - 06:00 pm",
          price: "$20.00",
          status: "Completed",
          image:
            "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
        },
      ];
      setBookings(data);
    };

    fetchBookings();
  }, []);

  const validPaths = ["/", "/events", "/Bookhome", "/mybooking", "/profile"];
  const isIndicatorVisible = validPaths.includes(location.pathname);

  return (
    <div className="bottom-nav1">
      <div className="bottom-nav-inner">
        <NavLink to="/" end className="nav-item">
          <FaHome />
          <span className="nav-label">Home</span>
        </NavLink>

        <NavLink to="/events" className="nav-item">
          <FaCalendarAlt />
          <span className="nav-label">Events</span>
        </NavLink>

        <NavLink to="/Bookhome" className="nav-item">
          <GiBurningRoundShot size={30}  />
          <span className="nav-label">Grounds</span>
        </NavLink>

        <NavLink to="/mybooking" className="nav-item">
          <FaBookmark />
          <span className="nav-label">Booking</span>
        </NavLink>

        <NavLink to="/profile" className="nav-item">
          <FaUser />
          <span className="nav-label">Profile</span>
        </NavLink>

        {isIndicatorVisible && <div className="indicator"></div>}
      </div>
    </div>

  );
};

export default Bottomnavbar;