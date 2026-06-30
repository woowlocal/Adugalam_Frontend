import { useEffect, useState } from "react";
import "./AdminSettings.css";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    commission: "",
    cancelWindow: "",
    autoCancel: "Enable",
    vendorApproval: "Manual Approval",
    maxTurfs: "",
    maintenance: "Off",
    currency: "INR",
  });

  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/settings`
        );
        const data = await res.json();

        if (data.success) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };

    fetchSettings();
  }, []);

  
  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/settings`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Settings updated successfully");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <h1>Admin Settings</h1>
      <p className="subtitle">Configure application level settings</p>

      <div className="settings">
        
        <div className="card">
          <h3>Commission Settings</h3>

          <label>Admin Commission (%)</label>
          <input
            type="number"
            name="commission"
            value={settings.commission}
            onChange={handleChange}
          />

          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        
        <div className="card">
          <h3>Booking Settings</h3>

          <label>Cancellation Window (Hours)</label>
          <input
            type="number"
            name="cancelWindow"
            value={settings.cancelWindow}
            onChange={handleChange}
          />

          <label>Auto Cancel Unpaid Bookings</label>
          <select
            name="autoCancel"
            value={settings.autoCancel}
            onChange={handleChange}
          >
            <option>Enable</option>
            <option>Disable</option>
          </select>

          <button onClick={handleSave}>Save</button>
        </div>

        
        <div className="card">
          <h3>Vendor Controls</h3>

          <label>Vendor Approval</label>
          <select
            name="vendorApproval"
            value={settings.vendorApproval}
            onChange={handleChange}
          >
            <option>Manual Approval</option>
            <option>Auto Approval</option>
          </select>

          <label>Max Turfs Per Vendor</label>
          <input
            type="number"
            name="maxTurfs"
            value={settings.maxTurfs}
            onChange={handleChange}
          />

          <button onClick={handleSave}>Save</button>
        </div>

        
        <div className="card">
          <h3>System Settings</h3>

          <label>Maintenance Mode</label>
          <select
            name="maintenance"
            value={settings.maintenance}
            onChange={handleChange}
          >
            <option>Off</option>
            <option>On</option>
          </select>

          <label>Default Currency</label>
          <select
            name="currency"
            value={settings.currency}
            onChange={handleChange}
          >
            <option>INR</option>
            <option>USD</option>
          </select>

          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </main>
  );
}
