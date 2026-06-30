import React, { useEffect, useState } from "react";
import "./PopularGround.css";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { buildTurfBookUrl } from "../../utils/turfSlug";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").trim().replace(/\/+$/, "");

const PopularGround = ({ selectedSport }) => {
  const navigate = useNavigate();

  const [turfs, setTurfs] = useState([]);
  const [viewAll, setViewAll] = useState(false);
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

  // Fetch popular turfs
  useEffect(() => {
    setLoading(true);
    const params = selectedSport ? { params: { game: selectedSport } } : {};

    axios
      .get(`${API_BASE}/api/turfs/popular-turfs/`, params)
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setTurfs(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedSport]);

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

  // Game badges parser — handles double-encoded JSON
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

  const renderGameBadges = (games, turf) => {
    const gamesArray = extractGames(games);
    if (gamesArray.length === 0) return null;

    return gamesArray.slice(0, 4).map((g, i) => (
      <span
        key={i}
        className="pg-game-tag1"
        title={g}
        onClick={(e) => {
          e.stopPropagation();
          navigate(buildTurfBookUrl(turf));
        }}
      >
        {g}
      </span>
    ));
  };

  // Skeleton card
  const SkeletonCard = () => (
    <div className="pg-skeleton1">
      <div className="pg-skeleton1-img" />
      <div className="pg-skeleton1-body">
        <div className="pg-skeleton1-line xlong" />
        <div className="pg-skeleton1-line long" />
        <div className="pg-skeleton1-line short" />
      </div>
    </div>
  );

  return (
    <div className="pg-wrapper">
      {/* ── Glacier background blobs ── */}
      <div className="pg-blob pg-blob--1" aria-hidden="true" />
      <div className="pg-blob pg-blob--2" aria-hidden="true" />
      <div className="pg-blob pg-blob--3" aria-hidden="true" />

      {/* Header */}
      <div className="pg-header1">
        <h3>Popular Grounds</h3>
        {turfs.length > 4 && (
          <button className="pg-view-all1" onClick={() => setViewAll(!viewAll)}>
            {viewAll ? "Show less" : "View all \u2192"}
          </button>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="pg-container1">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Cards */}
      {!loading && (
        <div className={`pg-container1 ${viewAll ? "grid-view1" : ""}`}>
          {displayedTurfs.map((turf) => (
            <div
              className="pg-card1"
              key={turf.id}
              onClick={() => navigate(buildTurfBookUrl(turf))}
            >
              <div className="pg-img-wrapper">
                <img
                  className="pg-img1"
                  src={getImageUrl(turf.banner_images?.[0])}
                  alt={turf.name}
                  onError={(e) => (e.target.src = "/no-image.png")}
                />
                {/* Heart favourite button */}
                <button
                  className={`pg-heart-btn ${favouriteIds.has(turf.id) ? "pg-heart-active" : ""}`}
                  onClick={(e) => toggleFavourite(e, turf.id)}
                  title={favouriteIds.has(turf.id) ? "Remove from favourites" : "Add to favourites"}
                  disabled={togglingId === turf.id}
                >
                  <svg className="empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none" d="M0 0H24V24H0z"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"></path></svg>
                  <svg className="filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M0 0H24V24H0z" fill="none"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path></svg>
                </button>
              </div>

              <h4>{turf.name}</h4>

              <div className="pg-loc1">
                <FaMapMarkerAlt size={12} />
                {shortLocation(turf.location)}
              </div>

              <div className="pg-games1">
                {renderGameBadges(turf.games, turf)}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && turfs.length === 0 && (
        <p className="pg-empty1">No grounds available.</p>
      )}
    </div>
  );
};

export default PopularGround;