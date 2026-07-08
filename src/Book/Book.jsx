import React, { useEffect, useState, useRef } from "react";
import "./Book.css";
import GroundFacilities from "./Facilities";
import Gallery from "./Gallery";
import { FaLocationDot, FaXmark } from "react-icons/fa6";
import { FaWhatsapp, FaTelegramPlane, FaInstagram, FaLink, FaHome, FaShareAlt } from "react-icons/fa";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

const GroundDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { turfSlug } = useParams();


  const turfIdFromSlug = turfSlug ? turfSlug.split("--").pop() : null;
  const turfId = turfIdFromSlug || location.state?.turf_id;

  const [turf, setTurf] = useState(null);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [loading, setLoading] = useState(true);


  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const startX = useRef(0);
  const transitionTimer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(transitionTimer.current);
  }, []);


  const [showShareModal, setShowShareModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);


  const [galleryZoomIndex, setGalleryZoomIndex] = useState(null);


  useEffect(() => {
    const checkFavorite = async () => {
      const token = localStorage.getItem("access");
      if (!token || !turfId) return;
      try {
        const res = await axios.get(`${API_BASE}/api/favorites/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const favorites = res.data;
        const isFav = favorites.some(fav => String(fav.turf.id) === String(turfId));
        setIsLiked(isFav);
      } catch (err) {
        console.error("Favorite check error:", err);
      }
    };
    checkFavorite();
  }, [turfId]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);


  useEffect(() => {
    if (!turfId) return;

    setLoading(true);

    axios
      .get(`${API_BASE}/api/turfs/`)
      .then((res) => {
        const turfs = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];

        const selectedTurf = turfs.find(
          (t) => String(t.id) === String(turfId)
        );

        setTurf(selectedTurf || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Turf fetch error:", err);
        setLoading(false);
      });
  }, [turfId]);


  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_BASE}${img}`;
  };


  const images = turf?.banner_images || [];


  const goTo = (newIndex) => {
    if (transitioning || images.length <= 1) return;
    setPrevIndex(currentIndex);
    setCurrentIndex(newIndex);
    setTransitioning(true);
    clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => {
      setPrevIndex(null);
      setTransitioning(false);
    }, 950); // slightly longer than CSS animation
  };

  const nextImage = () => goTo((currentIndex + 1) % (images.length || 1));
  const prevImage = () => goTo((currentIndex - 1 + (images.length || 1)) % (images.length || 1));

  // ─── Drag / swipe ─────────────────────────────────────────────────────────
  const handleMouseDown = (e) => { startX.current = e.clientX; };
  const handleMouseUp = (e) => {
    const diff = startX.current - e.clientX;
    if (diff > 50) nextImage();
    if (diff < -50) prevImage();
  };
  const handleTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextImage();
    if (diff < -50) prevImage();
  };

  const openMapNavigation = () => {
    if (!turf?.latitude || !turf?.longitude) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${turf.latitude},${turf.longitude}`;
    window.open(url, "_blank");
  };


  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
    setShowShareModal(false);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Checkout this turf: ${turf?.name} \n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    setShowShareModal(false);
  };

  const handleTelegramShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Checkout this turf: ${turf?.name}`);
    window.open(`https://telegram.me/share/url?url=${url}&text=${text}`, "_blank");
    setShowShareModal(false);
  };

  const handleInstagramShare = () => {
    handleCopyLink();
    alert("Link copied! You can now paste it into Instagram.");
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: turf?.name || "Share Turf",
          text: `Checkout this turf: ${turf?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  //  TOGGLE FAVORITE
  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    const previousState = isLiked;
    setIsLiked(!isLiked);

    try {
      await axios.post(`${API_BASE}/api/favorites/toggle/${turf.id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Toggle favorite error:", err);
      setIsLiked(previousState);
    }
  };

  //  LOADING
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!turf) return <p style={{ padding: 20 }}>Ground not found</p>;

  return (
    <div className="ground-pagee">

      {/* HEADER IS NOW HANDLED GLOBALLY IN App.jsx */}

      {/* IMAGE SLIDER */}
      <div className="gp-image-wrapperr gp-banner-wrapper" style={{ position: "relative" }}>

        {/* ── Ambient ice particles ── */}
        <div className="banner-particles" aria-hidden="true" style={{ zIndex: 3 }}>
          {[...Array(8)].map((_, i) => (
            <span key={i} className={`bp bp--${i}`} />
          ))}
        </div>

        <div
          className="gp-banner"
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
              style={{ backgroundImage: `url(${getImageUrl(images[prevIndex])})` }}
            />
          )}

          {/* ── Incoming / active slide ── */}
          <div
            key={`enter-${currentIndex}`}
            className={`banner-slide ${transitioning ? "banner-slide--enter" : "banner-slide--visible"}`}
            style={{ backgroundImage: `url(${getImageUrl(images[currentIndex])})`, cursor: "zoom-in" }}
            onClick={() => setGalleryZoomIndex(currentIndex)}
          >
            {/* Glacier sweep overlay — plays only during transition */}
            {transitioning && (
              <div className="glacier-sweep" aria-hidden="true" />
            )}
          </div>
        </div>

        {/* LEFT ARROW */}
        {images.length > 1 && (
          <button className="banner-nav banner-nav--prev" onClick={prevImage} aria-label="Previous">
            <SlArrowLeft />
          </button>
        )}

        {/* RIGHT ARROW */}
        {images.length > 1 && (
          <button className="banner-nav banner-nav--next" onClick={nextImage} aria-label="Next">
            <SlArrowRight />
          </button>
        )}


        <div className="gp-image-overlayy" style={{ zIndex: 6 }}>
          <span className="gp-image-counterr">
            {currentIndex + 1}/{images.length || 1}
          </span>

          <button
            className={`book-heart-btn ${isLiked ? "active" : ""}`}
            onClick={toggleFavorite}
          >
            <svg className="empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0H24V24H0z"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"></path></svg>
            <svg className="filled" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H24V24H0z" fill="none"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path></svg>
          </button>

          <button className="gp-share-btn" onClick={handleShareClick}>
            <FaShareAlt size={22} color="#1a365d" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="gp-contentt">

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="gp-tagg">
            {turf.games?.length
              ? turf.games[0].replace(/[\[\]"]/g, "")
              : "Ground"}
          </span>
          <div className="gp-price-light">
            <span className="price-amount">₹{turf.price_per_hour || 0}</span>
            <span className="price-unit">/ hr</span>
          </div>
        </div>

        <div
          className="gp-location-ratingg"
          style={{ marginTop: 24, cursor: "pointer" }}
          onClick={openMapNavigation}
        >
          <span className="gp-location-dott">
            <FaLocationDot size={18} />
          </span>

          <span className="gp-location-textt">
            {turf.location}
          </span>
        </div>

        <h2 className="gp-titlee">{turf.name}</h2>

        <div className="gp-sectionn">
          <h3 className="gp-section-titlee">Description</h3>
          <p className="gp-descriptionn">
            {turf.description ||
              "Best ground available for sports booking."}
          </p>
        </div>

      </div>

      <GroundFacilities turf={turf} />

      <Gallery
        images={turf.gallery_images || turf.banner_images || []}
        turfId={turf.id}
        zoomIndex={galleryZoomIndex}
        setZoomIndex={setGalleryZoomIndex}
      />

      <br />
      <br />

      {/* POLICY */}
      <label className="policy-item">
        <input
          type="checkbox"
          checked={agreePolicy}
          onChange={(e) => setAgreePolicy(e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <span
            className="policy-link"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/clubpolicy");
            }}
          >
            Turf Policy
          </span>
        </span>
      </label>

      {/* FOOTER */}
      <div className="gp-footerrr">
        <button
          className="gp-buy-btnnm"
          disabled={!agreePolicy}
          style={{ width: "100%" }}
          onClick={() =>
            navigate(turfSlug ? `/book/${turfSlug}/BookingGround` : "/BookingGround", { state: { turf_id: turf.id } })
          }
        >
          <span>Book Now</span>
        </button>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="share-overlay-gp" onClick={() => setShowShareModal(false)}>
          <div className="share-modal-gp" onClick={(e) => e.stopPropagation()}>
            <div className="share-drag-handle"></div>
            <div className="share-modal-header">
              <h3>Share Turf</h3>
              <button onClick={() => setShowShareModal(false)}><FaXmark size={24} /></button>
            </div>
            <div className="share-icons-container">
              <div className="share-option whatsapp" onClick={handleWhatsAppShare}>
                <div className="share-icon-circle"><FaWhatsapp size={28} color="white" /></div>
                <span>WhatsApp</span>
              </div>
              <div className="share-option telegram" onClick={handleTelegramShare}>
                <div className="share-icon-circle"><FaTelegramPlane size={28} color="white" /></div>
                <span>Telegram</span>
              </div>
              <div className="share-option instagram" onClick={handleInstagramShare}>
                <div className="share-icon-circle"><FaInstagram size={28} color="white" /></div>
                <span>Instagram</span>
              </div>
              <div className="share-option copy-link" onClick={handleCopyLink}>
                <div className="share-icon-circle"><FaLink size={28} color="white" /></div>
                <span>Copy Link</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroundDetails;