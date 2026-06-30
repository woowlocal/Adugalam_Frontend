import "./TurfManagement.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TurfManagement() {
  const navigate = useNavigate();

  const [turfs, setTurfs] = useState([]);
  const [form, setForm] = useState({
    name: "",
    vendor: "",
    location: "",
    price: ""
  });

  useEffect(() => {
    fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/turfs`)
      .then(res => res.json())
      .then(data => setTurfs(data))
      .catch(err => console.error(err));
  }, []);

  const addTurf = async () => {
    const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/turfs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const newTurf = await res.json();
    setTurfs([...turfs, newTurf]);
    setForm({ name: "", vendor: "", location: "", price: "" });
  };

  const toggleAvailability = async (id) => {
    const res = await fetch(
      `${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/turfs/${id}/toggle`,
      { method: "PUT" }
    );
    const updated = await res.json();
    setTurfs(turfs.map(t => (t._id === id ? updated : t)));
  };

  return (
    <div className="turf-management">
      <div className="header">
        <div className="header-row">

          <h1 className="turf-manage">Turf Management</h1>
          <p>Add, monitor and control all registered turfs</p>


          <button
            className="vendor-btn"
            onClick={() => navigate("/AddVendor")}
          >
            Add Vendor
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Add New Turf</h3>

        <input
          placeholder="Turf Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Vendor"
          value={form.vendor}
          onChange={e => setForm({ ...form, vendor: e.target.value })}
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price / Hour"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />

        <button onClick={addTurf}>Add Turf</button>
      </div>

      <div className="card">
        <h3>Registered Turfs</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Vendor</th>
              <th>Location</th>
              <th>Price</th>
              <th>Status</th>
              <th>Availability</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {turfs.map(turf => (
              <tr key={turf._id}>
                <td>{turf.name}</td>
                <td>{turf.vendor}</td>
                <td>{turf.location}</td>
                <td>₹{turf.price}</td>
                <td>
                  <span className={`status ${turf.status}`}>
                    {turf.status}
                  </span>
                </td>
                <td>
                  {turf.available ? (
                    <span className="open">Open</span>
                  ) : (
                    <span className="closed">Closed</span>
                  )}
                </td>
                <td>
                  <button onClick={() => toggleAvailability(turf._id)}>
                    {turf.available ? "Close Turf" : "Open Turf"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
