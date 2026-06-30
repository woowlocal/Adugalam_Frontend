import "./VendorList.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${API_BASE}/api/vendors/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVendors(data);
    } catch (error) {
      console.error("Error loading vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  /* Status Toggle with confirmation */
  const toggleStatus = async (id, status) => {
    const newStatus = status === "Approved" ? "Inactive" : "Approved";
    const action = newStatus === "Approved" ? "activate" : "deactivate";

    if (!window.confirm(`Are you sure you want to ${action} this vendor? Their turfs will ${newStatus === "Approved" ? "appear" : "not appear"} in user pages.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("access");
      await fetch(`${API_BASE}/api/vendors/status/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      loadVendors();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="vendor-list-page">
        <p>Loading vendors...</p>
      </div>
    );
  }

  return (
    <div className="vendor-list-page">
      <h2>Vendor List</h2>

      <table className="vendor-table">
        <thead>
          <tr>
            <th>Venue</th>
            <th>Owner</th>
            <th>Email</th>
            <th>Phone</th>
            <th>District</th>
            <th>Turfs</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((v) => (
            <tr key={v.vendor_id}>
              <td data-label="Venue">{v.venuename}</td>
              <td data-label="Owner">{v.ownername}</td>
              <td data-label="Email">{v.email || "-"}</td>
              <td data-label="Phone">{v.phone}</td>
              <td data-label="District">{v.location}</td>
              <td data-label="Turfs">{v.totalturf}</td>

              <td data-label="Status">
                <button
                  className={
                    v.status === "Approved"
                      ? "status-on"
                      : "status-off"
                  }
                  style={{
                    backgroundColor: v.status === "Approved" ? "#22c55e" : "#ef4444",
                    color: "white"
                  }}
                  onClick={() =>
                    toggleStatus(v.vendor_id, v.status)
                  }
                  title={v.status === "Approved" ? "Click to deactivate (turf visible but unbookable)" : "Click to activate (turf fully bookable)"}
                >
                  {v.status === "Approved" ? "ON" : "OFF"}
                </button>
              </td>

              <td data-label="Edit">
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/vendor-edit/${v.vendor_id}`)
                  }
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {vendors.length === 0 && (
        <p className="no-vendors">No vendors found</p>
      )}
    </div>
  );
}