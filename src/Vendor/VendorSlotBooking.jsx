import { useEffect, useState } from "react";
import "./VendorSlotBooking.css";

const API = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "") + "/api";

const VendorSlotBooking = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  
  const [slots, setSlots] = useState([]);
  const [bookedSlotIds, setBookedSlotIds] = useState(new Set());
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [slotLoading, setSlotLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const [isManualBookModalOpen, setIsManualBookModalOpen] = useState(false);
  const [manualCustomerName, setManualCustomerName] = useState("");
  const [manualCustomerMobile, setManualCustomerMobile] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { 
      setPageLoading(false); 
      return; 
    }
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API}/vendor/my-turfs/`, { headers })
      .then(r => r.json())
      .then(turfData => {
        const fetchedTurfs = Array.isArray(turfData) ? turfData : [];
        setTurfs(fetchedTurfs);
        if (fetchedTurfs.length > 0) {
          setSelectedTurf(fetchedTurfs[0].id.toString());
        }
      })
      .catch(err => console.error("Error fetching turfs:", err))
      .finally(() => setPageLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedTurf || !selectedDate) return;
    setSlotLoading(true);
    fetch(`${API}/turf-slots/?turf_id=${selectedTurf}&date=${selectedDate}`)
      .then(r => r.json())
      .then(data => {
        const slotsArray = Array.isArray(data) ? data : (data.slots || []);
        setSlots(slotsArray);
        const booked = slotsArray.filter(s => !s.is_available).map(s => s.id);
        setBookedSlotIds(new Set(booked));
        setSelectedSlots(new Set());
      })
      .catch(err => console.error("Error fetching slots:", err))
      .finally(() => setSlotLoading(false));
  }, [selectedTurf, selectedDate]);

  const toggleSlotSelection = (slotId) => {
    if (bookedSlotIds.has(slotId)) return;
    const newSelected = new Set(selectedSlots);
    if (newSelected.has(slotId)) newSelected.delete(slotId);
    else newSelected.add(slotId);
    setSelectedSlots(newSelected);
  };

  const handleManualBookingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await fetch(`${API}/vendor/bookings/manual/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          turf_id: selectedTurf,
          slot_ids: Array.from(selectedSlots),
          date: selectedDate,
          user_name: manualCustomerName || "Manual Vendor Booking",
          user_mobile: manualCustomerMobile
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsManualBookModalOpen(false);
        setManualCustomerName("");
        setManualCustomerMobile("");
        setSelectedSlots(new Set());
        // Refetch slots
        const slotsRes = await fetch(`${API}/turf-slots/?turf_id=${selectedTurf}&date=${selectedDate}`);
        const slotsData = await slotsRes.json();
        const slotsArray = Array.isArray(slotsData) ? slotsData : (slotsData.slots || []);
        setSlots(slotsArray);
        const booked = slotsArray.filter(s => !s.is_available).map(s => s.id);
        setBookedSlotIds(new Set(booked));
      } else {
        alert(data.error || "Failed to book slot");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing manual booking");
    }
  };

  if (pageLoading) {
    return <div className="slot-loading">Loading...</div>;
  }

  return (
    <div className="slot-booking-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Slot Booking</h1>
          <p className="page-sub">View and manually book slots for your turfs</p>
        </div>
        <div className="slot-controls">
          <select 
            className="slot-turf-select"
            value={selectedTurf}
            onChange={(e) => setSelectedTurf(e.target.value)}
          >
            {turfs.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input 
            type="date" 
            className="slot-date-select" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="slot-manager-card">
        {slotLoading ? (
          <div className="slot-loading">Loading slots...</div>
        ) : slots.length > 0 ? (
          <div className="dash-slot-grid">
            {slots.map(s => {
              const isBooked = bookedSlotIds.has(s.id);
              const isSelected = selectedSlots.has(s.id);
              return (
                <div 
                  key={s.id} 
                  className={`dash-slot-item ${isBooked ? "dash-slot-booked" : (isSelected ? "dash-slot-selected" : "dash-slot-avail")}`}
                  onClick={() => !isBooked && toggleSlotSelection(s.id)}
                >
                  <div className="slot-time">{s.start_time.substring(0,5)} - {s.end_time.substring(0,5)}</div>
                  <div className="slot-status-text">{isBooked ? "Booked" : "₹" + s.price}</div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="slot-loading" style={{ color: "#6b7280" }}>
            No slots found for this date.
          </div>
        )}

        {selectedSlots.size > 0 && (
          <div className="slot-action-row">
            <span>{selectedSlots.size} slot(s) selected</span>
            <button className="sb-btn sb-btn-primary" onClick={() => setIsManualBookModalOpen(true)}>Book Manually</button>
          </div>
        )}
      </div>

      {isManualBookModalOpen && (
        <div className="sb-modal-overlay">
          <div className="sb-modal-content">
            <div className="sb-modal-header">
              <h2>Confirm Manual Booking</h2>
              <button className="sb-modal-close" onClick={() => setIsManualBookModalOpen(false)}>×</button>
            </div>
            <div className="sb-modal-body">
              <form onSubmit={handleManualBookingSubmit} className="sb-manual-form">
                <label className="sb-field-label">Customer Name</label>
                <input 
                  type="text" 
                  className="sb-input" 
                  placeholder="Enter customer name" 
                  value={manualCustomerName}
                  onChange={(e) => setManualCustomerName(e.target.value)}
                  required
                />
                <label className="sb-field-label">Customer Mobile</label>
                <input 
                  type="text" 
                  className="sb-input" 
                  placeholder="Enter customer mobile (optional)" 
                  value={manualCustomerMobile}
                  onChange={(e) => setManualCustomerMobile(e.target.value)}
                />
                <div className="sb-form-actions">
                  <button type="button" className="sb-btn sb-btn-outline" onClick={() => setIsManualBookModalOpen(false)}>Cancel</button>
                  <button type="submit" className="sb-btn sb-btn-primary">Confirm Booking</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorSlotBooking;
