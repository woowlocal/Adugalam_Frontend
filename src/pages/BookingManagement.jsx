import { useState } from "react";
import "./BookingManagement.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([
    {
      id: "#BK101",
      player: "Arun",
      turf: "Turf 1",
      game: "Football",
      date: "20-09-2025",
      time: "06:00 - 07:00",
      payment: "Paid",
      refund: "-",
      status: "Pending",
    },
    {
      id: "#BK102",
      player: "Ravi",
      turf: "Turf 2",
      game: "Cricket",
      date: "20-09-2025",
      time: "08:00 - 09:00",
      payment: "Paid",
      refund: "-",
      status: "Approved",
    },
    {
      id: "#BK103",
      player: "Suresh",
      turf: "Turf 3",
      game: "Badminton",
      date: "21-09-2025",
      time: "05:00 - 06:00",
      payment: "Failed",
      refund: "Refunded",
      status: "Rejected",
    },
  ]);

  /* ---------------- API PLACEHOLDERS ---------------- */

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/update`, {
        method: "POST", // or PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (error) {
      console.error("API Error", error);
    }
  };

  const handleApprove = (id) => updateBookingStatus(id, "Approved");
  const handleReject = (id) => updateBookingStatus(id, "Rejected");
  const handleCancel = (id) => updateBookingStatus(id, "Cancelled");

 

  return (
    <div className="booking-page">
      <h2>Booking Management</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Player Name</th>
              <th>Turf</th>
              <th>Game</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Payment</th>
              <th>Refund</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.player}</td>
                <td>{b.turf}</td>
                <td>{b.game}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>

                <td>
                  <span className={`badge ${b.payment.toLowerCase()}`}>
                    {b.payment}
                  </span>
                </td>

                <td>
                  {b.refund !== "-" ? (
                    <span className="badge refunded">{b.refund}</span>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  <span className={`badge status ${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </td>

                <td className="actions">
                  {b.status === "Pending" && (
                    <>
                      <button
                        className="btn approve"
                        onClick={() => handleApprove(b.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn reject"
                        onClick={() => handleReject(b.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {b.status === "Approved" && (
                    <button
                      className="btn cancel"
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancel
                    </button>
                  )}

                  {b.status === "Rejected" && "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
