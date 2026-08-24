import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VendorEditTurf.css";
import {
  GoogleMap,
  StandaloneSearchBox,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

const GAMES_LIST = ["Cricket/Football", "Badminton", "Tennis", "Swimming", "Volleyball", "Basketball", "Golf", "Kabaddi"];
const AMENITIES_LIST = ["Camera", "Parking", "Water", "Toilet"];
const FEATURES_LIST = ["Indoor", "Outdoor", "Grass Turf"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  border: "none",
};

const defaultCenter = { lat: 11.1271, lng: 78.6569 };

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${API_BASE}${img}`;
};

export default function VendorEditTurf() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    vendorName: "",
    location: "",
    latitude: "",
    longitude: "",
    price: "",
    games: [],
    amenities: [],
    features: [],
    description: "",
    newGallery: [],
    newBanner: [],
    existingBanners: [],
    existingGallery: [],
  });

  const [center, setCenter] = useState(defaultCenter);
  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);

  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });

  // Fetch turf detail on mount
  useEffect(() => {
    const fetchTurf = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access");
        const res = await fetch(`${API_BASE}/api/vendor/turfs/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          navigate("/notfound", { replace: true });
          return;
        }
        const data = await res.json();

        setForm({
          vendorName: data.name || "",
          location: data.location || "",
          latitude: data.latitude ? String(data.latitude) : "",
          longitude: data.longitude ? String(data.longitude) : "",
          price: data.price_per_hour ? String(data.price_per_hour) : "",
          games: Array.isArray(data.games) ? data.games : [],
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
          features: Array.isArray(data.features) ? data.features : [],
          description: data.description || "",
          newGallery: [],
          newBanner: [],
          existingBanners: data.banner_images || [],
          existingGallery: data.gallery_images || [],
        });

        if (data.latitude && data.longitude) {
          const pos = { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) };
          setCenter(pos);
          setMarkerPosition(pos);
        }
      } catch (err) {
        navigate("/notfound", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchTurf();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleChipToggle = (type, val) => {
    setForm((p) => {
      let updated = p[type].includes(val)
        ? p[type].filter((x) => x !== val)
        : [...p[type], val];

      // Mutually exclusive features
      if (type === "features") {
        if (val === "Indoor")  updated = updated.filter(x => x !== "Outdoor");
        if (val === "Outdoor") updated = updated.filter(x => x !== "Indoor");
      }
      return { ...p, [type]: updated };
    });
  };

  const processFiles = (files, name) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 2 * 1024 * 1024;
    const validFiles = [];
    for (const file of Array.from(files)) {
      if (!allowed.includes(file.type)) { alert(`${file.name}: Only JPG, JPEG, PNG allowed`); continue; }
      if (file.size > maxSize) { alert(`${file.name}: Image must be < 2MB`); continue; }
      validFiles.push(file);
    }
    setForm((p) => ({ ...p, [name]: [...p[name], ...validFiles] }));
  };

  const handleFile = (e) => {
    processFiles(e.target.files, e.target.name);
    e.target.value = "";
  };

  const removeNewImage = (type, index) => setForm((p) => ({ ...p, [type]: p[type].filter((_, i) => i !== index) }));

  // Map handlers
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
        location: status === "OK" && results[0] ? results[0].formatted_address : p.location,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("location", form.location);
    formData.append("latitude", form.latitude);
    formData.append("longitude", form.longitude);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("games", JSON.stringify(form.games));
    formData.append("amenities", JSON.stringify(form.amenities));
    formData.append("features", JSON.stringify(form.features));

    form.newBanner.forEach((file) => formData.append("banner_images", file));
    form.newGallery.forEach((file) => formData.append("gallery_images", file));

    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE}/api/vendor/turfs/${id}/update/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update turf.");
      setSuccess("Turf updated successfully!");
      setTimeout(() => navigate("/VendorTurfList"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <div className="edit-loading"><span>Error loading Google Maps</span></div>;
  if (loading || !isLoaded) return (
    <div className="edit-loading">
      <div className="edit-spinner" />
      <span>Loading turf data…</span>
    </div>
  );

  return (
    <div className="edit-page">
      <div className="edit-container">

        {/* HERO HEADER */}
        <div className="edit-hero">
          <div className="edit-hero-text">
            <div className="edit-hero-eyebrow">Turf Management</div>
            <div className="edit-hero-title-row">
                 <button className="edit-back-btn" onClick={() => navigate("/VendorTurfList")} title="Back to Turf List">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1>Edit Turf</h1>
            </div>
            <p>Update ground details, pricing, location, and multimedia to keep players informed.</p>
          </div>
          <div className="edit-hero-icon">✏️</div>
        </div>

        {error && <div className="edit-error">⚠ {error}</div>}
        {success && <div className="edit-success">✅ {success}</div>}

        <form onSubmit={handleSubmit}>

          {/* BASIC INFO */}
          <div className="edit-card">
            <div className="edit-section-head">
              <div className="edit-section-icon edit-section-icon--blue">📍</div>
              <div>
                <h3 className="edit-section-title">Basic Information</h3>
                <p className="edit-section-sub">Identify your venue on the platform</p>
              </div>
            </div>
            
            <div className="edit-grid-2">
              <div className="edit-field edit-full">
                <label className="edit-label">Turf Name</label>
                <input className="edit-input readonly-input" value={form.vendorName} readOnly title="Turf name cannot be changed" />
              </div>
              <div className="edit-field edit-full">
                <label className="edit-label">Description</label>
                <textarea className="edit-textarea" name="description" placeholder="Write a catchy description about the ground..." value={form.description} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* LOCATION & MAP */}
          <div className="edit-card">
            <div className="edit-section-head">
              <div className="edit-section-icon edit-section-icon--green">🗺️</div>
              <div>
                <h3 className="edit-section-title">Location Details</h3>
                <p className="edit-section-sub">Pinpoint your ground for players to find easily</p>
              </div>
            </div>

            <div className="edit-location-row">
              <div className="edit-field">
                <label className="edit-label">Full Address<span>*</span></label>
                <input className="edit-input" name="location" placeholder="Search or select on map..." value={form.location} onChange={handleChange} required />
              </div>
              <button type="button" className="edit-map-btn" onClick={() => setShowMap(!showMap)}>
                {showMap ? "Hide Map Selector" : "Open Map Selector"}
              </button>
            </div>

            {showMap && (
              <div className="edit-map-container" style={{ height: "350px", display: "flex", flexDirection: "column" }}>
                <div className="edit-map-search">
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
                  <div className="edit-map-info">
                    📍 Lat: {markerPosition.lat.toFixed(6)} | Lng: {markerPosition.lng.toFixed(6)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* GAMES, AMENITIES, FEATURES */}
          <div className="edit-card">
            <div className="edit-section-head">
              <div className="edit-section-icon edit-section-icon--amber">⚽</div>
              <div>
                <h3 className="edit-section-title">Facilities & Offerings</h3>
                <p className="edit-section-sub">What games and amenities does this ground offer?</p>
              </div>
            </div>

            <div className="edit-grid-2">
              <div className="edit-field edit-full" style={{ marginBottom: "10px" }}>
                <label className="edit-label" style={{ marginBottom: "8px" }}>Available Game <span style={{ color: "#6b7280", fontWeight: 500, fontSize: "0.75rem" }}>(Select one)</span></label>
                <div className="edit-chip-group">
                  {GAMES_LIST.map((g) => (
                    <label key={g} className="edit-chip-label">
                      <input
                        type="radio"
                        name="game_select"
                        checked={form.games.includes(g)}
                        onChange={() => setForm((p) => ({ ...p, games: [g] }))}
                      />
                      <span className="edit-chip">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="edit-field edit-full" style={{ marginBottom: "10px" }}>
                <label className="edit-label" style={{ marginBottom: "8px" }}>Amenities</label>
                <div className="edit-chip-group">
                  {AMENITIES_LIST.map((a) => (
                    <label key={a} className="edit-chip-label">
                      <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => handleChipToggle("amenities", a)} />
                      <span className="edit-chip">{a}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="edit-field edit-full">
                <label className="edit-label" style={{ marginBottom: "8px" }}>Key Features</label>
                <div className="edit-chip-group">
                  {FEATURES_LIST.map((f) => (
                    <label key={f} className="edit-chip-label">
                      <input type="checkbox" checked={form.features.includes(f)} onChange={() => handleChipToggle("features", f)} />
                      <span className="edit-chip">{f}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

           {/* PRICING */}
           <div className="edit-card">
            <div className="edit-section-head">
              <div className="edit-section-icon edit-section-icon--purple">💰</div>
              <div>
                <h3 className="edit-section-title">Pricing</h3>
                <p className="edit-section-sub">Set standard hourly rate</p>
              </div>
            </div>
             <div className="edit-grid-2">
              <div className="edit-field">
                <label className="edit-label">Base Hourly Price (₹)<span>*</span></label>
                <input className="edit-input" name="price" type="number" placeholder="E.g. 1000" value={form.price} onChange={handleChange} required min="0" />
              </div>
             </div>
           </div>

          {/* MEDIA / IMAGES */}
          <div className="edit-card">
            <div className="edit-section-head">
              <div className="edit-section-icon edit-section-icon--blue">📸</div>
              <div>
                <h3 className="edit-section-title">Media Gallery</h3>
                <p className="edit-section-sub">Manage banner and gallery images for your turf</p>
              </div>
            </div>

            <div className="edit-grid-2">
              
              {/* GALLERY MANAGER */}
              <div className="edit-field">
                <div className="edit-upload-meta">
                  <label className="edit-label">Gallery Images</label>
                  <span className="edit-upload-count">{form.existingGallery.length + form.newGallery.length} total</span>
                </div>
                
                {/* Existing Gallery */}
                {form.existingGallery.length > 0 && (
                   <div style={{ marginBottom: '14px' }}>
                    <div className="edit-label" style={{ fontSize: '10px', marginBottom: '6px', opacity: 0.8 }}>Current Gallery</div>
                    <div className="edit-preview-grid" style={{ marginTop: 0 }}>
                        {form.existingGallery.map((img, i) => (
                        <div key={i} className="edit-preview-item">
                            <img src={getImageUrl(img)} alt="existing gallery" />
                        </div>
                        ))}
                    </div>
                  </div>
                )}
                {form.existingGallery.length === 0 && <span className="edit-no-img">No current gallery images.</span>}

                <label className="edit-upload-zone" style={{ marginTop: '10px' }}>
                  <input type="file" name="newGallery" multiple accept="image/jpeg, image/png, image/jpg" onChange={handleFile} />
                  <div className="edit-upload-icon">🖼️</div>
                  <div className="edit-upload-label">Replace Gallery (Optional)</div>
                  <div className="edit-upload-hint">Drag/click to replace all existing images.</div>
                </label>
                
                {form.newGallery.length > 0 && (
                  <div className="edit-preview-grid">
                    {form.newGallery.map((img, i) => (
                      <div key={i} className="edit-preview-item">
                        <img src={URL.createObjectURL(img)} alt="new gallery preview" />
                        <button type="button" className="edit-preview-remove" onClick={() => removeNewImage("newGallery", i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BANNER MANAGER */}
              <div className="edit-field">
                <div className="edit-upload-meta">
                  <label className="edit-label">Banner Images</label>
                  <span className="edit-upload-count">{form.existingBanners.length + form.newBanner.length} total</span>
                </div>

                {/* Existing Banners */}
                {form.existingBanners.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <div className="edit-label" style={{ fontSize: '10px', marginBottom: '6px', opacity: 0.8 }}>Current Banners</div>
                    <div className="edit-preview-grid" style={{ marginTop: 0 }}>
                        {form.existingBanners.map((img, i) => (
                        <div key={i} className="edit-preview-item banner">
                            <img src={getImageUrl(img)} alt="existing banner" />
                        </div>
                        ))}
                    </div>
                  </div>
                )}
                {form.existingBanners.length === 0 && <span className="edit-no-img">No current banner images.</span>}

                <label className="edit-upload-zone" style={{ marginTop: '10px' }}>
                  <input type="file" name="newBanner" multiple accept="image/jpeg, image/png, image/jpg" onChange={handleFile} />
                  <div className="edit-upload-icon">🌄</div>
                  <div className="edit-upload-label">Replace Banner (Optional)</div>
                  <div className="edit-upload-hint">Drag/click to replace all existing banners.</div>
                </label>

                {form.newBanner.length > 0 && (
                  <div className="edit-preview-grid">
                    {form.newBanner.map((img, i) => (
                      <div key={i} className="edit-preview-item banner">
                        <img src={URL.createObjectURL(img)} alt="new banner preview" />
                        <button type="button" className="edit-preview-remove" onClick={() => removeNewImage("newBanner", i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="edit-actions">
            <button type="button" className="edit-cancel-btn" onClick={() => navigate("/VendorTurfList")} disabled={saving}>
              Discard Changes
            </button>
            <button type="submit" className="edit-submit-btn" disabled={saving}>
              {saving ? "🔄 Saving Updates..." : "✅ Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
