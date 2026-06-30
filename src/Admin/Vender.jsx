import { useEffect, useState } from "react";
import "./VenderManagement.css";

export default function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors`
      );
      const data = await res.json();
      if (data.success) setVendors(data.vendors);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure to ${status} this vendor?`)) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (data.success) fetchVendors();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-page">
      <h1>Vendor Management</h1>
      <p className="subtitle">
        Approve, reject, enable or disable turf vendors
      </p>

      <table className="vendor-table">
        <thead>
          <tr>
            <th>Vendor Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Turf Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {vendors.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No vendors found
              </td>
            </tr>
          ) : (
            vendors.map((v) => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.email}</td>
                <td>{v.phone}</td>
                <td>{v.turfName}</td>
                <td>
                  <span
                    className={`vendor-status ${v.status.toLowerCase()}`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="vendor-actions">
                  {v.status === "Pending" && (
                    <>
                      <button
                        className="approve"
                        onClick={() =>
                          updateStatus(v._id, "Approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="reject"
                        onClick={() =>
                          updateStatus(v._id, "Rejected")
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {v.status === "Active" && (
                    <button
                      className="disable"
                      onClick={() =>
                        updateStatus(v._id, "Disabled")
                      }
                    >
                      Disable
                    </button>
                  )}

                  {v.status === "Disabled" && (
                    <button
                      className="enable"
                      onClick={() =>
                        updateStatus(v._id, "Active")
                      }
                    >
                      Enable
                    </button>
                  )}

                  <button className="view">View</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
