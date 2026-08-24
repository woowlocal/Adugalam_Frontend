import React, { useState, useEffect } from "react";
import { MdSportsEsports, MdOutlineStadium, MdDateRange, MdFlashOn, MdAccessTime } from "react-icons/md";
import "./VendorPeakHours.css";

const DAYS = [
  { id: "Monday", label: "M", full: "Mon" },
  { id: "Tuesday", label: "T", full: "Tue" },
  { id: "Wednesday", label: "W", full: "Wed" },
  { id: "Thursday", label: "T", full: "Thu" },
  { id: "Friday", label: "F", full: "Fri" },
  { id: "Saturday", label: "S", full: "Sat" },
  { id: "Sunday", label: "S", full: "Sun" },
];

const format12Hour = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHours = h % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
};

const PeakHourPage = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState("");
  const [selectedTurfData, setSelectedTurfData] = useState(null);
  const [loadingTurfs, setLoadingTurfs] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [config, setConfig] = useState({
    startDate: "",
    endDate: "",
    basePrice: "",
    selectedDays: [],
    peakHours: {},
  });

  const fetchTurfs = async () => {
    setLoadingTurfs(true);
    setErrorMsg("");
    setSuccessMsg("");
    setTurfs([]);
    setSelectedTurf("");

    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendor/my-turfs/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch turfs.");

      const results = data.results || data;
      if (results.length === 0) {
        setErrorMsg("No turfs found for your account.");
      } else {
        setTurfs(results);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoadingTurfs(false);
    }
  };

  useEffect(() => { fetchTurfs(); }, []);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedTurf) return setErrorMsg("Please select a turf.");
    if (!config.startDate || !config.endDate) return setErrorMsg("Start Date and End Date are required.");

    const configs = [];
    const startObj = new Date(config.startDate);
    const endObj = new Date(config.endDate);

    if (endObj < startObj) return setErrorMsg("End Date cannot be before Start Date.");

    for (let d = new Date(startObj); d <= endObj; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      if (config.selectedDays.includes(dayName)) {
        const hours = config.peakHours[dayName];
        if (hours?.start && hours?.end && hours?.amount) {
          configs.push({
            date: d.toISOString().split("T")[0],
            start: hours.start,
            end: hours.end,
            amount: hours.amount,
          });
        }
      }
    }

    if (configs.length === 0)
      return setErrorMsg("No peak hours configured for the selected date range and days.");

    setLoadingSave(true);
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/vendor/set-bulk-peak-hours/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ turf_id: selectedTurf, configs }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save peak hours.");

      setSuccessMsg("Peak hours saved successfully!");
      setConfig({ startDate: "", endDate: "", basePrice: "", selectedDays: [], peakHours: {} });
      setSelectedTurf("");
      fetchTurfs();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="peak-hour-container">
      <div style={{ width: "100%", maxWidth: 900 }}>

        {/* ── Hero Banner ── */}
        <div className="ph-hero">
          <div className="ph-hero-text">
            <p className="ph-hero-tag">Vendor · Pricing Control</p>
            <h1 className="ph-hero-title">Set Peak Hours</h1>
            <p className="ph-hero-sub">
              Configure dynamic pricing for high-demand time slots across your turfs
            </p>
          </div>
          <div className="ph-hero-badge">
            <span className="ph-live-dot" />
            Live Pricing
          </div>
        </div>

        {/* ── Main Card ── */}
        <div className="peak-hour-card">

          {/* Alerts */}
          {errorMsg && (
            <div className="ph-alert ph-alert--error">
              <span className="ph-alert-icon">⚠️</span>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="ph-alert ph-alert--success">
              <span className="ph-alert-icon">✅</span>
              {successMsg}
            </div>
          )}

          {/* ── Step 1: Turf Selection ── */}
          <div className="ph-section-label">
            <div className="ph-section-label-icon ph-section-label-icon--green">
              <MdOutlineStadium size={20} color="#0a7c3c" />
            </div>
            <div className="ph-section-label-text">
              <h3>Select Turf</h3>
              <p>Choose which turf to configure peak pricing for</p>
            </div>
          </div>

          <div className="vendor-section">
            {loadingTurfs && (
              <div className="ph-loading">
                <span className="ph-spinner" />
                Loading your turfs…
              </div>
            )}
            {!loadingTurfs && turfs.length === 0 && !errorMsg && (
              <div className="ph-empty">
                <div className="ph-empty-icon">🏗️</div>
                <p>No turfs found. Add a turf to get started.</p>
              </div>
            )}
            {!loadingTurfs && turfs.length > 0 && (
              <div className="input-group" style={{ width: "100%" }}>
                <label>Turf</label>
                <select
                  value={selectedTurf}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedTurf(val);
                    const turfObj = turfs.find((t) => String(t.id) === String(val));
                    setSelectedTurfData(turfObj || null);
                  }}
                >
                  <option value="">— Choose a Turf —</option>
                  {turfs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} · {t.location}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ── Games for Selected Turf ── */}
          {selectedTurfData && (
            <div className="ph-games-section">
              <div className="ph-section-label" style={{ marginBottom: 10 }}>
                <div className="ph-section-label-icon ph-section-label-icon--green">
                  <MdSportsEsports size={18} color="#0a7c3c" />
                </div>
                <div className="ph-section-label-text">
                  <h3>Games Available</h3>
                  <p>Games configured for this turf by vendor</p>
                </div>
              </div>
              <div className="ph-games-chips">
                {(() => {
                  let raw = selectedTurfData.games;
                  let games = [];
                  if (typeof raw === "string") {
                    try { games = JSON.parse(raw); } catch { games = []; }
                  } else if (Array.isArray(raw)) {
                    games = raw;
                  }
                  // flatten: if each element is itself a JSON string, parse again
                  games = games.flatMap((g) => {
                    if (typeof g === "string" && g.startsWith("[")) {
                      try { return JSON.parse(g); } catch { return [g]; }
                    }
                    return [g];
                  });
                  return games.length > 0 ? (
                    games.map((game, idx) => (
                      <span key={idx} className="ph-game-chip">
                        🏅 {game}
                      </span>
                    ))
                  ) : (
                    <span className="ph-no-games">No games added for this turf.</span>
                  );
                })()}
              </div>
            </div>
          )}

          <div className="ph-divider" />

          <form onSubmit={handleSave}>
            {/* ── Step 2: Date & Price ── */}
            <div className="ph-section-label">
              <div className="ph-section-label-icon ph-section-label-icon--green">
                <MdDateRange size={20} color="#0a7c3c" />
              </div>
              <div className="ph-section-label-text">
                <h3>Date Range & Base Price</h3>
                <p>Peak pricing applies to all matching days within this range</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Start Date</label>
                <input
                  type="date"
                  required
                  value={config.startDate}
                  onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>End Date</label>
                <input
                  type="date"
                  required
                  value={config.endDate}
                  onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Default Price (optional)</label>
                <div className="amount-input-group">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={config.basePrice}
                    onChange={(e) => setConfig({ ...config, basePrice: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="ph-divider" />

            {/* ── Step 3: Days ── */}
            <div className="ph-section-label">
              <div className="ph-section-label-icon ph-section-label-icon--orange">
                <MdFlashOn size={20} color="#d97706" />
              </div>
              <div className="ph-section-label-text">
                <h3>Peak Days</h3>
                <p>Select the days of the week that apply to peak pricing</p>
              </div>
            </div>

            <div className="days-selector">
              <label>Days of week</label>
              <div className="days-flex">
                {DAYS.map((day) => (
                  <button
                    type="button"
                    key={day.id}
                    className={`day-btn ${config.selectedDays.includes(day.id) ? "active" : ""}`}
                    onClick={() => handleDayToggle(day.id)}
                    title={day.id}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Step 4: Time Slots ── */}
            {config.selectedDays.length > 0 && (
              <>
                <div className="ph-divider" />
                <div className="ph-section-label">
                  <div className="ph-section-label-icon ph-section-label-icon--orange">
                    <MdAccessTime size={20} color="#d97706" />
                  </div>
                  <div className="ph-section-label-text">
                    <h3>Time Slots & Prices</h3>
                    <p>Set start time, end time and price per slot for each day</p>
                  </div>
                </div>

                <div className="peak-hours-list">
                  {config.selectedDays.map((dayId) => (
                    <div key={dayId} className="peak-hour-row">
                      <span className="day-label">{dayId}</span>

                      <div className="time-connector">
                        <div className="time-input-wrapper">
                          <input
                            type="time"
                            required
                            value={config.peakHours[dayId]?.start || ""}
                            onChange={(e) => handlePeakHourChange(dayId, "start", e.target.value)}
                          />
                        </div>
                        <span>to</span>
                        <div className="time-input-wrapper">
                          <input
                            type="time"
                            required
                            value={config.peakHours[dayId]?.end || ""}
                            onChange={(e) => handlePeakHourChange(dayId, "end", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="amount-wrapper">
                        <div className="amount-input-group">
                          <span className="currency-symbol">₹</span>
                          <input
                            type="number"
                            required
                            placeholder="0.00"
                            value={config.peakHours[dayId]?.amount || ""}
                            onChange={(e) => handlePeakHourChange(dayId, "amount", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── Save ── */}
            <div className="action-bar">
              <button
                type="submit"
                className="btn-primary btn-save"
                disabled={loadingSave || config.selectedDays.length === 0 || !selectedTurf}
              >
                {loadingSave ? "Saving…" : "  Save Peak Hours"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PeakHourPage;
