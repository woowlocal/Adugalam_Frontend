import React, { useState, useEffect } from 'react';
import "./Newonadugalam.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { buildTurfBookUrl } from '../../utils/turfSlug';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").trim().replace(/\/+$/, "");

const Newonadugalam = () => {
  const navigate = useNavigate();
  const [viewAll, setViewAll] = useState(false);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [togglingId, setTogglingId] = useState(null);

  // Short Location
  const shortLocation = (loc) => {
    if (!loc) return "Location not available";
    return loc.split(",").slice(0, 2).join(", ");
  };

  // Image URL helper
  const getImageUrl = (img) => {
    if (!img) return "/no-image.png";
    let clean = img.replace(/^\/+/, "");
    if (clean.startsWith("media/")) clean = clean.replace("media/", "");
    return `${API_BASE}/media/${clean}`;
  };

  // Game parser — handles double-encoded JSON
  const extractGames = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val.flatMap(extractGames);
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed.startsWith("[")) {
        try { return extractGames(JSON.parse(trimmed)); } catch {}
      }
      return trimmed
        .replace(/[\[\]"'`]/g, "")
        .split(/[\/,&;]+/)
        .map((x) => x.trim())
        .filter((x) => x.length > 0);
    }
    return [];
  };

  // Fetch newest turfs (sorted by id desc = newest first)
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/turfs/`)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        // Sort by newest (highest id first)
        const sorted = [...data].sort((a, b) => b.id - a.id);
        setTurfs(sorted.slice(0, 8));
      })
      .catch((err) => console.error("NewOnAdugalam fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch user's existing favourites once on mount
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;
    axios
      .get(`${API_BASE}/api/favorites/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const ids = new Set(res.data.map((fav) => fav.turf?.id ?? fav.turf));
        setFavouriteIds(ids);
      })
      .catch(() => { });
  }, []);

  // Toggle favourite
  const toggleFavourite = async (e, turfId) => {
    e.stopPropagation();
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    if (togglingId === turfId) return; // prevent double-tap
    setTogglingId(turfId);
    try {
      await axios.post(
        `${API_BASE}/api/favorites/toggle/${turfId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavouriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(turfId)) next.delete(turfId);
        else next.add(turfId);
        return next;
      });
    } catch (err) {
      console.error("Favourite toggle error:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const displayedTurfs = viewAll ? turfs : turfs.slice(0, 8);

  return (
    <div className="na-section1">
      {/* ── Glacier background blobs ── */}
      <div className="gc-blob gc-blob--1" aria-hidden="true" />
      <div className="gc-blob gc-blob--2" aria-hidden="true" />
      <div className="gc-blob gc-blob--3" aria-hidden="true" />

      <div className="na-header1">
        <h3>New On Adugalam</h3>
        {turfs.length > 4 && (
          <span className="na-view-all1" onClick={() => setViewAll(!viewAll)}>
            {viewAll ? "Show less" : "View all"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="na-container1">
          {[1, 2, 3, 4].map((i) => (
            <div className="na-card1" key={i} style={{ opacity: 0.5 }}>
              <div className="na-img-wrapper" style={{ height: 150, background: "#eee", borderRadius: 12 }} />
              <h4 style={{ background: "#eee", height: 14, borderRadius: 4, width: "70%", margin: "10px 0 6px" }}>&nbsp;</h4>
            </div>
          ))}
        </div>
      )}

      {/* Cards */}
      {!loading && (
        <div className={`na-container1 ${viewAll ? "na-grid-view1" : ""}`}>
          {displayedTurfs.map((turf) => (
            <div
              className="na-card1"
              key={turf.id}
              onClick={() => navigate(buildTurfBookUrl(turf))}
            >
              <div className="na-img-wrapper">
                <img
                  src={getImageUrl(turf.banner_images?.[0])}
                  className="na-img1"
                  alt={turf.name}
                  onError={(e) => (e.target.src = "/no-image.png")}
                />
                {/* Heart favourite button */}
                <button
                  className={`na-heart-btn ${favouriteIds.has(turf.id) ? "na-heart-active" : ""}`}
                  onClick={(e) => toggleFavourite(e, turf.id)}
                  title={favouriteIds.has(turf.id) ? "Remove from favourites" : "Add to favourites"}
                  disabled={togglingId === turf.id}
                >
                  <svg className="empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none" d="M0 0H24V24H0z"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"></path></svg>
                  <svg className="filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M0 0H24V24H0z" fill="none"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path></svg>
                </button>
              </div>

              <h4>{turf.name}</h4>

              <div className="na-loc1">
                <FaMapMarkerAlt size={12} /> {shortLocation(turf.location)}
              </div>

              {/* Game tags */}
              {(() => {
                const games = extractGames(turf.games);
                if (games.length === 0) return null;
                return (
                  <div className="na-games">
                    {games.slice(0, 4).map((game, i) => (
                      <span key={i} className="na-game-tag">{game}</span>
                    ))}
                    {games.length > 4 && (
                      <span className="na-game-tag na-more">+{games.length - 4}</span>
                    )}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {!loading && turfs.length === 0 && (
        <p style={{ padding: "16px 20px", color: "#888" }}>No new turfs available.</p>
      )}
    </div>
  );
};

export default Newonadugalam;
