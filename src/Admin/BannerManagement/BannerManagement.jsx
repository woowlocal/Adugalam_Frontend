import React, { useState, useEffect } from "react";
import AdminAPI from "../../api/adminApi";
import "./BannerManagement.css";

/* ===== PAGE ROUTES ===== */

const ROUTE_OPTIONS = [
  { label: "Book Home", value: "/Bookhome" },
  { label: "Play", value: "/play" },
  { label: "Events", value: "/events" },
  { label: "Tournaments", value: "/tournaments" },
  { label: "Shop", value: "/shop" },
  { label: "Train", value: "/train" },
];

/* ===== BANNER CATEGORY ===== */

const CATEGORY_OPTIONS = [
  { label: "All Pages", value: "all" },
  { label: "Book Home", value: "/Bookhome" },
  { label: "Play", value: "/play" },
  { label: "Events", value: "/events" },
  { label: "Tournaments", value: "/tournaments" },
  { label: "Shop", value: "/shop" },
  { label: "Train", value: "/train" },
];

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "") + "/api";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    text: "",
    button_text: "Book Now",
    link_path: "/Bookhome",
    category: "all",        // ⭐ NEW FIELD
    priority: 1,
    is_active: true,
    image: null,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  /* ================= FETCH ================= */

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await AdminAPI.get("api/admin/banners/");
      const sorted = res.data.sort((a, b) => a.priority - b.priority);
      setBanners(sorted);
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
    setLoading(false);
  };

  /* ================= INPUT ================= */

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "image" && formData[key] === null) return;
      data.append(key, formData[key]);
    });

    try {
      if (editingBanner) {
        await AdminAPI.put(`api/admin/banners/${editingBanner.id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await AdminAPI.post("api/admin/banners/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchBanners();
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Error saving banner");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (banner) => {
    setEditingBanner(banner);

    setFormData({
      title: banner.title || "",
      text: banner.text || "",
      button_text: banner.button_text || "Book Now",
      link_path: banner.link_path || "/Bookhome",
      category: banner.category || "all",   // ⭐ IMPORTANT
      priority: banner.priority || 1,
      is_active: banner.is_active,
      image: null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      await AdminAPI.delete(`api/admin/banners/${id}/`);
      fetchBanners();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setEditingBanner(null);

    setFormData({
      title: "",
      text: "",
      button_text: "Book Now",
      link_path: "/Bookhome",
      category: "all",
      priority: 1,
      is_active: true,
      image: null,
    });
  };

  /* ================= UI ================= */

  return (
    <div className="banner-management-container">
      <header className="banner-management-header">
        <h1>Homepage Banner Management</h1>
      </header>

      {/* ===== FORM ===== */}

      <section className="banner-form-section">
        <h2>{editingBanner ? "Edit Banner" : "Add New Banner"}</h2>

        <form onSubmit={handleSubmit} className="banner-form">

          {/* ⭐ CATEGORY SELECT */}

          <div className="form-group">
            <label>Banner Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Banner Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Button Text</label>
            <input
              name="button_text"
              value={formData.button_text}
              onChange={handleInputChange}
            />
          </div>

          {/* ⭐ REDIRECT PAGE */}

          <div className="form-group">
            <label>Redirect Page</label>
            <select
              name="link_path"
              value={formData.link_path}
              onChange={handleInputChange}
            >
              {ROUTE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Priority (1 = Highest)</label>
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group form-full-width">
            <label>Description</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Banner Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              required={!editingBanner}
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
            />
            <label>Show on Homepage</label>
          </div>

          <div className="form-actions">
            {editingBanner && (
              <button
                type="button"
                className="btn-cancel"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

            <button type="submit" className="btn-save">
              {editingBanner ? "Update Banner" : "Add Banner"}
            </button>
          </div>
        </form>
      </section>

      {/* ===== LIST ===== */}

      <section className="banner-list-section">
        <h2>Banner List</h2>

        {loading ? (
          <p>Loading banners...</p>
        ) : (
          <div className="table-container">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {banners.length === 0 ? (
                  <tr>
                    <td colSpan="6">No banners found</td>
                  </tr>
                ) : (
                  banners.map((banner) => (
                    <tr key={banner.id}>
                      <td>
                        <img
                          src={banner.image}
                          alt=""
                          className="banner-img-preview"
                        />
                      </td>

                      <td>{banner.title}</td>

                      <td>{banner.category}</td>

                      <td>{banner.priority}</td>

                      <td>
                        <span className={`status-pill ${banner.is_active ? "visible" : "hidden"}`}>
                          {banner.is_active ? "Visible" : "Hidden"}
                        </span>
                      </td>

                      <td>
                        <button onClick={() => handleEdit(banner)}>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default BannerManagement;