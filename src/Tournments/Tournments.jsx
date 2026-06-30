import React from "react";
import "./Tournments.css";
import {
  FaTrophy,
  FaUsers,
  FaCalendarAlt,
  FaMedal,
  FaMapMarkerAlt,
} from "react-icons/fa";


import Banner from "../Components/Banner/Banner.jsx";

import { useState,useEffect } from "react";
import Run from "../Run.jsx";

export const Tournments = () => {


const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Run />;
  }


  return (
    <div className="tournament-page">
      <br></br>
      <br></br>
      <Banner/>

      {/* HERO */}
      <section className="tournament-hero">
        <h1>Find Sports Tournaments & Leagues in Tamil Nadu</h1>
        <p>
          Explore football, cricket, and badminton tournaments in Tirunelveli and across Tamil Nadu. Join upcoming competitions and compete with players near you
        </p>

        <div className="hero-buttons">
          <button className="btn">Browse Tournaments</button>
          <button className="btn outline">Register Your Team</button>
        </div>
      </section>

      {/* UPCOMING */}
      <section className="upcoming-section">
        <h2>Upcoming Sports Tournaments</h2>
        <p className="apples">Stay updated with upcoming sports tournaments and join competitions near you</p>

        <div className="tournament-grid">
          {[
            {
              sport: "Football",
              title: "Chennai Football League",
              date: "Jan 5–30, 2025",
              location: "Chennai",
              teams: "32 Teams",
              price: "₹5,00,000",
            },
            {
              sport: "Cricket",
              title: "Coimbatore Cricket Cup",
              date: "Feb 10–15, 2025",
              location: "Coimbatore",
              teams: "16 Teams",
              price: "₹3,00,000",
            },
            {
              sport: "Badminton",
              title: "TN Badminton Open",
              date: "Feb 20–25, 2025",
              location: "Madurai",
              teams: "64 Players",
              price: "₹1,50,000",
            },
          ].map((item, index) => (
            <div className="tournament-card advanced" key={index}>

              {/* Top row */}
              <div className="card-top">
                <span className="sport-pill">{item.sport}</span>
                <FaTrophy className="trophy-icon" />
              </div>

              <h3>{item.title}</h3>

              <ul className="card-meta">
                <li><FaCalendarAlt /> {item.date}</li>
                <li><FaMapMarkerAlt /> {item.location}</li>
                <li><FaUsers /> {item.teams}</li>
              </ul>

              <div className="divider"></div>

              <div className="prize">
                <span>Prize Pool</span>
                <strong>{item.price}</strong>
              </div>

              <button className="btn full">Register Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
       <h2 className="tournament-features-header6">Tournament Features & Benefits</h2>
       <p className="apples55">Join competitive tournaments, manage teams, and stay updated with real-time match schedules</p>
      <section className="tournament-features-section">
              <div className="tournament-features-grid">
          <div className="tournament-feature-card">
            <FaTrophy />
            <h4>Competitive Leagues</h4>
            <p>Join organized leagues for your favorite sport.</p>
          </div>

          <div className="tournament-feature-card">
            <FaUsers />
            <h4>Team Registration</h4>
            <p>Register your team easily and manage players.</p>
          </div>

          <div className="tournament-feature-card">
            <FaCalendarAlt />
            <h4>Live Scheduling</h4>
            <p>Real-time match updates and schedules.</p>
          </div>

          <div className="tournament-feature-card">
            <FaMedal />
            <h4>Prizes & Recognition</h4>
            <p>Win exciting prizes and get featured.</p>
          </div>
        </div>
      </section>

      

      

      {/* ORGANIZE */}
      <section className="organize-section">
        <h3 className="orgnaize-header">Organize Your Own Sports Tournament</h3>
        <p className="orgnaize-para">
         Organize football, cricket, badminton, or volleyball tournaments with easy venue booking, team registration, and live scoring tools
        </p>

        <button className="btn9">Become an Organizer</button>
      </section>

    </div>
  );
};