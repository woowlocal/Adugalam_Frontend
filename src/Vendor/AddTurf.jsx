import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTurf.css";
import {
  GoogleMap,
  StandaloneSearchBox,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

const games = ["Cricket/Football", "Badminton", "Tennis", "Swimming", "Volleyball", "Basketball", "Golf", "Kabaddi"];
const amenities = ["Camera", "Parking", "Water", "Toilet"];
const features = ["Indoor", "Outdoor", "Grass Turf"];

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from(
  { length: 60 },
  (_, i) => i.toString().padStart(2, "0")
);
const meridians = ["AM/PM", "AM", "PM"];

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  marginTop: "10px",
};

const defaultCenter = { lat: 11.1271, lng: 78.6569 };

// ✅ Static constant outside component — prevents new array on every render
const LIBRARIES = ["places"];

export default function AddTurf() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    vendorId: "",
    vendorName: "",
    price: "",
    location: "",
    latitude: "",
    longitude: "",
    games: [],
    amenities: [],
    features: [],
    description: "",
    gallery: [],
    banner: [],
    slotMode: "all",
    slots: { all: {} },
    generatedSlots: [],
  });

  const [center, setCenter] = useState(defaultCenter);
  const [showMap, setShowMap] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);

  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: LIBRARIES,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const fetchVendor = async (vendorId) => {
    if (!vendorId) return;

    try {
      const res = await fetch(
        `${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendors/code/${vendorId}/`
      );

      const data = await res.json();

      setForm((p) => ({
        ...p,
        vendorName: data.venuename || "",
      }));
    } catch {
      setForm((p) => ({ ...p, vendorName: "" }));
    }
  };

  const handleRadio = (key, val) =>
    setForm((p) => ({ ...p, [key]: [val] }));


  const processFiles = async (files, name) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    const validFiles = [];

    for (const file of Array.from(files)) {

      // ✅ Type validation
      if (!allowed.includes(file.type)) {
        alert("Only JPG, JPEG, PNG images allowed");
        continue;
      }

      // ✅ Size validation
      if (file.size > maxSize) {
        alert("Image size must be less than 2MB");
        continue;
      }

      validFiles.push(file);
    }

    setForm((p) => ({
      ...p,
      [name]: [...p[name], ...validFiles],
    }));
  };

  const handleFile = (e) => {
    processFiles(e.target.files, e.target.name);
    e.target.value = "";
  };

  const removeImage = (type, index) => {
    setForm((p) => ({
      ...p,
      [type]: p[type].filter((_, i) => i !== index),
    }));
  };

  const toMinutes = (time) => {
    if (!time) return null;
    let { hour, minute, meridian } = time;

    hour = Number(hour);
    minute = Number(minute);

    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;

    return hour * 60 + minute;
  };

  const formatTime = (mins) => {
    let hour = Math.floor(mins / 60);
    let minute = mins % 60;

    const meridian = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute === 0 ? "00" : minute} ${meridian}`;
  };

  const generateSlots = () => {
    const s = form.slots?.all;

    if (!form.price) return alert("Enter price per hour");
    if (!s?.from || !s?.to) return alert("Select start & end time");

    let start = toMinutes(s.from);
    let end = toMinutes(s.to);

    if (start === null || end === null)
      return alert("Invalid time selection");

    if (end <= start) {
      end += 24 * 60;
    }

    const slots = [];
    const pricePerHour = Number(form.price);

    const createId = () => Math.random().toString(36).substring(2, 10);

    let current = start;

    while (current + 60 <= end) {
      const fromTime = current % (24 * 60);
      const toTime = (current + 60) % (24 * 60);

      slots.push({
        id: createId(),
        from: formatTime(fromTime),
        to: formatTime(toTime),
        price: pricePerHour,
        is_booked: false,
      });

      current += 60;
    }

    setForm((p) => ({ ...p, generatedSlots: slots }));
  };

  // Map callbacks
  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const onSearchBoxLoad = (ref) => {
    searchBoxRef.current = ref;
  };

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

    // Reverse geocoding
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setForm((p) => ({
          ...p,
          location: results[0].formatted_address,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));
      } else {
        setForm((p) => ({
          ...p,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6),
        }));
      }
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!form.vendorId) {
      setSubmitError("Vendor ID is required.");
      return;
    }

    if (!form.location) {
      setSubmitError("Please enter a location.");
      return;
    }

    if (!form.latitude || !form.longitude) {
      setSubmitError("Please select a location on the map.");
      return;
    }

    if (form.gallery.length < 3) {
      setSubmitError(`Minimum 3 gallery images required (${form.gallery.length}/3 added).`);
      return;
    }

    if (form.banner.length < 3) {
      setSubmitError(`Minimum 3 banner images required (${form.banner.length}/3 added).`);
      return;
    }

    if (form.games.length === 0) {
      setSubmitError("Please select at least one game.");
      return;
    }

    const formData = new FormData();
    formData.append("vendorId", form.vendorId);
    formData.append("name", form.vendorName);
    formData.append("location", form.location);
    formData.append("latitude", form.latitude);
    formData.append("longitude", form.longitude);
    formData.append("price", Number(form.price));
    formData.append("games", JSON.stringify(form.games));
    formData.append("amenities", JSON.stringify(form.amenities));
    formData.append("features", JSON.stringify(form.features));
    formData.append("description", form.description);
    formData.append("slots", JSON.stringify(form.generatedSlots));

    form.banner.forEach((file) => formData.append("banner_images", file));
    form.gallery.forEach((file) => formData.append("gallery_images", file));

    setSubmitting(true);
    try {
      const res = await fetch(
        `${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendor/turfs/create/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSubmitSuccess("✅ Turf Added Successfully!");
        setTimeout(() => navigate("/Turflist"), 1500);
      } else {
        // Show actual backend error message
        const errMsg =
          data?.error ||
          data?.detail ||
          data?.message ||
          (typeof data === "string" ? data : JSON.stringify(data));
        setSubmitError(`❌ ${errMsg || "Failed to add turf. Please try again."}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError("❌ Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page">
      <h2>Add Turf</h2>

      <form onSubmit={submit} className="form">
        {/* Vendor */}
        <input
          name="vendorId"
          placeholder="Vendor ID"
          onChange={(e) => {
            handleChange(e);
            fetchVendor(e.target.value);
          }}
          required
        />
        <input value={form.vendorName} readOnly />

        {/* Location with Map */}
        <label>Turf Location</label>
        <input
          name="location"
          placeholder="Search location or select on map"
          value={form.location}
          onChange={handleChange}
          required
        />

        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          style={{ marginBottom: "10px" }}
        >
          {showMap ? "Hide Map" : "Show Map to Select Location"}
        </button>

        {showMap && (
          <div className="map-container">
            {/* Search Box */}
            <StandaloneSearchBox
              onLoad={onSearchBoxLoad}
              onPlacesChanged={onPlacesChanged}
            >
              <input
                type="text"
                placeholder="Search for a location..."
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  boxSizing: "border-box",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </StandaloneSearchBox>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              onLoad={onMapLoad}
              onClick={handleMapClick}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>

            {markerPosition && (
              <p style={{ marginTop: "10px", fontSize: "12px" }}>
                📍 Selected: {form.location || "Location selected"}
                <br />
                Lat: {markerPosition.lat.toFixed(6)}, Lng:{" "}
                {markerPosition.lng.toFixed(6)}
              </p>
            )}
          </div>
        )}

        {/* Hidden lat/lng fields */}
        <input type="hidden" name="latitude" value={form.latitude} />
        <input type="hidden" name="longitude" value={form.longitude} />

        {/* Games */}
        <label>Available Games</label>
        <div className="radio-group">
          {games.map((g) => (
            <label key={g} className="radio-chip">
              <input
                type="radio"
                checked={form.games.includes(g)}
                onChange={() => handleRadio("games", g)}
              />
              {g}
            </label>
          ))}
        </div>

        {/* Amenities */}
        <label>Amenities</label>
        <div className="check-row">
          {amenities.map((a) => (
            <label key={a}>
              <input
                type="checkbox"
                checked={form.amenities.includes(a)}
                onChange={() =>
                  setForm((p) => ({
                    ...p,
                    amenities: p.amenities.includes(a)
                      ? p.amenities.filter((x) => x !== a)
                      : [...p.amenities, a],
                  }))
                }
              />
              {a}
            </label>
          ))}
        </div>

        {/* Features */}
        <label>Features</label>
        <div className="check-row">
          {features.map((f) => (
            <label key={f}>
              <input
                type="checkbox"
                checked={form.features.includes(f)}
                onChange={() =>
                  setForm((p) => {
                    let updated = p.features.includes(f)
                      ? p.features.filter((x) => x !== f)
                      : [...p.features, f];

                    if (f === "Indoor") {
                      updated = updated.filter((x) => x !== "Outdoor");
                    }

                    if (f === "Outdoor") {
                      updated = updated.filter((x) => x !== "Indoor");
                    }

                    return { ...p, features: updated };
                  })
                }
              />
              {f}
            </label>
          ))}
        </div>

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Enter turf description"
          value={form.description}
          onChange={handleChange}
          rows={4}
        />

        <label>Amount Per Hours</label>
        <input
          name="price"
          type="number"
          placeholder="Price per hour"
          onChange={handleChange}
        />

        {/* Gallery */}
        <label>Gallery Images</label>
        <input type="file" name="gallery" multiple onChange={handleFile} />
        <div className="preview-row">
          {form.gallery.map((img, i) => (
            <div key={i} className="preview">
              <img src={URL.createObjectURL(img)} alt="" />
              <button type="button" onClick={() => removeImage("gallery", i)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Banner */}
        <label>Banner Images</label>
        <input type="file" name="banner" multiple onChange={handleFile} />
        <div className="preview-row">
          {form.banner.map((img, i) => (
            <div key={i} className="preview banner">
              <img src={URL.createObjectURL(img)} alt="" />
              <button type="button" onClick={() => removeImage("banner", i)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Slot */}
        <h3>Slot Timings</h3>

        <div className="time-row">
          <div className="time-group">
            <label>From</label>
            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      from: { ...p.slots.all?.from, hour: e.target.value },
                    },
                  },
                }))
              }
            >
              <option>Hour</option>
              {hours.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      from: { ...p.slots.all?.from, minute: e.target.value },
                    },
                  },
                }))
              }
            >
              <option>Min</option>
              {minutes.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      from: { ...p.slots.all?.from, meridian: e.target.value },
                    },
                  },
                }))
              }
            >
              {meridians.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="time-group">
            <label>To</label>
            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      to: { ...p.slots.all?.to, hour: e.target.value },
                    },
                  },
                }))
              }
            >
              <option>Hour</option>
              {hours.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      to: { ...p.slots.all?.to, minute: e.target.value },
                    },
                  },
                }))
              }
            >
              <option>Min</option>
              {minutes.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  slots: {
                    all: {
                      ...p.slots.all,
                      to: { ...p.slots.all?.to, meridian: e.target.value },
                    },
                  },
                }))
              }
            >
              {meridians.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="button" onClick={generateSlots}>
          Generate Slots
        </button>

        <div className="slot-preview">
          {form.generatedSlots.map((s, i) => (
            <div key={i} className="slot-chip">
              {s.from} - {s.to} ₹{s.price}
            </div>
          ))}
        </div>
        <button type="submit">Add Turf</button>
      </form>
    </div>
  );
}