// src/components/BookingItem.js
import React from 'react';
// Assuming the main styling is in BookingList.css
import './BookingItem.css'
import { IoLocationOutline } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";
const BookingItem = ({ booking, onClick }) => {
  return (
    <div className="booking-item" onClick={onClick}>
      <div className={`icon ${booking.status}`}>
        <img src={booking.image} alt="" />
        </div> {/* Placeholder for image/icon */}
      <div className="details">
        <p className="name">{booking.name}</p>
        <section>
          <p className="date"><IoLocationOutline className='i'/>{booking.location}</p>
        <p className="date"><LuCalendarDays className='i'/>{booking.date}</p>
        </section>
      </div>
  
    </div>
  );
};

export default BookingItem;