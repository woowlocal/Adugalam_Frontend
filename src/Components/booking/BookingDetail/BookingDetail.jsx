// src/components/BookingDetail.js
import React from 'react';
import './BookingDetail.css';
import { FaChevronLeft } from 'react-icons/fa';

const BookingDetail = ({ booking, onCancelClick, onBack }) => {
  const isUpcoming = booking.status === 'upcoming';

  return (
    <div className="booking-detail-container">
      <div className="detail-header">
              <button className='back-btn' onClick={onBack}> <FaChevronLeft  className='back-icon'/> </button>

        <h3>Booking Details</h3>
      </div>
      <div className="detail-hero">
       <img src={booking.image} alt="" />
      </div>

      <div className="detail-content">
        <h4>{booking.name}</h4>
        <p>Date: {booking.date}</p>
        <p>Location: City Center Park</p>
        <p>Price: $45.00</p>
        {/* ... More details ... */}
      </div>

      <div className="detail-footer">
        {isUpcoming && (
          <button className="cancel-button" onClick={onCancelClick}>
            Cancel Booking
          </button>
        )}
        {!isUpcoming && (
          <p className="status-note">This booking is **Completed** and cannot be cancelled.</p>
        )}
      </div>
    </div>
  );
};

export default BookingDetail;