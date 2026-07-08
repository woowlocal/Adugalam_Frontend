import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CartPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  //  SAFE ACCESS
  const booking = location.state?.booking;

  //  PREVENT CRASH
  if (!booking) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>No booking found</h2>
        <button onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Cart Page</h2>

      <img src={booking.image} width="200" />

      <h3>{booking.turf_name}</h3>
      <p>Date: {booking.date}</p>

      <h4>Slots:</h4>
      {booking.slots.map(slot => (
        <p key={slot.id}>{slot.time_display}</p>
      ))}

      <h3>Total ₹{booking.total_price}</h3>
    </div>
  );
};

export default CartPage;