import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import "./Banner.css";

export default function Banner() {
  const navigate = useNavigate();
  const location = useLocation();

  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  const startX = useRef(0);
  const transitionTimer = useRef(null);

  const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "") + "/api";

  useEffect(() => {
    fetchBanners();
    return () => clearTimeout(transitionTimer.current);
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${API_BASE}/banners/`);
      if (response.data && response.data.length > 0) {
        const visibleBanners = response.data
          .filter((b) => b.is_active && (b.category === "all" || b.category === location.pathname))
          .sort((a, b) => a.priority - b.priority);
        setSlides(visibleBanners.length > 0 ? visibleBanners : getDefaultSlides());
      } else {
        setSlides(getDefaultSlides());
      }
    } catch {
      setSlides(getDefaultSlides());
    }
    setLoading(false);
  };

  const getDefaultSlides = () => [
    {
      title: "Quick Ground Booking!",
      text: "Browse, book, and enjoy fun moments.",
      button_text: "Book Now",
      image: "/banner4.jpg",
      link_path: "/Bookhome",
    },
    {
      title: "Sports Event Booking!",
      text: "Find and book your favourite events.",
      button_text: "Explore Events",
      image: "/banner2.jpg",
      link_path: "/shop",
    },
    {
      title: "Tournament Registration!",
      text: "Join and participate in tournaments.",
      button_text: "Partner With Us",
      image: "/banner1.jpg",
      link_path: "/partner",
    },
  ];

  // ─── Transition helper ─────────────────────────────────────────────────────
  const goTo = (newIndex) => {
    if (transitioning || slides.length <= 1) return;
    setPrevIndex(index);
    setIndex(newIndex);
    setTransitioning(true);
    clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => {
      setPrevIndex(null);
      setTransitioning(false);
    }, 950); // slightly longer than CSS animation
  };

  const nextSlide = () => goTo((index + 1) % slides.length);
  const prevSlide = () => goTo((index - 1 + slides.length) % slides.length);

  // ─── Auto-advance ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [slides, index, transitioning]); // eslint-disable-line

  // ─── Drag / swipe ─────────────────────────────────────────────────────────
  const handleMouseDown = (e) => { startX.current = e.clientX; };
  const handleMouseUp = (e) => {
    const diff = startX.current - e.clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  };
  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  };

  if (loading || slides.length === 0) {
    return <div className="banner-wrapper banner-skeleton" />;
  }

  return (
    <div className="banner-wrapper">
      {/* ── Ambient ice particles ── */}
      <div className="banner-particles" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <span key={i} className={`bp bp--${i}`} />
        ))}
      </div>

      <div
        className="banner"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Outgoing slide ── */}
        {prevIndex !== null && (
          <div
            key={`exit-${prevIndex}`}
            className="banner-slide banner-slide--exit"
            style={{ backgroundImage: `url(${slides[prevIndex].image})` }}
          />
        )}

        {/* ── Incoming / active slide ── */}
        <div
          key={`enter-${index}`}
          className={`banner-slide ${transitioning ? "banner-slide--enter" : "banner-slide--visible"}`}
          style={{ backgroundImage: `url(${slides[index].image})` }}
        >
          {/* Glacier sweep overlay — plays only during transition */}
          {transitioning && (
            <div className="glacier-sweep" aria-hidden="true" />
          )}

          {/* Content */}
          <div className="banner-overlay">
            <div className="banner-content">
              <h2>{slides[index].title}</h2>
              <p>{slides[index].text}</p>
              <button
                className="banner-glacier-btn"
                onClick={() => navigate(slides[index].link_path)}
              >
                {slides[index].button_text}
                <svg className="btn-arrow" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 8h14M9 2l6 6-6 6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      {slides.length > 1 && (
        <>
          <button className="banner-nav banner-nav--prev" onClick={prevSlide} aria-label="Previous">
            <SlArrowLeft />
          </button>

          <button className="banner-nav banner-nav--next" onClick={nextSlide} aria-label="Next">
            <SlArrowRight />
          </button>
        </>
      )}

      {/* ── Dots ── */}
      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot ${index === i ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}