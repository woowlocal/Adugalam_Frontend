import React from "react";
import {
  FaUsers,
  FaChartLine,
  FaCalendarCheck,
  FaLock,
} from "react-icons/fa";
import "./PartnerSection.css";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <FaUsers />,
    title: "Reach More Customers",
    description: "Connect with thousands of players looking for venues",
  },
  {
    icon: <FaChartLine />,
    title: "Grow Your Revenue",
    description: "Maximize bookings with our platform and pricing tools",
  },
  {
    icon: <FaCalendarCheck />,
    title: "Easy Management",
    description: "Manage bookings, schedules, and pricing from one dashboard",
  },
  {
    icon: <FaLock />,
    title: "Secure Payments",
    description: "Get paid on time with our secure payment system",
  },
];

const PartnerSection = () => {



const navigate=useNavigate();

  return (
    <main className="partner-page">
      {/* Hero Section */}
      <section className="partner-hero">
        <h1>Partner with Adugalam</h1>
        <p>
          List your sports venue and reach thousands of active players.
          Grow your business with India’s leading venue booking platform.
        </p>
        <button className="btn-primary" onClick={()=>navigate("/partnerform")}>List Your Venue</button>
      </section>

      {/* Why Partner */}
      <section className="partner-features">
        <h2>Why Partner With Us?</h2>
        <p>Why Collaborate With Us?</p><br></br>

        <div className="features-grid">
          {features.map((item, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="partner-cta">
        <h2>Ready to Get Started?</h2>
        <p>
          Join hundreds of venue owners already growing their business with
          Adugalam
        </p>

        <div className="cta-buttons">
          <button className="btn-primaryprem" onClick={()=>navigate("/partnerform")}>List Your Venue</button>
          <button className="btn-outline">Partner Login</button>
        </div>
      </section>
    </main>
  );
};

export default PartnerSection;