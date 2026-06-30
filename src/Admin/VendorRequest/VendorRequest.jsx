import React, { useEffect, useState } from "react";
import "./VendorRequest.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");

const VendorRequest = () => {
  const [requests, setRequests] = useState([]);

  /* -------- Fetch ALL Vendor Requests (Pending/Approved/Rejected) -------- */

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/vendors/pending/`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load vendors", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* -------- Approve Vendor -------- */
  const handleApprove = async (id) => {
    try {
      await fetch(
        `${API_BASE}/api/vendors/approve/${id}/`,
        { method: "PUT" }
      );
      fetchRequests();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  /* -------- Reject Vendor -------- */
  const handleReject = async (id) => {
    try {
      await fetch(
        `${API_BASE}/api/vendors/reject/${id}/`,
        { method: "PUT" }
      );
      fetchRequests();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  return (
    <div className="vendor-request-page">
      <h2>All Vendor Requests</h2>


      <table className="vendor-table">
        <thead>
          <tr>
            <th>Vendor ID</th>
            <th>Venue</th>
            <th>Owner</th>
            <th>Email</th>
            <th>Phone</th>
            <th>District</th>
            <th>Total Turf</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((v) => (
            <tr key={v.id}>
              <td className="vendor-id" data-label="Vendor ID">{v.vendor_id}</td>
              <td data-label="Venue">{v.venuename}</td>
              <td data-label="Owner">{v.ownername}</td>
              <td data-label="Email">{v.email || "-"}</td>
              <td data-label="Phone">{v.phone}</td>
              <td data-label="District">{v.location}</td>
              <td data-label="Total Turf">{v.totalturf}</td>

              <td className={`status-${v.status?.toLowerCase()}`} data-label="Status">
                {v.status}
              </td>

              <td data-label="Action">
                {v.status === "Pending" && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(v.id)}
                    >
                      Approve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => handleReject(v.id)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {requests.length === 0 && (
            <tr>
              <td colSpan="8">No vendor requests found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VendorRequest;

