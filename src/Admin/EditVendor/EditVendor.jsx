import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditVendor.css";  // Assuming CSS exists or will be added

export default function EditVendor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vendor_id: "",
    venuename: "",
    ownername: "",
    phone: "",
    location: "",
    totalturf: "",
    status: "Approved",
    email: "",
    address: "",
    pincode: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) loadVendor(id);
  }, [id]);

  const loadVendor = async (vendorId) => {
    try {
      setLoading(true);
      setError("");
      // Backend uses vendor_id string like "VEN001", route param is vendor_id
      const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendors/code/${vendorId}/`);
      if (!res.ok) throw new Error(`Failed to fetch vendor: ${res.status}`);
      const data = await res.json();

      // Map backend fields to form
      setForm({
        vendor_id: data.vendor_id || vendorId,
        venuename: data.venuename || "",
        ownername: data.ownername || "",
        phone: data.phone || "",
        location: data.location || "",
        totalturf: data.totalturf || "",
        status: data.status || "Approved",
        email: data.email || "",
        address: data.address || "",
        pincode: data.pincode || ""
      });
    } catch (err) {
      setError(err.message);
      console.error("Load vendor error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError("");  // Clear error on change
  };

  const validateForm = () => {
    if (!form.venuename.trim()) return "Venue name required";
    if (!form.ownername.trim()) return "Owner name required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) return "Valid 10-digit phone required";
    if (!form.location.trim()) return "Location required";
    return "";
  };

  const updateVendor = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      // Backend expects PUT /vendors/update/<vendor_id>/
      const res = await fetch(
        `${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendors/update/${form.vendor_id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Update failed: ${res.status}`);
      }

      alert("Vendor updated successfully!");
      navigate("/vendorlist");
    } catch (err) {
      setError(err.message);
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => navigate("/vendorlist");

  if (loading) {
    return (
      <div className="vendor-page">
        <div className="vendor-card">
          <h3>Edit Vendor</h3>
          <p>Loading vendor details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-page">
      <div className="vendor-card">
        <h3>Edit Vendor Details</h3>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Vendor ID</label>
          <input name="vendor_id" value={form.vendor_id} disabled className="disabled-input" />
        </div>

        <div className="form-group">
          <label>Venue Name *</label>
          <input
            name="venuename"
            value={form.venuename}
            onChange={handleChange}
            placeholder="Enter venue name"
          />
        </div>

        <div className="form-group">
          <label>Owner Name *</label>
          <input
            name="ownername"
            value={form.ownername}
            onChange={handleChange}
            placeholder="Enter owner name"
          />
        </div>

        <div className="form-group">
          <label>Phone * (10 digits)</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="1234567890"
          />
        </div>

        <div className="form-group">
          <label>Location/District *</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="District/City"
          />
        </div>

        <div className="form-group">
          <label>Total Turfs</label>
          <input
            name="totalturf"
            type="number"
            min="0"
            value={form.totalturf}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Approved">Approved (Active)</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="form-group">
          <label>Email (Optional)</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="vendor@example.com"
          />
        </div>

        <div className="form-group">
          <label>Address (Optional)</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Full address"
            rows="2"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Pincode (Optional)</label>
            <input
              name="pincode"
              type="number"
              value={form.pincode}
              onChange={handleChange}
              placeholder="600001"
            />
          </div>
        </div>

        <div className="button-group">
          <button
            onClick={updateVendor}
            disabled={saving}
            className="save-btn"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}
