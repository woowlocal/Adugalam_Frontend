import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Footer.css";
import { FaFacebook, FaTwitter, FaHome } from "react-icons/fa";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const hideBackToTopRoutes = [
    "/login",
    "/signup",
    "/VendorLogin",
    "/VendorSignup",
    "/AdminLogin",
    "/forgot-password",
    "/admin-forgot-password",
    "/profile",
  ];
  const showBackToTop = !hideBackToTopRoutes.includes(location.pathname);

  return (
    <footer className="footer">
      <div className="main-container">


        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-brand">
            <img src="/Adugalam_Logo (1).png" alt="logo image" />
            <p>©2025 All rights.Intellect Communication Services.</p>
            <p>
              <span onClick={() => navigate('/Terms')} style={{ cursor: 'pointer' }}>Terms of Service</span> |
              <span onClick={() => navigate('/Privacy')} style={{ cursor: 'pointer' }}> Privacy Policy</span>
            </p>
          </div>

          <div className="footer-links">
            <div>
              <h4>Features</h4>
              <p onClick={() => navigate('/Bookhome')}>Book </p>
              <p onClick={() => navigate('/play')}>Play</p>
              <p onClick={() => navigate('/partner')}>List Your Venue</p>
              <p onClick={() => navigate('/train')}>Train Yourself</p>
              <p onClick={() => navigate('/contact')}>Request access</p>

            </div>

            <div>
              <h4>About us</h4>
              <p onClick={() => navigate('/about')}>Who We are</p>
              <p onClick={() => navigate('/about')}>What We do</p>
              <p onClick={() => navigate('/')}>Features</p>
              <p onClick={() => navigate('/')}>Careers</p>
              <p onClick={() => navigate('/contact')}>Contact us</p>
            </div>

            <div>
              <h4>Resources</h4>
              <p onClick={() => navigate('/contact')}>Help center</p>
              <p onClick={() => navigate('/ClubPolicy')}>Refund</p>
              <p onClick={() => navigate('/ClubPolicy')}>Cancellation</p>
              <p onClick={() => navigate('/')}>Blog</p>
            </div>

            <div>
              <h4>Get in touch</h4>
              <p onClick={() => navigate('/contact')}>Questions or feedback?</p>


              <div className="social-icons">
                <FaFacebook size={30} color="blue" />
                <FaTwitter size={30} color="skyblue" />
                <FaHome size={30} color="green" />
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        {showBackToTop && (
          <button
            className={`back-to-top-button ${isVisible ? "visible" : ""}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <svg className="svgIcon" viewBox="0 0 384 512">
              <path
                d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;