import "./PartnerForm.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* District list */
const LOCATIONS = [
  "Tirunelveli",
  "Kanniyakumari",
  "Virudhunagar",
  "Tenkasi",
  "Thoothukudi",
  "Madurai"
];

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
  const [successId, setSuccessId] = useState(null);

  const gamesList = ["Cricket", "Football", "Badminton", "Tennis", "Others"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  /* Validation */
  const validate = () => {
    const newErrors = {};

    if (!form.venuename.trim()) newErrors.venuename = "Venue name required";
    if (!form.ownername.trim()) newErrors.ownername = "Owner name required";
    if (!form.email.trim()) newErrors.email = "Email required";
    if (!form.phone.trim()) newErrors.phone = "Phone required";
    if (!form.location) newErrors.location = "District required";
    if (!form.totalturf) newErrors.totalturf = "Select total turf";
    if (!form.address.trim()) newErrors.address = "Address required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode required";
    if (form.availablegames.length === 0)
      newErrors.availablegames = "Select at least one game";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendors/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      // ⭐ Show success modal
      setSuccessId(data.vendor_id);

    } catch (err) {
      alert("Server not reachable");
    }
  };

  return (
    <div className="vendor-page">
      <div className="vendor-card">
        <h3 className="vendor-title">Create Vendor</h3>

        <form className="vendor-form-grid" onSubmit={handleSubmit}>

          {/* Venue Name */}
          <div className="vendor-field">
            <label>Venue Name*</label>
            <input
              name="venuename"
              value={form.venuename}
              onChange={handleChange}
              className={errors.venuename ? "error-input" : ""}
            />
            {errors.venuename && (
              <span className="error-text">{errors.venuename}</span>
            )}
          </div>

          {/* Owner Name */}
          <div className="vendor-field">
            <label>Owner Name*</label>
            <input
              name="ownername"
              value={form.ownername}
              onChange={handleChange}
              className={errors.ownername ? "error-input" : ""}
            />
            {errors.ownername && (
              <span className="error-text">{errors.ownername}</span>
            )}
          </div>

          {/* Email */}
          <div className="vendor-field">
            <label>Email*</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className="vendor-field">
            <label>Phone*</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? "error-input" : ""}
            />
            {errors.phone && (
              <span className="error-text">{errors.phone}</span>
            )}
          </div>

          {/* District */}
          <div className="vendor-field">
            <label>District*</label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className={errors.location ? "error-input" : ""}
            >
              <option value="">Select District</option>
              {LOCATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.location && (
              <span className="error-text">{errors.location}</span>
            )}
          </div>

          {/* Total Turf */}
          <div className="vendor-field">
            <label>Total Turf*</label>
            <select
              name="totalturf"
              value={form.totalturf}
              onChange={handleChange}
              className={errors.totalturf ? "error-input" : ""}
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {errors.totalturf && (
              <span className="error-text">{errors.totalturf}</span>
            )}
          </div>

          {/* Address */}
          <div className="vendor-field full">
            <label>Address*</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              className={errors.address ? "error-input" : ""}
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </div>

          {/* Pincode */}
          <div className="vendor-field">
            <label>Pincode*</label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className={errors.pincode ? "error-input" : ""}
            />
            {errors.pincode && (
              <span className="error-text">{errors.pincode}</span>
            )}
          </div>

          {/* Games */}
          <div className="vendor-field full">
            <label>Available Games*</label>
            <div className="games-wrapper">
              {gamesList.map((g) => (
                <label key={g} className="game-chip">
                  <input
                    type="checkbox"
                    value={g}
                    checked={form.availablegames.includes(g)}
                    onChange={handleGameChange}
                  />
                  {g}
                </label>
              ))}
            </div>

            {errors.availablegames && (
              <span className="error-text">{errors.availablegames}</span>
            )}
          </div>

          <button className="vendor-submit-btn">
            Submit Vendor
          </button>

        </form>
      </div>

      {/* ⭐ SUCCESS MODAL */}
      {successId && (
        <div className="success-overlay">
          <div className="success-box">
            <h2>🎉 Request Submitted!</h2>

            <p>Vendor ID: <b>{successId}</b></p>

            <p className="pending-msg">
              Your request is sent to Admin for approval.
            </p>

            <p>
              You will become a <b>Vendor</b> after approval.
            </p>

            <button
              onClick={() => navigate("/")}
              className="success-btn"
            >
              Go to Home
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddVendor;