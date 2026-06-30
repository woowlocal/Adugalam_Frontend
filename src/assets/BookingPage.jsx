import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingPage.css";
import mainImg from "../assets/main.jpg";
import tennisImg from "../assets/tennis.jpg";
import futsalImg from "../assets/futsal.jpg";

const grounds = [
  { id: 1, name: "Main ground", mini: "Min. 3 hour", img: mainImg },
  { id: 2, name: "Tennis ground", mini: "Min. 1 hour", img: tennisImg },
  { id: 3, name: "Futsal ground", mini: "Min. 2 hour", img: futsalImg },
];

const timeSlots = [
  { id: 1, slot: "06:00 am - 09:00 am" },
  { id: 2, slot: "09:00 am - 12:00 pm" },
  { id: 3, slot: "12:00 pm - 03:00 pm" },
  { id: 4, slot: "03:00 pm - 06:00 pm" },
  { id: 5, slot: "06:00 pm - 09:00 pm" },
  { id: 6, slot: "09:00 pm - 12:00 pm" },
];

const BookingPage = () => {
  const [selectedGround, setSelectedGround] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();   

  const getMissingSelections = () => {
    const missing = [];
    if (!selectedDate) missing.push("Date");
    if (!selectedGround) missing.push("Ground");
    if (!selectedTime) missing.push("Time");
    return missing;
  };

  const getBookingObject = () => {
    const missing = getMissingSelections();
    if (missing.length > 0) {
      setErrorMsg(`Please select: ${missing.join(", ")}`);
      return null;
    }
    setErrorMsg("");
    return {
      date: selectedDate,
      ground: selectedGround,
      time: selectedTime,
    };
  };

  const handleContinue = () => {
    const booking = getBookingObject();
    if (booking) {
      navigate("/summary", { state: booking });
    }
  };

  return (
    <div className="booking-wrapper">
      <div className="header">
        <button className="back-btn">←</button>
        <h2>Booking a ground</h2>
      </div>

      <h4>Select schedule date</h4>
      <div className="calendar-section">
        <h3>November 2025</h3>

        <div className="date-row">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
            <div key={i} className="day-box">
              <span className="day">{d}</span>
            </div>
          ))}
        </div>

        <div className="date-row">
          {[2, 3, 4, 5, 6, 7, 8].map((d, i) => (
            <div
              key={i}
              className={`date-box ${selectedDate === d ? "active" : ""}`}
              onClick={() => setSelectedDate(d)}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
      <h4>Ground list</h4>
      <div className="grounds-container">
        {grounds.map((ground) => (
          <div
            key={ground.id}
            className={`ground-card ${
              selectedGround?.id === ground.id ? "active" : ""
            }`}
            onClick={() => setSelectedGround(ground)}
          >
            <img src={ground.img} alt={ground.name} />
            <div className="ground-info">
              <h5>{ground.name}</h5>
              <p>{ground.mini}</p>
            </div>
          </div>
        ))}
      </div>
      <h4>Select available time</h4>
      <div className="times-container">
        {timeSlots.map((slot) => (
          <div
            key={slot.id}
            className={`time-card ${
              selectedTime?.id === slot.id ? "active" : ""
            }`}
            onClick={() => setSelectedTime(slot)}
          >
            {slot.slot}
          </div>
        ))}
      </div>
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <button className="continue-btn" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default BookingPage;
