import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./TurfList.css";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "") + "/api/admin/turfs/";
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

export default function TurfList() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_BASE}${img}`;
  };

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access");

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(API_URL, { headers });

        if (res.status === 401) {
          localStorage.removeItem("access");
          navigate("/AdminLogin");
          return;
        }
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        setTurfs(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load turfs.");
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  const updatePriority = async (id, is_popular, priority, silent = false) => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch(
        `${API_BASE}/api/admin/turfs/${id}/priority/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_popular,
            priority,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update priority");

      if (!silent) alert("Priority updated successfully");
      return true;
    } catch (err) {
      console.error(err);
      if (!silent) alert("Error updating priority");
      return false;
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    let successCount = 0;
    for (const turf of turfs) {
      const success = await updatePriority(turf.id, turf.is_popular, turf.priority, true);
      if (success) successCount++;
    }
    setLoading(false);
    alert(`Successfully updated ${successCount} out of ${turfs.length} turfs.`);
  };

  const updateLocalTurf = (index, field, value) => {
    const updated = [...turfs];
    updated[index][field] = value;
    setTurfs(updated);
  };

  const navigate = useNavigate();



  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this turf?")) return;
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete turf");
      alert("Turf deleted successfully!");
      window.location.reload(); // Refetch list
    } catch (err) {
      console.error(err);
      alert("Error deleting turf");
    }
  };

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Turf List</h2>
        <button
          onClick={() => navigate('/AddTurf')}
          style={{ padding: "10px 20px", backgroundColor: "#10b981", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600" }}
        >
          + Add Turf
        </button>
      </div>

      {loading && <p>Loading turfs...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="table-container">
            <table className="turf-table">
              <thead>
                <tr>
                  <th>Vendor ID</th>
                  <th>Banner</th>
                  <th>Gallery</th>
                  <th>Name</th>
                  <th className="col-location">Location</th>
                  <th className="col-games">Games</th>
                  <th>Price</th>
                  <th className="col-slots">Slots</th>
                  <th>Popular</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {turfs.length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center" }}>
                      No Turfs Available
                    </td>
                  </tr>
                ) : (
                  turfs.map((turf, index) => (
                    <tr key={turf.id}>

                      {/* ⭐ Vendor ID */}
                      <td>{turf.vendor_code || "-"}</td>

                      {/* Banner */}
                      <td>
                        <div className="img-row">
                          {turf.banner_images?.length > 0 ? (
                            turf.banner_images.slice(0, 1).map((img, i) => (
                              <img
                                key={i}
                                src={getImageUrl(img)}
                                className="banner-thumb"
                                alt="banner"
                              />
                            ))
                          ) : (
                            <span>No Image</span>
                          )}
                        </div>
                      </td>

                      {/* Gallery */}
                      <td>
                        <div className="img-row">
                          {turf.gallery_images?.length > 0 ? (
                            turf.gallery_images.slice(0, 1).map((img, i) => (
                              <img
                                key={i}
                                src={getImageUrl(img)}
                                className="gallery-thumb"
                                alt="gallery"
                              />
                            ))
                          ) : (
                            <span>No Image</span>
                          )}
                        </div>
                      </td>

                      <td>{turf.name || "-"}</td>
                      <td className="col-location">{turf.location || "-"}</td>

                      {/* Games */}
                      <td className="col-games">
                        {Array.isArray(turf.games) && turf.games.length > 0 ? (
                          turf.games.map((game, i) => (
                            <span key={i} className="game-tag">
                              {typeof game === 'string' ? game.replace(/[\[\]"']/g, '') : game}
                            </span>
                          ))
                        ) : (
                          <span>-</span>
                        )}
                      </td>

                      <td className="price">
                        ₹{turf.price_per_hour ?? 0}
                      </td>

                      {/* Slots */}
                      <td className="col-slots">
                        <div className="slots-box">
                          {Array.isArray(turf.slots) &&
                            turf.slots.length > 0 ? (
                            turf.slots.slice(0, 2).map((slot, i) => (
                              <div key={i} className="slot-card">
                                <span className="slot-time">
                                  {slot.time_display ||
                                    `${slot.start_time} - ${slot.end_time}`}
                                </span>
                                <span className="slot-price">
                                  ₹{slot.price}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="no-slot">
                              No Slots
                            </span>
                          )}
                          {turf.slots?.length > 2 && <span className="no-slot">+{turf.slots.length - 2} more</span>}
                        </div>
                      </td>

                      {/* Popular */}
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={turf.is_popular || false}
                          onChange={(e) =>
                            updateLocalTurf(
                              index,
                              "is_popular",
                              e.target.checked
                            )
                          }
                        />
                      </td>

                      {/* Priority */}
                      <td>
                        <input
                          type="number"
                          value={turf.priority || 0}
                          style={{ width: "60px" }}
                          onChange={(e) =>
                            updateLocalTurf(
                              index,
                              "priority",
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => navigate(`/edit-turf/${turf.id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(turf.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bottom-actions">
            <button className="save-all-btn" onClick={handleSaveAll}>
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}