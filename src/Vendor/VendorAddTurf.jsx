import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VendorAddTurf.css";
import {
  GoogleMap,
  StandaloneSearchBox,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

const GAMES = ["Cricket/Football", "Badminton", "Tennis", "Swimming", "Volleyball", "Basketball", "Golf", "Kabaddi"];
const AMENITIES = ["Camera", "Parking", "Water", "Toilet"];
const FEATURES = ["Indoor", "Outdoor", "Grass Turf"];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
const MERIDIANS = ["AM", "PM"];

const API = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "") + "/api";

// ✅ Static constant outside component — prevents new array on every render
const LIBRARIES = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%", // Let container dictate height
  border: "none",
};

const defaultCenter = { lat: 11.1271, lng: 78.6569 };

// ── Field validation rules ──
const validateField = (fieldName, value) => {
  switch (fieldName) {
    case "name":
      if (!value || !value.trim()) return "Turf name is required";
      if (value.trim().length < 3) return "Must be at least 3 characters";
      return "";
    case "location":
      if (!value || !value.trim()) return "Location address is required";
      return "";
    case "latitude":
      if (!value) return "Please select a location on the map";
      return "";
    case "price":
      if (!value) return "Price per hour is required";
      if (Number(value) <= 0) return "Price must be greater than ₹0";
      return "";
    case "games":
      if (!value || value.length === 0) return "Select at least one game";
      return "";
    case "amenities":
      if (!value || value.length === 0) return "Select at least one amenity";
      return "";
    case "features":
      if (!value || value.length === 0) return "Select at least one feature";
      return "";
    case "gallery":
      if (!value || value.length < 3) return `Minimum 3 images required (${value?.length || 0}/3 added)`;
      return "";
    case "banner":
      if (!value || value.length < 3) return `Minimum 3 images required (${value?.length || 0}/3 added)`;
      return "";
    case "generatedSlots":
      if (!value || value.length === 0) return "Generate time slots before submitting";
      return "";
    default:
      return "";
  }
};

