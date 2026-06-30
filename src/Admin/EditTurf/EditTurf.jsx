import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditTurf.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");
const API_URL = API_BASE + "/api/admin/turfs/";

export default function EditTurf() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vendor_id: "",
    vendor_name: "",
    name: "",
    location: "",
    price_per_hour: "",
    games: [],
    amenities: [],
    features: [],
    description: "",
    banner_images: [],
    gallery_images: [],
    is_popular: false,
    priority: 0
  });

  const [newBanners, setNewBanners] = useState([]);
  const [newGallery, setNewGallery] = useState([]);

  const getImageUrl = (img) =>
    img?.startsWith("http") ? img : `${API_BASE}${img}`;

  // ===== LOAD DATA =====
  useEffect(() => {
    const fetchTurf = async () => {
      const token = localStorage.getItem("access");

      const res = await fetch(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setForm(data);
    };

    fetchTurf();
  }, [id]);

  // ===== INPUT CHANGE =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // ===== SAVE =====
  const handleSave = async () => {
    const token = localStorage.getItem("access");

    const fd = new FormData();

    Object.keys(form).forEach((k) => {
      if (k !== "banner_images" && k !== "gallery_images") {
        fd.append(k, form[k]);
      }
    });

    fd.append("games", JSON.stringify(form.games));
    fd.append("amenities", JSON.stringify(form.amenities));
    fd.append("features", JSON.stringify(form.features));

    newBanners.forEach((f) => fd.append("banner_images", f));
    newGallery.forEach((f) => fd.append("gallery_images", f));

    const res = await fetch(`${API_URL}${id}/`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    if (res.ok) {
      alert("Updated successfully");
      navigate("/TurfList");
    }
  };

  // ===== DELETE =====
  const handleDelete = async () => {
    if (!confirm("Delete turf?")) return;

    const token = localStorage.getItem("access");

    await fetch(`${API_URL}${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    navigate("/TurfList");
  };

  return (
    <div className="edit-turf-page">
      <div className="page-header">
        <h2>Edit Turf Details</h2>
        <p className="subtitle">Update information, banners, and priority settings for this turf.</p>
      </div>

      <div className="form-container">
        <div className="form-card">
          <h3 className="section-title">General Information</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Turf ID</label>
              <input value={form.id || ''} readOnly className="readonly-input" />
            </div>

            <div className="form-group">
              <label>Turf Name</label>
              <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Enter turf name" />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input name="location" value={form.location || ''} onChange={handleChange} placeholder="Enter location" />
            </div>

            <div className="form-group">
              <label>Price per Hour (₹)</label>
              <input
                name="price_per_hour"
                type="number"
                value={form.price_per_hour || ''}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description || ''}
                onChange={handleChange}
                rows="4"
                placeholder="Write a short description..."
              />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3 className="section-title">Settings & Priority</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Priority Rank</label>
              <input
                type="number"
                name="priority"
                value={form.priority || 0}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value) || 0);
                  setForm(p => ({ ...p, priority: val }));
                }}
                min="0"
                placeholder="0"
              />
            </div>
            {/* <div className="form-group">
              <label>Popular Status</label>
              <div className="toggle-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    name="is_popular"
                    checked={form.is_popular}
                    onChange={handleChange}
                    className="toggle-checkbox"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div> */}
          </div>
        </div>

        <div className="form-card">
          <h3 className="section-title">Media</h3>

          <div className="media-section">
            <label>Banners</label>
            <div className="img-row">
              {form.banner_images.map((img, i) => (
                <div key={i} className="img-preview-container">
                  <img src={getImageUrl(img)} className="banner-thumb" alt="Banner" />
                </div>
              ))}
            </div>
            <input type="file" multiple onChange={(e) => setNewBanners([...e.target.files])} className="file-input" />
          </div>

          <div className="media-section mt-4">
            <label>Gallery</label>
            <div className="img-row">
              {form.gallery_images.map((img, i) => (
                <div key={i} className="img-preview-container">
                  <img src={getImageUrl(img)} className="gallery-thumb" alt="Gallery" />
                </div>
              ))}
            </div>
            <input type="file" multiple onChange={(e) => setNewGallery([...e.target.files])} className="file-input" />
          </div>
        </div>

        <div className="form-actions">
          <button onClick={() => navigate("/TurfList")} className="cancel-btn">Cancel</button>
          <div className="action-right">
            <button onClick={handleDelete} className="delete-btn">Delete Turf</button>
            <button onClick={handleSave} className="save-btn">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}