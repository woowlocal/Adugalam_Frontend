import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  useParams,
} from "react-router-dom";
import "./BookingGround.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");
const MAX_SLOTS = 3;

const BookingGround = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { turfSlug } = useParams();

  const turfIdFromSlug = turfSlug ? turfSlug.split("--").pop() : null;

  const turfId =
    location.state?.turf_id ||
    turfIdFromSlug ||
    searchParams.get("turf_id");

  // ================= STATES =================
  const [grounds, setGrounds] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const [selectedGround, setSelectedGround] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= NEXT 7 DAYS =================
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");

      days.push({
        label: d.toLocaleDateString("en-IN", { weekday: "short" }),
        day: d.getDate(),
        full: `${yyyy}-${mm}-${dd}`,
      });
    }
    return days;
  };

  const scheduleDays = getNext7Days();

  // ================= LOAD TURFS =================
  useEffect(() => {
    turfId ? fetchSingleTurf(turfId) : fetchTurfs();
  }, [turfId]);

  const fetchTurfs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/turfs/`);
      const data = await res.json();
      const turfs = Array.isArray(data) ? data : data.results || [];
      setGrounds(turfs.filter(t => t.is_approved));
    } catch {
      setErrorMsg("Failed to load grounds");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleTurf = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/turfs/${id}/`);
      const ground = await res.json();
      setGrounds([ground]);
      setSelectedGround(ground);
    } catch {
      setErrorMsg("Failed to load turf");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH SLOTS (24HRS SUPPORT) =================
  const fetchSlots = async (turf_id, date = null) => {
    let url = `${API_BASE}/api/turf-slots/?turf_id=${turf_id}`;
    if (date) url += `&date=${date}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!Array.isArray(data)) {
        setTimeSlots([]);
        return;
      }


      const sorted = data.sort((a, b) =>
        a.start_time.localeCompare(b.start_time)
      );


      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;
      const isToday = date === todayStr;

      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const filtered = isToday
        ? sorted.filter(slot => {
          // start_time is in "HH:MM:SS" or "HH:MM" format
          const [h, m] = slot.start_time.split(":").map(Number);
          const slotMinutes = h * 60 + m;
          return slotMinutes > currentMinutes;
        })
        : sorted;

      const formattedSlots = filtered.map(slot => ({
        ...slot,
        is_booked: slot.is_available === false,
      }));

      setTimeSlots(formattedSlots);

    } catch {
      setErrorMsg("Failed to load slots");
    }
  };

  useEffect(() => {
    if (selectedGround && selectedDate) {
      fetchSlots(selectedGround.id, selectedDate);
    }
  }, [selectedDate, selectedGround]);

  // ================= IMAGE =================
  const getImage = (ground) => {
    const img =
      ground.banner_images?.[0] ||
      ground.gallery_images?.[0] ||
      ground.image;

    if (!img) return "https://via.placeholder.com/300";

    return img.startsWith("http")
      ? img
      : `${API_BASE}${img}`;
  };

  // ================= FORMAT TIME DISPLAY =================
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split("-");
    if (parts.length === 2) {
      const start = parts[0].trim();
      const end = parts[1].trim();
      
      const startIsAM = start.toLowerCase().includes("am");
      const startIsPM = start.toLowerCase().includes("pm");
      const endIsAM = end.toLowerCase().includes("am");
      const endIsPM = end.toLowerCase().includes("pm");

      if (startIsAM && endIsAM) {
        return `${start.replace(/am/i, "").trim()} - ${end}`;
      } else if (startIsPM && endIsPM) {
        return `${start.replace(/pm/i, "").trim()} - ${end}`;
      } else {
        return `${start} - ${end}`;
      }
    }
    return timeStr;
  };

  // ================= SELECT GROUND =================
  const handleGroundSelect = (ground) => {
    setSelectedGround(ground);
    setSelectedTimes([]);
    setSelectedDate(null);
    setTimeSlots([]);
  };

  // ================= SLOT SELECT =================
  const toggleSlot = (slot) => {
    if (slot.is_booked) return;

    const exists = selectedTimes.find(s => s.id === slot.id);

    if (exists) {
      setSelectedTimes(prev =>
        prev.filter(s => s.id !== slot.id)
      );
      return;
    }

    if (selectedTimes.length >= MAX_SLOTS) {
      setErrorMsg("Maximum 3 slots reached");
      return;
    }

    setErrorMsg("");
    setSelectedTimes(prev => [...prev, slot]);
  };

  // ================= BOOKING OBJECT =================
  const calculateTotalPrice = () => {

    const selectedSlots = selectedTimes.map(s => s.id);
    const selectedSlotObjects = timeSlots.filter(s => selectedSlots.includes(s.id));
    const total = selectedSlotObjects.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    return total;
  };

  const getBookingObject = () => {
    if (!selectedDate || !selectedGround || selectedTimes.length === 0) {
      setErrorMsg("Select Date and Slot");
      return null;
    }

    return {
      turf_id: selectedGround.id,
      turf_name: selectedGround.name,
      image: getImage(selectedGround),
      slot_ids: selectedTimes.map(s => s.id),
      date: selectedDate,
      slots: selectedTimes,
      total_price: selectedTimes.reduce(
        (sum, s) => sum + s.price,
        0
      ),
    };
  };

  const handleContinue = () => {
    const booking = getBookingObject();
    if (booking) {
      if (turfSlug) {
        navigate(`/book/${turfSlug}/BookingGround/cart`, { state: { booking } });
      } else {
        navigate("/cart", { state: { booking } });
      }
    }
  };

  if (loading) return <div>Loading...</div>;


  return (
    <div className="booking-wrapper">



      <div className="header">
        <h2>Booking a ground</h2>
      </div>

      <h4>Select schedule date</h4>

      <div className="calendar-strip">
        {scheduleDays.map(d => (
          <div
            key={d.full}
            className={`calendar-card ${selectedDate === d.full ? "active" : ""}`}
            onClick={() => {
              setSelectedDate(d.full);
              setSelectedTimes([]);
            }}
          >
            <div className="date-number">{d.day}</div>
            <div className="date-day">{d.label}</div>
          </div>
        ))}
      </div>

      <h4>Select your ground</h4>

      <div className="grounds-container">
        {grounds.map(ground => (
          <div
            key={ground.id}
            className={`ground-card ${selectedGround?.id === ground.id ? "active" : ""}`}
            onClick={() => handleGroundSelect(ground)}
          >
            <img src={getImage(ground)} alt="" />
            <div className="ground-info">
              <h5>{ground.name}</h5>
              <p>₹{ground.price_per_hour}/hr</p>
            </div>
          </div>
        ))}
      </div>

      <h4>Select available time (Max 3)</h4>

      <div className="slot-grid">
        {timeSlots.map(slot => {
          const selected =
            selectedTimes.find(s => s.id === slot.id);

          return (
            <div
              key={slot.id}
              className={`slot-box
                ${slot.is_booked ? "booked" : "available"}
                ${selected ? "selected" : ""}
              `}
              onClick={() => toggleSlot(slot)}
            >
              <div>{formatTimeDisplay(slot.time_display)}</div>

              {slot.is_booked && (
                <small className="status-text">Booked</small>
              )}

              <small>₹{slot.price}</small>
            </div>
          );
        })}
      </div>

      <p>Selected Slots: {selectedTimes.length}/3</p>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <button
        className="continue-btn"
        onClick={handleContinue}
        disabled={!selectedDate || selectedTimes.length === 0}
      >
        Continue to Cart
      </button>

    </div>
  );
};

export default BookingGround;