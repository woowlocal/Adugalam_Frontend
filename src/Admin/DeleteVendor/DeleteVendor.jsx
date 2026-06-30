import React, { useEffect, useState } from "react";
import "./DeleteVendor.css";

const DeleteVendor = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/admin/vendor-retire-requests/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load retire requests", err);
      setRequests([]); // Clear data on error
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        alert('Server offline. Please start backend: cd Backend\\\\turf_backend & python manage.py runserver 8000');
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (vendorId) => {
    if (!window.confirm("Approve retirement? Vendor turfs will be hidden.")) return;
    try {
      const token = localStorage.getItem("access");
      await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendors/retire/${vendorId}/approve/`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchRequests();
    } catch (err) {
      alert("Approve failed");
    }
  };

  const handleReject = async (vendorId) => {
    if (!window.confirm("Reject request?")) return;
    try {
      const token = localStorage.getItem("access");
      await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendors/retire/${vendorId}/reject/`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchRequests();
    } catch (err) {
      alert("Reject failed");
    }
  };

  if (loading) return <div className="vendor-request-page">Loading retire requests...</div>;

  return (
    <div className="vendor-request-page">
      <h2>Vendor Retirement Requests ({requests.length})</h2>

      <table className="vendor-table">
        <thead>
          <tr>
            <th>Vendor ID</th>
            <th>Venue</th>
            <th>Owner</th>
            <th>Email/Phone</th>
            <th>Reason</th>
            <th>Requested</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.vendor_id}>
              <td className="vendor-id">{req.vendor_id}</td>
              <td>{req.venuename}</td>
              <td>{req.ownername}</td>
              <td>{req.email}<br/><small>{req.phone}</small></td>
              <td className="reason">{req.reason}</td>
              <td>{new Date(req.requested_at).toLocaleDateString()}</td>
              <td>
                <button className="approve-btn" onClick={() => handleApprove(req.vendor_id)}>
                  Retire ✓
                </button>
                <button className="reject-btn" onClick={() => handleReject(req.vendor_id)}>
                  Reject ✗
                </button>
              </td>
            </tr>
          ))}
          {requests.length === 0 && (
            <tr>
              <td colSpan="7" className="no-vendors">No pending retirement requests</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeleteVendor;