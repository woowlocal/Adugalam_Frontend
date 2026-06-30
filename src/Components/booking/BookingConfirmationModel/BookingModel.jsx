// src/components/BookingConfirmation.js
import React from 'react';
import './BookingModel.css'

const BookingConfirmation = ({ onConfirm, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-icon">✅</div> {/* Placeholder icon */}
        <p>Are you sure you want to **cancel this booking**?</p>
        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>
            Close
          </button>
          <button className="primary-button" onClick={onConfirm}>
            **Confirm**
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;