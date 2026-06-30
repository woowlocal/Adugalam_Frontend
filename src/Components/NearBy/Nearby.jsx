import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Nearby.css";
import { FaLocationDot } from "react-icons/fa6";
import { buildTurfBookUrl } from "../../utils/turfSlug";
import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").trim().replace(/\/+$/, "");

const Nearby = ({ selectedSport }) => {
  const navigate = useNavigate();

  const [viewAll, setViewAll] = useState(false);
  const [allTurfs, setAllTurfs] = useState([]);
  const [nearbyGrounds, setNearbyGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [togglingId, setTogglingId] = useState(null);

  // Short Location
  const shortLocation = (loc) => {
    if (!loc) return "Location not available";
    return loc.split(",").slice(0, 2).join(", ");
  };

  // Get User Location
  useEffect(() => {
    const cityLat = localStorage.getItem("latitude");
    const cityLng = localStorage.getItem("longitude");

    if (cityLat && cityLng) {
      setUserLocation({ lat: parseFloat(cityLat), lng: parseFloat(cityLng) });
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, []);

  // Distance calculation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // Image helper
  const getImageUrl = (img) => {
    if (!img) return "/placeholder.jpg";
    if (img.startsWith("http")) return img;
    return `${API_BASE}${img.startsWith("/") ? img : "/" + img}`;
  };

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

  // Fetch turfs once
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);
        const url = `${API_BASE}/api/turfs/`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        const turfs = Array.isArray(data.results)
          ? data.results
          : Array.isArray(data)
            ? data
            : [];
            
        setAllTurfs(turfs);
      } catch (err) {
        console.error("Nearby Fetch Error:", err);
        setError("Failed to load nearby turfs.");
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  // Update distances and sort when allTurfs or userLocation changes
  useEffect(() => {
    if (allTurfs.length === 0) return;

    const mapped = allTurfs.map((turf) => {
      let distanceValue = 9999;
      let distance = "Nearby";

      if (userLocation && turf.latitude && turf.longitude) {
        distanceValue = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          parseFloat(turf.latitude),
          parseFloat(turf.longitude)
        );
        distance = `${distanceValue.toFixed(1)} km`;
      }

      return {
        id: turf.id,
        title: turf.name || "Unknown Turf",
        location: shortLocation(turf.location),
        games: turf.games || [],
        distance,
        distanceValue,
        image:
          turf.banner_images?.[0] ||
          turf.gallery_images?.[0] ||
          "/placeholder.jpg",
      };
    });

    mapped.sort((a, b) => a.distanceValue - b.distanceValue);
    setNearbyGrounds(mapped);
  }, [allTurfs, userLocation]);

  // Category filter
  const filteredGrounds = selectedSport
    ? nearbyGrounds.filter((g) => {
      let games = g.games || [];
      if (typeof games === "string") {
        games = games
          .replace(/[\[\]"']/g, "")
          .split(/[\/,&;]/)
          .map((x) => x.trim())
          .filter(Boolean);
      }
      if (!Array.isArray(games)) return false;
      return games.some((game) =>
        game.toLowerCase().includes(selectedSport.toLowerCase())
      );
    })
    : nearbyGrounds;

  // Skeleton loader cards
  const SkeletonCard = () => (
    <div className="nb-skeleton1">
      <div className="nb-skeleton1-img" />
      <div className="nb-skeleton1-body">
        <div className="nb-skeleton1-line long" />
        <div className="nb-skeleton1-line short" />
      </div>
    </div>
  );

  return (
    <div className="nb-wrapper">
      {/* ── Glacier background blobs ── */}
      <div className="nb-blob nb-blob--1" aria-hidden="true" />
      <div className="nb-blob nb-blob--2" aria-hidden="true" />
      <div className="nb-blob nb-blob--3" aria-hidden="true" />

      {/* Header */}
      <div className="nb-header1">
        <h3>Nearby You</h3>
        <button className="view-all1" onClick={() => setViewAll(!viewAll)}>
          {viewAll ? "Show less" : "View all \u2192"}
        </button>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="nb-container1">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="nb-error1">{error}</p>}

      {/* Cards */}
      {!loading && !error && (
        <div className={`nb-container1 ${viewAll ? "grid-view1" : ""}`}>
          {filteredGrounds.length === 0 ? (
            <p className="nb-empty1">No turfs available nearby.</p>
          ) : (
            filteredGrounds.map((gr) => (
              <div
                className="nb-card1"
                key={gr.id}
                onClick={() => navigate(buildTurfBookUrl({ id: gr.id, name: gr.title, games: gr.games }))}
              >
                <div className="img-wrapper1">
                  <img
                    src={getImageUrl(gr.image)}
                    className="nb-img1"
                    alt={gr.title}
                  />
                  <span className="distance1">{gr.distance}</span>
                  {/* Heart favourite button */}
                  <button
                    className={`nb-heart-btn ${favouriteIds.has(gr.id) ? "nb-heart-active" : ""}`}
                    onClick={(e) => toggleFavourite(e, gr.id)}
                    title={favouriteIds.has(gr.id) ? "Remove from favourites" : "Add to favourites"}
                    disabled={togglingId === gr.id}
                  >
                    <svg className="empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="none" d="M0 0H24V24H0z"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"></path></svg>
                    <svg className="filled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M0 0H24V24H0z" fill="none"></path><path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path></svg>
                  </button>
                </div>

                <h4>{gr.title}</h4>

                <div className="loc1">
                  <FaLocationDot size={12} />
                  {gr.location}
                </div>

                {/* Game tags */}
                {(() => {
                  let raw = gr.games || [];
                  let games = [];

                  // Helper: flatten any value into clean game names
                  const extract = (val) => {
                    if (!val) return [];
                    if (Array.isArray(val)) {
                      return val.flatMap(extract);
                    }
                    if (typeof val === "string") {
                      // Try JSON parse (handles double-encoded strings)
                      const trimmed = val.trim();
                      if (trimmed.startsWith("[")) {
                        try {
                          return extract(JSON.parse(trimmed));
                        } catch { }
                      }
                      // Split by / , & ;
                      return trimmed
                        .replace(/[\[\]"']/g, "")
                        .split(/[\/,&;]/)
                        .map((x) => x.trim())
                        .filter((x) => x.length > 0);
                    }
                    return [];
                  };

                  games = extract(raw);

                  if (games.length === 0) return null;

                  return (
                    <div className="nb-games1">
                      {games.slice(0, 4).map((game, i) => (
                        <span key={i} className="nb-game-tag1">
                          {game}
                        </span>
                      ))}
                      {games.length > 4 && (
                        <span className="nb-game-tag1 nb-more">+{games.length - 4}</span>
                      )}
                    </div>
                  );
                })()}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Nearby;