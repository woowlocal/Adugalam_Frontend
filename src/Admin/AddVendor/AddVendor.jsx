import "./AddVendor.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* District list */
const LOCATIONS = ["Tirunelveli", "Kanniyakumari", "Virudhunagar", "Tenkasi", "Thoothukudi",];

const AddVendor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    venuename: "",
    ownername: "",
    email: "",
    phone: "",
    availablegames: [],
    location: "",
    address: "",
    pincode: "",
    totalturf: "",
  });

  const [errors, setErrors] = useState({});

  const gamesList = ["Cricket/Football", "Badminton", "Tennis", "Swimming", "Volleyball", "Basketball", "Golf", "Kabaddi"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  /* Phone: digits only, max 10 */
  const handlePhone = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm({ ...form, phone: digits });
    setErrors((prev) => ({ ...prev, phone: "" }));
  };

  /* Pincode: digits only, max 6 */
  const handlePincode = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setForm({ ...form, pincode: digits });
    setErrors((prev) => ({ ...prev, pincode: "" }));
  };

  /* Cricket & Football linked */
  const handleGameChange = (e) => {
    const { value, checked } = e.target;
    let games = [...form.availablegames];

    if (checked) {
      if (!games.includes(value)) games.push(value);

      if (value === "Cricket" && !games.includes("Football"))
        games.push("Football");

      if (value === "Football" && !games.includes("Cricket"))
        games.push("Cricket");
    } else {
      games = games.filter((g) => g !== value);

      if (value === "Cricket")
        games = games.filter((g) => g !== "Football");

      if (value === "Football")
        games = games.filter((g) => g !== "Cricket");
    }

    setForm({ ...form, availablegames: games });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ── Validate ── */
    const newErrors = {};

    if (!form.venuename.trim()) newErrors.venuename = "Venue name is required";
    if (!form.ownername.trim()) newErrors.ownername = "Owner name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phone) {
      newErrors.phone = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number starting with 6-9";
    }

    if (!form.location) newErrors.location = "Select a district";
    if (!form.totalturf) newErrors.totalturf = "Select total turf count";
    if (!form.address.trim()) newErrors.address = "Address is required";

    if (!form.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (form.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    if (form.availablegames.length === 0) newErrors.availablegames = "Select at least one game";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendors/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          totalturf: Number(form.totalturf),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error: " + JSON.stringify(data));
        return;
      }

      alert("Vendor Added ID: " + data.vendor_id);

      // Redirect to Vendor Request page
      navigate("/vendorRequest");

    } catch (err) {
      alert("Server not reachable");
    }
  };

  return (
    <div className="vendor-page">
      <div className="vendor-card">
        <h3 className="vendor-title">Create Vendor</h3>

        <form className="vendor-form-grid" onSubmit={handleSubmit} noValidate>
          <div className="vendor-field">
            <label>Venue Name</label>
            <input
              name="venuename"
              value={form.venuename}
              onChange={handleChange}
              className={errors.venuename ? "input-error" : ""}
            />
            {errors.venuename && <span className="field-error">{errors.venuename}</span>}
          </div>

          <div className="vendor-field">
            <label>Owner Name</label>
            <input
              name="ownername"
              value={form.ownername}
              onChange={handleChange}
              className={errors.ownername ? "input-error" : ""}
            />
            {errors.ownername && <span className="field-error">{errors.ownername}</span>}
          </div>

          <div className="vendor-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="vendor-field">
            <label>Phone</label>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handlePhone}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="vendor-field">
            <label>District</label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className={errors.location ? "input-error" : ""}
            >
              <option value="">Select District</option>
              {LOCATIONS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.location && <span className="field-error">{errors.location}</span>}
          </div>

          <div className="vendor-field">
            <label>Total Turf</label>
            <select
              name="totalturf"
              value={form.totalturf}
              onChange={handleChange}
              className={errors.totalturf ? "input-error" : ""}
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {errors.totalturf && <span className="field-error">{errors.totalturf}</span>}
          </div>

          <div className="vendor-field full">
            <label>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className={errors.address ? "input-error" : ""}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          <div className="vendor-field">
            <label>Pincode</label>
            <input
              name="pincode"
              type="tel"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit pincode"
              value={form.pincode}
              onChange={handlePincode}
              className={errors.pincode ? "input-error" : ""}
            />
            {errors.pincode && <span className="field-error">{errors.pincode}</span>}
          </div>

          <div className="vendor-field full">
            <label>Available Games</label>
            <div className="games-wrapper">
              {gamesList.map((g) => (
                <label key={g} className="game-chip">
                  <input
                    type="checkbox"
                    value={g}
                    checked={form.availablegames.includes(g)}
                    onChange={(e) => { handleGameChange(e); setErrors((prev) => ({ ...prev, availablegames: "" })); }}
                  />
                  {g}
                </label>
              ))}
            </div>
            {errors.availablegames && <span className="field-error">{errors.availablegames}</span>}
          </div>

          <button className="vendor-submit-btn">
            Submit Vendor
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;