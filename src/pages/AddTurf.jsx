import { useState } from "react";
import "./addTurf.css";

const fields = [
  { label: "Turf Name", name: "turfName", placeholder: "Enter turf name" },
  { label: "Owner Name", name: "ownerName", placeholder: "Enter owner name" },
  { label: "Location", name: "location", placeholder: "Enter location" },
  {
    label: "How Many Turf",
    name: "turfCount",
    type: "number",
    placeholder: "Enter count",
  },
  {
    label: "Turf Amount",
    name: "price",
    type: "number",
    placeholder: "Enter amount",
  },
];

const AddTurf = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/turfs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("Turf added successfully");
        setForm({});
      } else {
        alert("Failed to add turf");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addturf-page">
      <h2>Add Turf</h2>

      <form onSubmit={handleSubmit} className="addturf-form">
        {fields.map((field) => (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type={field.type || "text"}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name] || ""}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Turf"}
        </button>
      </form>
    </div>
  );
};

export default AddTurf;