export default function VendorAddTurf() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vendorId: "",
    vendorName: "",
    price: "",
    name: "", // Added name field
    location: "",
    latitude: "",
    longitude: "",
    games: [],
    amenities: [],
    features: [],
    description: "",
    gallery: [],
    banner: [],
    slots: { all: { from: { hour: "12", minute: "00", meridian: "AM" }, to: { hour: "11", minute: "59", meridian: "PM" } } }, // Provide defaults
    generatedSlots: [],
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [center, setCenter] = useState(defaultCenter);
  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);

  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) { setLoading(false); return; }

        const res = await fetch(`${API}/vendor/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setForm((p) => ({
            ...p,
            vendorId: data.vendor_id || "",
            vendorName: data.venuename || "",
          }));
        }
      } catch (err) {
        console.error("Vendor fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateAll = () => {
    const fields = {
      name: form.name, location: form.location, latitude: form.latitude,
      price: form.price, games: form.games, amenities: form.amenities,
      features: form.features, gallery: form.gallery, banner: form.banner,
      generatedSlots: form.generatedSlots,
    };
    const newErrors = {};
    let valid = true;
    Object.entries(fields).forEach(([k, v]) => {
      const err = validateField(k, v);
      if (err) { newErrors[k] = err; valid = false; }
    });
    setErrors(newErrors);
    return valid;
  };

  // Re-validate in real-time after first submit attempt
  useEffect(() => {
    if (!submitted) return;
    const fields = {
      name: form.name, location: form.location, latitude: form.latitude,
      price: form.price, games: form.games, amenities: form.amenities,
      features: form.features, gallery: form.gallery, banner: form.banner,
      generatedSlots: form.generatedSlots,
    };
    const newErrors = {};
    Object.entries(fields).forEach(([k, v]) => {
      const err = validateField(k, v);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
  }, [form, submitted]);

  const handleChipToggle = (type, val) => {
    setForm((p) => {
      let updated = p[type].includes(val)
        ? p[type].filter((x) => x !== val)
        : [...p[type], val];

      // Mutually exclusive features
      if (type === "features") {
        if (val === "Indoor") updated = updated.filter(x => x !== "Outdoor");
        if (val === "Outdoor") updated = updated.filter(x => x !== "Indoor");
      }
      return { ...p, [type]: updated };
    });
  };

  const processFiles = (files, name) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB
    const validFiles = [];

    for (const file of Array.from(files)) {
      if (!allowed.includes(file.type)) {
        alert(`${file.name}: Only JPG, JPEG, PNG allowed`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`${file.name}: Max size is 2MB`);
        continue;
      }
      validFiles.push(file);
    }

    setForm((p) => ({ ...p, [name]: [...p[name], ...validFiles] }));
  };

  const handleFile = (e) => {
    processFiles(e.target.files, e.target.name);
    e.target.value = ""; // Reset input
  };

  const removeImage = (type, index) => {
    setForm((p) => ({
      ...p,
      [type]: p[type].filter((_, i) => i !== index),
    }));
  };

  // Time conversion helpers
  const toMinutes = (timeObj) => {
    if (!timeObj || !timeObj.hour || !timeObj.minute || !timeObj.meridian) return null;
    let h = Number(timeObj.hour);
    let m = Number(timeObj.minute);
    if (timeObj.meridian === "PM" && h !== 12) h += 12;
    if (timeObj.meridian === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const formatTime = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m === 0 ? "00" : m.toString().padStart(2, "0")} ${ampm}`;
  };

  const generateSlots = () => {
    const s = form.slots?.all;
    if (!form.price) return alert("Please enter amount per hour first");

    let start = toMinutes(s.from);
    let end = toMinutes(s.to);
    if (start === null || end === null) return alert("Select valid start & end times");

    if (end <= start) end += 24 * 60; // Next day

    const slots = [];
    const price = Number(form.price);
    const createId = () => Math.random().toString(36).substring(2, 10);

    let current = start;
    while (current + 60 <= end) {
      const fromTime = current % (24 * 60);
      const toTime = (current + 60) % (24 * 60);
      slots.push({
        id: createId(),
        from: formatTime(fromTime),
        to: formatTime(toTime),
        price: price,
        is_booked: false,
      });
      current += 60;
    }
    setForm((p) => ({ ...p, generatedSlots: slots }));
  };

  // Map callbacks
  const onMapLoad = (map) => { mapRef.current = map; };
  const onSearchBoxLoad = (ref) => { searchBoxRef.current = ref; };

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    if (!place.geometry?.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const newCenter = { lat, lng };

    mapRef.current?.panTo(newCenter);
    mapRef.current?.setZoom(16);
    setCenter(newCenter);
    setMarkerPosition(newCenter);

    setForm((p) => ({
      ...p,
      location: place.formatted_address || place.name,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setCenter({ lat, lng });
    setMarkerPosition({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setForm((p) => ({
        ...p,
        location: status === "OK" && results[0] ? results[0].formatted_address : p.location, // Keep existing if reverse geocoding fails, or maybe clear it? Better to keep or show lat/lng
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
    });
  };

  // Add Turf Submit
  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitted(true);
    if (!validateAll()) {
      setTimeout(() => {
        const el = document.querySelector('.at-error-msg');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("vendorId", form.vendorId);
    formData.append("name", form.name);
    // Include vendorName so backend can extract vendor if needed (though vendorId is better)
    formData.append("vendorName", form.vendorName);
    formData.append("location", form.location);
    formData.append("latitude", form.latitude);
    formData.append("longitude", form.longitude);
    formData.append("price", Number(form.price));
    formData.append("games", JSON.stringify(form.games));
    formData.append("amenities", JSON.stringify(form.amenities));
    formData.append("features", JSON.stringify(form.features));
    formData.append("description", form.description);
    formData.append("slots", JSON.stringify(form.generatedSlots));

    form.banner.forEach(file => formData.append("banner_images", file));
    form.gallery.forEach(file => formData.append("gallery_images", file));

    try {
      const res = await fetch(`${API}/vendor/turfs/create/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Turf Added Successfully!");
        navigate("/VendorTurfList");
      } else {
        alert(data.error || "Error adding turf");
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) return <div className="at-loading"><span>Error loading Google Maps</span></div>;
  if (loading || !isLoaded) return (
    <div className="at-loading">
      <div className="at-spinner" />
      <span>Loading turf builder…</span>
    </div>
  );

  return (
    <div className="at-page">
      <div className="at-container">

        {/* HERO HEADER */}
        <div className="at-hero">
          <div className="at-hero-text">
            <div className="at-hero-eyebrow">Turf Setup</div>
            <h1>Add New Turf</h1>
            <p>Expand your business by adding a new ground with its complete details, slots, and images.</p>
          </div>
          <div className="at-hero-icon">🏟️</div>
        </div>

        <form onSubmit={submit} noValidate>

          {/* VENDOR & BASIC INFO */}
          <div className="at-card">
            <div className="at-section-head">
              <div className="at-section-icon at-section-icon--blue">📍</div>
              <div>
                <h3 className="at-section-title">Basic Information</h3>
                <p className="at-section-sub">Vendor details and turf identification</p>
              </div>
            </div>

            <div className="at-grid-2">
              <div className="at-field">
                <label className="at-label">Vendor ID</label>
                <input className="at-input" name="vendorId" value={form.vendorId} readOnly />
              </div>
              <div className="at-field">
                <label className="at-label">Vendor Name</label>
                <input className="at-input" value={form.vendorName} readOnly />
              </div>
              <div className="at-field at-full">
                <label className="at-label">Turf Name<span>*</span></label>
                <input className={`at-input${errors.name ? ' at-input--error' : ''}`} name="name" placeholder="E.g., Central Park Arena" value={form.name} onChange={handleChange} />
                {errors.name && <div className="at-error-msg">⚠ {errors.name}</div>}
              </div>
              <div className="at-field at-full">
                <label className="at-label">Description</label>
                <textarea className="at-textarea" name="description" placeholder="Write a catchy description about the ground, rules, or special features..." value={form.description} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* LOCATION & MAP */}
          <div className="at-card">
            <div className="at-section-head">
              <div className="at-section-icon at-section-icon--green">🗺️</div>
              <div>
                <h3 className="at-section-title">Location Details</h3>
                <p className="at-section-sub">Pinpoint your ground for players to find easily</p>
              </div>
            </div>

            <div className="at-location-row">
              <div className="at-field">
                <label className="at-label">Full Address<span>*</span></label>
                <input className={`at-input${errors.location ? ' at-input--error' : ''}`} name="location" placeholder="Search or select on map..." value={form.location} onChange={handleChange} />
                {errors.location && <div className="at-error-msg">⚠ {errors.location}</div>}
              </div>
              <button type="button" className="at-map-btn" onClick={() => setShowMap(!showMap)}>
                {showMap ? "Hide Map" : "Open Map Selector"}
              </button>
            </div>

            {showMap && (
              <div className="at-map-container" style={{ height: "350px", display: "flex", flexDirection: "column" }}>
                <div className="at-map-search">
                  <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
                    <input type="text" placeholder="Search for area or landmark..." />
                  </StandaloneSearchBox>
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13} onLoad={onMapLoad} onClick={handleMapClick} options={{ streetViewControl: false, mapTypeControl: false }}>
                    {markerPosition && <Marker position={markerPosition} />}
                  </GoogleMap>
                </div>
                {markerPosition && (
                  <div className="at-map-info">
                    📍 Lat: {markerPosition.lat.toFixed(6)} | Lng: {markerPosition.lng.toFixed(6)}
                  </div>
                )}
              </div>
            )}

            {errors.latitude && <div className="at-error-msg" style={{ marginTop: '8px' }}>⚠ {errors.latitude}</div>}
          </div>

          {/* GAMES, AMENITIES, FEATURES */}
          <div className="at-card">
            <div className="at-section-head">
              <div className="at-section-icon at-section-icon--amber">⚽</div>
              <div>
                <h3 className="at-section-title">Facilities & Offerings</h3>
                <p className="at-section-sub">What games and amenities does this ground offer?</p>
              </div>
            </div>

            <div className="at-grid-2">
              <div className="at-field at-full" style={{ marginBottom: "10px" }}>
                <label className="at-label" style={{ marginBottom: "8px" }}>Available Games</label>
                <div className="at-chip-group">
                  {GAMES.map((g) => (
                    <label key={g} className="at-chip-label">
                      <input type="radio" name="game" checked={form.games[0] === g}
                        onChange={() => setForm((p) => ({
                          ...p, games: [g],
                        }))
                        } />
                      <span className="at-chip">{g}</span>
                    </label>
                  ))}
                </div>
                {errors.games && <div className="at-error-msg">⚠ {errors.games}</div>}
              </div>

              <div className="at-field at-full" style={{ marginBottom: "10px" }}>
                <label className="at-label" style={{ marginBottom: "8px" }}>Amenities</label>
                <div className="at-chip-group">
                  {AMENITIES.map((a) => (
                    <label key={a} className="at-chip-label">
                      <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => handleChipToggle("amenities", a)} />
                      <span className="at-chip">{a}</span>
                    </label>
                  ))}
                </div>
                {errors.amenities && <div className="at-error-msg">⚠ {errors.amenities}</div>}
              </div>

              <div className="at-field at-full">
                <label className="at-label" style={{ marginBottom: "8px" }}>Key Features</label>
                <div className="at-chip-group">
                  {FEATURES.map((f) => (
                    <label key={f} className="at-chip-label">
                      <input type="checkbox" checked={form.features.includes(f)} onChange={() => handleChipToggle("features", f)} />
                      <span className="at-chip">{f}</span>
                    </label>
                  ))}
                </div>
                {errors.features && <div className="at-error-msg">⚠ {errors.features}</div>}
              </div>
            </div>
          </div>

          {/* TIMINGS & PRICING */}
          <div className="at-card">
            <div className="at-section-head">
              <div className="at-section-icon at-section-icon--purple">⏱️</div>
              <div>
                <h3 className="at-section-title">Schedule & Pricing</h3>
                <p className="at-section-sub">Set hourly rates and generate standard booking slots</p>
              </div>
            </div>

            <div className="at-grid-2" style={{ marginBottom: "20px" }}>
              <div className="at-field">
                <label className="at-label">Base Hourly Price (₹)<span>*</span></label>
                <input className={`at-input${errors.price ? ' at-input--error' : ''}`} name="price" type="number" placeholder="E.g. 1000" value={form.price} onChange={handleChange} min="0" />
                {errors.price && <div className="at-error-msg">⚠ {errors.price}</div>}
              </div>
            </div>

            <h4 className="at-label" style={{ marginBottom: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Generate 1-Hour Slots</h4>

            <div className="at-time-grid">
              {/* FROM TIME */}
              <div className="at-time-block">
                <div className="at-time-block-label">▶ From Time</div>
                <div className="at-time-selects">
                  <div className="at-select-wrap">
                    <select className="at-select" value={form.slots.all?.from?.hour || "12"} onChange={(e) => setForm(p => ({ ...p, slots: { all: { ...p.slots.all, from: { ...p.slots.all?.from, hour: e.target.value } } } }))}>
                      {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div className="at-select-wrap">
                    <select className="at-select" value={form.slots.all?.from?.minute || "00"} onChange={(e) => setForm(p => ({ ...p, slots: { all: { ...p.slots.all, from: { ...p.slots.all?.from, minute: e.target.value } } } }))}>
                      {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="at-select-wrap">
                    <select className="at-select" value={form.slots.all?.from?.meridian || "AM"} onChange={(e) => setForm(p => ({ ...p, slots: { all: { ...p.slots.all, from: { ...p.slots.all?.from, meridian: e.target.value } } } }))}>
                      {MERIDIANS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* TO TIME */}
              <div className="at-time-block">
                <div className="at-time-block-label">⏹ To Time</div>
                <div className="at-time-selects">
                  <div className="at-select-wrap">
                    <select className="at-select" value={form.slots.all?.to?.hour || "11"} onChange={(e) => setForm(p => ({ ...p, slots: { all: { ...p.slots.all, to: { ...p.slots.all?.to, hour: e.target.value } } } }))}>
                      {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div className="at-select-wrap">
                    <select className="at-select" value={form.slots.all?.to?.minute || "59"} onChange={(e) => setForm(p => ({ ...p, slots: { all: { ...p.slots.all, to: { ...p.slots.all?.to, minute: e.target.value } } } }))}>
                      {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="at-select-wrap">
                    <select className="at-select" value={form.slots.all?.to?.meridian || "PM"} onChange={(e) => setForm(p => ({ ...p, slots: { all: { ...p.slots.all, to: { ...p.slots.all?.to, meridian: e.target.value } } } }))}>
                      {MERIDIANS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button type="button" className="at-gen-btn" onClick={generateSlots}>
              ⚡ Generate Daily Slots
            </button>

            {form.generatedSlots.length > 0 && (
              <div className="at-slot-grid">
                {form.generatedSlots.map((s, i) => (
                  <div key={i} className="at-slot-chip">
                    <span className="at-slot-chip-time">{s.from} - {s.to}</span>
                    <span className="at-slot-chip-price">₹{s.price}</span>
                  </div>
                ))}
              </div>
            )}

            {errors.generatedSlots && <div className="at-error-msg" style={{ marginTop: '8px' }}>⚠ {errors.generatedSlots}</div>}
          </div>

          {/* MEDIA / IMAGES */}
          <div className="at-card">
            <div className="at-section-head">
              <div className="at-section-icon at-section-icon--blue">📸</div>
              <div>
                <h3 className="at-section-title">Media Gallery</h3>
                <p className="at-section-sub">Upload high-quality images to attract players (Min 3 each)</p>
              </div>
            </div>

            <div className="at-grid-2">
              <div className="at-field">
                <div className="at-upload-meta">
                  <label className="at-label">Gallery Images<span>*</span></label>
                  <span className="at-upload-count">{form.gallery.length} added</span>
                </div>
                <label className="at-upload-zone">
                  <input type="file" name="gallery" multiple accept="image/jpeg, image/png, image/jpg" onChange={handleFile} />
                  <div className="at-upload-icon">🖼️</div>
                  <div className="at-upload-label">Click or drag images here</div>
                  <div className="at-upload-hint">Recommended: 4:3 aspect ratio (PNG, JPG)</div>
                </label>
                {form.gallery.length > 0 && (
                  <div className="at-preview-grid">
                    {form.gallery.map((img, i) => (
                      <div key={i} className="at-preview-item">
                        <img src={URL.createObjectURL(img)} alt="gallery preview" />
                        <button type="button" className="at-preview-remove" onClick={() => removeImage("gallery", i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.gallery && <div className="at-error-msg">⚠ {errors.gallery}</div>}
              </div>

              <div className="at-field">
                <div className="at-upload-meta">
                  <label className="at-label">Banner Images<span>*</span></label>
                  <span className="at-upload-count">{form.banner.length} added</span>
                </div>
                <label className="at-upload-zone">
                  <input type="file" name="banner" multiple accept="image/jpeg, image/png, image/jpg" onChange={handleFile} />
                  <div className="at-upload-icon">🌄</div>
                  <div className="at-upload-label">Click or drag banner here</div>
                  <div className="at-upload-hint">Recommended: 16:9 aspect ratio (Landscape)</div>
                </label>
                {form.banner.length > 0 && (
                  <div className="at-preview-grid">
                    {form.banner.map((img, i) => (
                      <div key={i} className="at-preview-item banner">
                        <img src={URL.createObjectURL(img)} alt="banner preview" />
                        <button type="button" className="at-preview-remove" onClick={() => removeImage("banner", i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.banner && <div className="at-error-msg">⚠ {errors.banner}</div>}
              </div>
            </div>
          </div>

          <div className="at-submit-wrap">
            <button type="submit" className="at-submit-btn" disabled={submitting}>
              {submitting ? "🚀 Publishing Turf..." : "✅ Publish Turf"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}