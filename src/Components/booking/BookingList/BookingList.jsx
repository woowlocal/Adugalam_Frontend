import React from "react";
import { useBookingStore } from "../../../Store/BookingStore";
import BookingItem from "../BookingItem/BookingItem";
import TabBar from "../Tabbar/Tabpar";
import './BookingList.css'

const BookingList = () => {
  const {
    bookings,
    activeTab,
    setActiveTab,
    selectBooking,
  } = useBookingStore();

  const filtered = bookings.filter((b) => b.status === activeTab);

  return (
    <div className="booking-list-container">
      <h2 className="list-header">Booking</h2>

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="booking-items">
        {filtered.map((b) => (
          <BookingItem
            key={b.id}
            booking={b}
            onClick={() => selectBooking(b)}
          />
        ))}
      </div>
    </div>
  );
};

export default BookingList;
