import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { VscChevronLeft } from "react-icons/vsc";
import API from "../api/api";
import "./EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Load profile fresh from backend ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("api/user/profile/");
        const u = res.data;
        setForm({
          name: u.name || "",
          email: u.email || "",
          mobile: u.mobile || "",
        });
      } catch {
        // Fallback to localStorage
        const saved = JSON.parse(localStorage.getItem("user") || "{}");
        setForm({
          name: saved.name || "",
          email: saved.email || "",
          mobile: saved.mobile || "",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  };

  // ── Save profile ──
  const handleSave = async () => {
    // Basic validation
    if (!form.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!/^[0-9]{10}$/.test(form.mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await API.put("api/user/profile/", {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
      });

      const data = res.data;

      if (data.success) {
        // ── Update localStorage with fresh user data ──
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userName", data.user.name);

        // ── If email changed → update tokens so user stays logged in ──
        if (data.email_changed) {
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
        }

        // Broadcast auth state change so Navbar / other components refresh
        window.dispatchEvent(new Event("authChange"));

        alert("Profile updated successfully");
        navigate("/MyProfile");
      } else {
        setError(data.error || "Failed to update profile.");
      }
    } catch (err) {
      const msg = err?.response?.data?.error || "Server error while updating profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="editprofile-page">
        <p className="ep-loading">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="editprofile-page">
      {/* Header */}
      <div className="editprofile-header">
        <button className="animated-back-btn" data-text="Back" onClick={() => navigate(-1)}>
          <VscChevronLeft className="animated-back-icon" />
        </button>
        <h3>Edit Profile</h3>
        <div style={{ width: 36 }} />
      </div>

      {/* Error */}
      {error && <p className="ep-error">{error}</p>}

      {/* Form */}
      <div className="editprofile-form">
        <div className="field">
          <label>Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="field">
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <span className="ep-hint">
            ⚠️ Changing your email will update your login email too.
          </span>
        </div>

        <div className="field">
          <label>Phone Number</label>
          <div className="phone-input">
            <span>+91</span>
            <input
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={handleChange}
              placeholder="10-digit number"
              maxLength={10}
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <button
        className="save-btn"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
};

export default EditProfile;
