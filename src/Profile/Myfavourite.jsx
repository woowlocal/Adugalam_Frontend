import React, { useEffect, useState } from "react";
import "./Myfavourite.css";
import { useNavigate } from "react-router-dom";
import { buildTurfBookUrl } from "../utils/turfSlug";
import { FaArrowLeft, FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { VscChevronLeft } from "react-icons/vsc";
import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

const Myfavourite = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/favorites/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Fetch favorites error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const unfavorite = async (id, turfId) => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      await axios.post(`${API_BASE}/api/favorites/toggle/${turfId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from state instantly
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } catch (err) {
      console.error("Unfavorite error:", err);
    }
  };

  const getImageUrl = (turf) => {
    if (!turf) return "";
    const imgPath = turf.image || (turf.banners && turf.banners[0] && turf.banners[0].image);
    if (!imgPath) return "https://images.unsplash.com/photo-1521412644187-c49fa049e84d";
    if (imgPath.startsWith("http")) return imgPath;
    return `${API_BASE}${imgPath}`;
  };

  return (
    <div className="fav-page">
      {/* Header */}
      <div className="fav-header">
        <button className="animated-back-btn" data-text="Back" onClick={() => navigate(-1)}>
          <VscChevronLeft className="animated-back-icon" />
        </button>
        <h2>My Favourite</h2>
      </div>

      <div className="fav-container">
        {loading ? (
          <div className="fav-loading">Loading your wishlist...</div>
        ) : favorites.length === 0 ? (
          <div className="fav-empty">
            <div className="fav-empty-icon">❤️</div>
            <h3>Your Wishlist is Empty</h3>
            <p>Looks like you haven't added any turfs to your favorites yet.</p>
            <button onClick={() => navigate("/Bookhome")}>Explore Turfs</button>
          </div>
        ) : (
          <div className="fav-grid">
            {favorites.map((fav) => (
              <div
                className="fav-card"
                key={fav.id}
                onClick={() => navigate(buildTurfBookUrl(fav.turf))}
              >
                <div className="fav-card-image">
                  <img src={getImageUrl(fav.turf)} alt={fav.turf.name} />
                  <button
                    className="fav-heart-btn active"
                    onClick={(e) => {
                      e.stopPropagation();
                      unfavorite(fav.id, fav.turf.id);
                    }}
                  >
                    <FaHeart size={20} color="pink" />❤️
                  </button>
                </div>

                <div className="fav-card-content">
                  <div className="fav-card-header">
                    <span className="fav-turf-tag">
                      {fav.turf.games && fav.turf.games.length > 0 ? fav.turf.games[0].replace(/[\[\]"]/g, "") : "Sports"}
                    </span>
                    <span className="fav-turf-price">₹{fav.turf.price_per_hour}/hr</span>
                  </div>
                  <h3 className="fav-turf-name">{fav.turf.name}</h3>
                  <div className="fav-turf-location">
                    <FaLocationDot size={14} />
                    <span>{fav.turf.location}</span>
                  </div>
                  <button
                    className="fav-book-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(buildTurfBookUrl(fav.turf));
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Myfavourite;
