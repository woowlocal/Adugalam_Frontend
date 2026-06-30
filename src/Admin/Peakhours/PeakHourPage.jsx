import React, { useState } from "react";
import "./PeakHourPage.css";

/* ── Constants ── */
const DAYS = [
  { id: "Monday",    label: "M" },
  { id: "Tuesday",   label: "T" },
  { id: "Wednesday", label: "W" },
  { id: "Thursday",  label: "T" },
  { id: "Friday",    label: "F" },
  { id: "Saturday",  label: "S" },
  { id: "Sunday",    label: "S" },
];

/* ── Icon Components ── */
const IconHash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const IconTurf = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconTurfBadge = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const IconDollar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconWarning = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);
const IconCheckFull = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const PeakHourPage = () => {
  const [vendorId, setVendorId]         = useState("");
  const [turfs, setTurfs]               = useState([]);
  const [selectedTurf, setSelectedTurf] = useState("");
  
  const [loadingTurfs, setLoadingTurfs] = useState(false);
  const [loadingSave, setLoadingSave]   = useState(false);
  const [errorMsg, setErrorMsg]         = useState("");
  const [successMsg, setSuccessMsg]     = useState("");

  const [config, setConfig] = useState({
    startDate: "",
    endDate: "",
    basePrice: "",
    selectedDays: [],
    peakHours: {},
  });

  /* ── Fetch Turfs ── */
  const fetchTurfs = async () => {
    if (!vendorId) return setErrorMsg("Please enter a Vendor ID.");
    
    setLoadingTurfs(true);
    setErrorMsg(""); setSuccessMsg("");
    setTurfs([]); setSelectedTurf("");

    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/admin/vendor-turfs/${vendorId}/`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch turfs.");

      const results = data.results || data; 
      if (results.length === 0) {
        setErrorMsg("No turfs found for this Vendor.");
      } else {
        setTurfs(results);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoadingTurfs(false);
    }
  };

  /* ── Input Handlers ── */
  const handleDayToggle = (dayId) => {
    setConfig((prev) => {
      const isSelected = prev.selectedDays.includes(dayId);
      const newSelectedDays = isSelected
        ? prev.selectedDays.filter((d) => d !== dayId)
        : [...prev.selectedDays, dayId];

      const newPeakHours = { ...prev.peakHours };
      if (!isSelected && !newPeakHours[dayId]) {
        newPeakHours[dayId] = { start: "10:00", end: "19:00", amount: prev.basePrice || "" };
      }

      return { ...prev, selectedDays: newSelectedDays, peakHours: newPeakHours };
    });
  };

  const handlePeakHourChange = (dayId, field, value) => {
    setConfig((prev) => ({
      ...prev,
      peakHours: {
        ...prev.peakHours,
        [dayId]: { ...prev.peakHours[dayId], [field]: value },
      },
    }));
  };

  /* ── Save / Submit ── */
  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg(""); setSuccessMsg("");

    if (!selectedTurf) return setErrorMsg("Please select a turf.");
    if (!config.startDate || !config.endDate) return setErrorMsg("Start Date and End Date are required.");
    
    const configs = [];
    const startObj = new Date(config.startDate);
    const endObj = new Date(config.endDate);

    if (endObj < startObj) return setErrorMsg("End Date cannot be before Start Date.");

    // Loop dates
    for (let d = new Date(startObj); d <= endObj; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      if (config.selectedDays.includes(dayName)) {
        const hours = config.peakHours[dayName];
        if (hours && hours.start && hours.end && hours.amount) {
          configs.push({
            date: d.toISOString().split("T")[0],
            start: hours.start,
            end: hours.end,
            amount: hours.amount,
          });
        }
      }
    }

    if (configs.length === 0) return setErrorMsg("No peak hours configured for the selected dates and days.");

    setLoadingSave(true);
    try {
      const token = localStorage.getItem("access");
      const payload = { turf_id: selectedTurf, configs };

      const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/admin/set-peak-hours/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save peak hours.");

      setSuccessMsg("Peak hours saved successfully!");
      // Reset form
      setConfig({ startDate: "", endDate: "", basePrice: "", selectedDays: [], peakHours: {} });
      setVendorId(""); setSelectedTurf(""); setTurfs([]);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoadingSave(false);
    }
  };


  /* ═══════════════════════════════════════════════════════════
     JSX
  ═══════════════════════════════════════════════════════════ */
  return (
    <div className="ph-page">
      <div className="ph-wrap">
        
        {/* ══ HERO HEADER ══ */}
        <div className="ph-hero">
          <div className="ph-hero-shimmer" aria-hidden="true" />
          <div className="ph-hero-orb ph-hero-orb-1" aria-hidden="true" />
          <div className="ph-hero-orb ph-hero-orb-2" aria-hidden="true" />
          
          <div className="ph-hero-text">
            <div className="ph-hero-eyebrow">⚙️ Admin Panel</div>
            <h1 className="ph-hero-title">Peak Hours Management</h1>
            <p className="ph-hero-sub">Define dynamic pricing and peak hour configurations for turfs</p>
          </div>

          <div className="ph-hero-right">
            <div className="ph-hero-badge-group">
              <span className="ph-hero-badge ph-hero-badge--primary">
                <span className="ph-live-dot" />
                Dynamic Pricing
              </span>
              <span className="ph-hero-badge ph-hero-badge--secondary">
                <IconTurfBadge />
                Turf Settings
              </span>
            </div>
          </div>
        </div>

        {/* ══ MESSAGES ══ */}
        {errorMsg && (
          <div className="ph-msg ph-msg--error">
            <IconWarning /> {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="ph-msg ph-msg--success">
            <IconCheckFull /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSave}>
          
          {/* ══ SECTION 1: TURF SELECTION ══ */}
          <div className="ph-section-header">
            <h2 className="ph-section-title">Turf Selection</h2>
            <span className="ph-section-sub">Find and select a vendor's turf</span>
          </div>

          <div className="ph-glass-card" style={{ animationDelay: "0.05s" }}>
            <div className="ph-card-header-row">
              <div>
                <h3 className="ph-card-title">Vendor &amp; Turf</h3>
                <p className="ph-card-sub">Search by Vendor ID to list all associated turfs</p>
              </div>
              <span className="ph-card-badge ph-card-badge--blue">Step 1</span>
            </div>

            <div className="ph-form-grid">
              <div className="ph-field">
                <label><IconHash /> Vendor ID</label>
                <div className="ph-input-group">
                  <input
                    type="text"
                    placeholder="e.g. VEN001"
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="ph-btn-fetch"
                    onClick={fetchTurfs} 
                    disabled={loadingTurfs || !vendorId}
                  >
                    {loadingTurfs ? <span className="ph-spinner-sm" /> : <IconSearch />}
                    {loadingTurfs ? "Wait…" : "Search"}
                  </button>
                </div>
              </div>

              {turfs.length > 0 && (
                <div className="ph-field">
                  <label><IconTurf /> Select Turf</label>
                  <select
                    value={selectedTurf}
                    onChange={(e) => setSelectedTurf(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a Turf --</option>
                    {turfs.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.location})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* ══ SECTION 2: CALENDAR CONF ══ */}
          <div className="ph-section-header">
            <h2 className="ph-section-title">Date &amp; Base Settings</h2>
            <span className="ph-section-sub">Set the active date range</span>
          </div>

          <div className="ph-glass-card" style={{ animationDelay: "0.10s" }}>
            <div className="ph-card-header-row">
              <div>
                <h3 className="ph-card-title">Configuration Period</h3>
                <p className="ph-card-sub">Select start and end dates, and an optional fallback price</p>
              </div>
              <span className="ph-card-badge ph-card-badge--amber">Step 2</span>
            </div>

            <div className="ph-form-grid">
              <div className="ph-field">
                <label><IconCalendar /> Start Date</label>
                <input
                  type="date"
                  required
                  value={config.startDate}
                  onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                />
              </div>

              <div className="ph-field">
                <label><IconCalendar /> End Date</label>
                <input
                  type="date"
                  required
                  value={config.endDate}
                  onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                />
              </div>

              <div className="ph-field">
                <label><IconDollar /> Base Price (Optional)</label>
                <div className="ph-amount-group">
                  <span className="ph-amount-symbol">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={config.basePrice}
                    onChange={(e) => setConfig({ ...config, basePrice: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ══ SECTION 3: WEEKLY CONF ══ */}
          <div className="ph-section-header">
            <h2 className="ph-section-title">Weekly Schedule</h2>
            <span className="ph-section-sub">Configure peak timings for specific days</span>
          </div>

          <div className="ph-glass-card" style={{ animationDelay: "0.15s" }}>
            <div className="ph-card-header-row">
              <div>
                <h3 className="ph-card-title">Days &amp; Peak Timings</h3>
                <p className="ph-card-sub">Select days to reveal their time configuration</p>
              </div>
              <span className="ph-card-badge ph-card-badge--purple">Step 3</span>
            </div>

            <div className="ph-days-wrapper">
              <div className="ph-chip-wrap">
                {DAYS.map((day, idx) => (
                  <button
                    key={day.id}
                    type="button"
                    className={`ph-day-chip ${config.selectedDays.includes(day.id) ? "active" : ""}`}
                    onClick={() => handleDayToggle(day.id)}
                    title={day.id}
                    style={{ animationDelay: `${idx * 0.04}s` }}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {config.selectedDays.length > 0 && (
              <div className="ph-list-wrapper">
                {config.selectedDays.map((dayId) => (
                  <div key={dayId} className="ph-row">
                    <span className="ph-row-label">{dayId}</span>
                    
                    <div className="ph-time-fields">
                      <IconClock />
                      <input
                        type="time"
                        required
                        value={config.peakHours[dayId]?.start || ""}
                        onChange={(e) => handlePeakHourChange(dayId, "start", e.target.value)}
                      />
                      <span>to</span>
                      <input
                        type="time"
                        required
                        value={config.peakHours[dayId]?.end || ""}
                        onChange={(e) => handlePeakHourChange(dayId, "end", e.target.value)}
                      />
                    </div>

                    <div className="ph-amount-group">
                      <span className="ph-amount-symbol">₹</span>
                      <input
                        type="number"
                        required
                        placeholder="0.00"
                        value={config.peakHours[dayId]?.amount || ""}
                        onChange={(e) => handlePeakHourChange(dayId, "amount", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ══ ACTIONS ══ */}
          <div className="ph-form-actions">
            <button 
              type="submit" 
              className="ph-btn-submit"
              disabled={loadingSave || config.selectedDays.length === 0}
            >
              {loadingSave ? (
                <>Submitting…</>
              ) : (
                <><IconSave /> Save Peak Hours</>
              )}
            </button>
          </div>

        </form>

        <footer className="ph-footer" style={{ marginTop: 40, textAlign: "center", color: "#9ca3af", fontSize: 13, fontWeight: 500 }}>
          © 2025 Adugalam Turf Booking Platform · Admin Panel
        </footer>
      </div>
    </div>
  );
};

export default PeakHourPage;
