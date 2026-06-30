import React, { useState, useEffect } from "react";
import API from "../api/api";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiMessageSquare,
  FiHelpCircle,
} from "react-icons/fi";
import "./Contact.css";


import Run from "../Run.jsx";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "info", message: "Sending..." });
    try {
      await API.post("api/contact/submit/", form);
      setStatus({ type: "success", message: "Message sent successfully! We will get back to you soon." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      e.target.reset();
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Something went wrong. Please try again later." });
    }
  };



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
    <main className="contact">
      {/* HERO */}
      <header className="contact__hero">
        <h1>Get in Touch with Adugalam</h1>
        <p>
          Looking for help with online turf booking in Tirunelveli or Tamil Nadu? Contact us for support on cricket grounds, football turfs, pickleball courts, and tournament registration
        </p>
      </header>

      {/* INFO CARDS */}
      <section className="contact__info">
        <div className="info-card">
          <FiMail />
          <h4>Email Us</h4>
          <p>myadugalam@gmail.com</p>
          <span>We reply within 24 hours</span>
        </div>

        <div className="info-card">
          <FiPhone />
          <h4>Call Us</h4>
          <p>+91 9944533100</p>
          <span>Mon–Sat, 9am–6pm</span>
        </div>

        <div className="info-card">
          <FiMapPin />
          <h4>Visit Us</h4>
          <p>Tirunelveli, Tamil Nadu</p>
          <span>By appointment only</span>
        </div>

        <div className="info-card">
          <FiClock />
          <h4>Support Hours</h4>
          <p>9 AM – 9 PM IST</p>
          <span>7 days a week</span>
        </div>
      </section>

      {/* MAIN */}
      <section className="contact__content">
        {/* FORM */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>
            <FiMessageSquare /> Send us a Message
          </h3>

          {status.message && (
            <div style={{
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '5px',
              backgroundColor: status.type === 'success' ? '#dcfce7' : status.type === 'error' ? '#fee2e2' : '#f1f5f9',
              color: status.type === 'success' ? '#166534' : status.type === 'error' ? '#991b1b' : '#334155',
              border: `1px solid ${status.type === 'success' ? '#bbf7d0' : status.type === 'error' ? '#fecaca' : '#e2e8f0'}`,
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {status.message}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select Subject</option>
                <option value="booking">Booking Issue</option>
                <option value="payment">Payment / Refund</option>
                <option value="venue">Venue Partnership</option>
                <option value="account">Account Support</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              name="message"
              rows="4"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="form-submit">
            Send Message
          </button>
        </form>

        {/* FAQ */}
        <aside className="contact-faq">
          <div className="faq-box">
            <h4>
              <FiHelpCircle /> For Players
            </h4>
            <ul>
              <li>How do I book a sports venue online?</li>
              <li>What payment methods are accepted?</li>
              <li>How can I cancel or reschedule a booking?</li>
              <li>How do I find players near me?</li>
            </ul>
          </div>

          <div className="faq-box">
            <h4>
              <FiHelpCircle /> For Venue Partners
            </h4>
            <ul>
              <li>How do I list my venue?</li>
              <li>What are the commission rates?</li>
              <li>How do payouts work?</li>
              <li>What support do you provide?</li>
            </ul>
          </div>

          <div className="faq-urgent">
            <h4>Need Urgent Help?</h4>
            <p>Call us for quick help with online turf bookings and sports venue reservations</p>
            <strong>+91 9944533100</strong>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Contact;