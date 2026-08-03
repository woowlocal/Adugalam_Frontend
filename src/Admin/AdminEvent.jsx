import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminEvent.css";
import AdminAPI from "../api/adminApi";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaTrash,
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaUser,
  FaCheckCircle,
  FaDesktop,
  FaMobileAlt,
  FaInfoCircle,
  FaSave,
  FaImage,
  FaUpload,
  FaCalendarPlus,
  FaTimesCircle
} from "react-icons/fa";

/* ── Time Picker constants ── */
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

/* ── Reusable TimePicker component ── */
function TimePicker({ label, value, onChange }) {
  return (
    <div className="ae-time-picker-group">
      <label className="field-label">{label}</label>
      <div className="ae-time-picker-selects">
        <span className="ae-time-icon"><FaClock /></span>
        <select
          className="ae-time-sel"
          value={value.hour || ""}
          onChange={(e) => onChange({ ...value, hour: e.target.value })}
        >
          <option value="">HH</option>
          {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>

        <span className="ae-time-colon">:</span>

        <select
          className="ae-time-sel"
          value={value.minute || ""}
          onChange={(e) => onChange({ ...value, minute: e.target.value })}
        >
          <option value="">MM</option>
          {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          className="ae-time-ampm"
          value={value.ampm || ""}
          onChange={(e) => onChange({ ...value, ampm: e.target.value })}
        >
          <option value="">AM/PM</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}

function parseTimeFromBackend(timeStr) {
  if (!timeStr) return { hour: "", minute: "", ampm: "" };
  const parts = timeStr.split(":");
  if (parts.length < 2) return { hour: "", minute: "", ampm: "" };
  let hr = parseInt(parts[0], 10);
  const min = parts[1];
  let ampm = "AM";
  if (hr >= 12) {
    ampm = "PM";
    if (hr > 12) hr -= 12;
  }
  if (hr === 0) {
    hr = 12;
  }
  return {
    hour: String(hr).padStart(2, "0"),
    minute: min.padStart(2, "0"),
    ampm: ampm
  };
}

const STEPS = [
  { id: 1, label: "Basic Info", title: "Basic Information", sub: "Provide basic details about your event" },
  { id: 2, label: "Schedule",   title: "Schedule",           sub: "Define the date, time and duration" },
  { id: 3, label: "Ticketing",  title: "Ticketing",          sub: "Create tickets and set pricing" },
  { id: 4, label: "Location",   title: "Location",           sub: "Add venue and location details" },
  { id: 5, label: "Gallery",    title: "Gallery",            sub: "Add images to showcase your event" },
  { id: 6, label: "Speakers",   title: "Speakers",           sub: "Add speakers and guest details" },
  { id: 7, label: "Publish",    title: "Publish",            sub: "Review and publish your event" },
];

function AdminEvent() {
  const location = useLocation();
  const navigate = useNavigate();

  const editEvent = location.state?.editEvent || null;
  const isEditMode = !!editEvent;

  const [currentStep, setCurrentStep] = useState(1);
  const [deviceView, setDeviceView] = useState("desktop");
  const [paymentType, setPaymentType] = useState("Paid");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    banner: null,
    eventName: "",
    eventCategory: "Sports",
    eventType: "Offline",
    shortDescription: "",
    location: "",
    address: "",
    state: "Tamil Nadu",
    city: "Tirunelveli",
    pincode: "627001",
    startDate: "",
    endDate: "",
    startTime: { hour: "", minute: "", ampm: "" },
    endTime:   { hour: "", minute: "", ampm: "" },
    regCloseDate: "",
    regCloseTime: { hour: "", minute: "", ampm: "" },
    amount: "",
    totalSeats: "",
    organizedBy: "",
    gallery: [],
    agenda: "",
    vips: ""
  });

  const [tickets, setTickets] = useState([
    { id: 1, name: "Normal Ticket", tag: "Normal", price: "200", qty: "20" },
    { id: 2, name: "VIP Ticket", tag: "VIP", price: "500", qty: "10" }
  ]);

  const [speakers, setSpeakers] = useState([
    { id: 1, name: "Rahul Kumar", role: "Sports Coach", bio: "" },
    { id: 2, name: "Anjali Sharma", role: "Fitness Expert", bio: "" }
  ]);

  const [bannerPreviewUrl, setBannerPreviewUrl] = useState("");
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState([]);

  // Load edit values
  useEffect(() => {
    if (editEvent) {
      setFormData({
        banner: editEvent.image || null,
        eventName: editEvent.title || "",
        eventCategory: editEvent.category || "Sports",
        eventType: editEvent.address?.toLowerCase().includes("online") ? "Online" : "Offline",
        shortDescription: editEvent.agenda ? editEvent.agenda.substring(0, 120) : "",
        location: editEvent.location || "",
        address: editEvent.address || "",
        state: "Tamil Nadu",
        city: "Tirunelveli",
        pincode: "627001",
        startDate: editEvent.start_date || "",
        endDate: editEvent.end_date || "",
        startTime: parseTimeFromBackend(editEvent.start_time),
        endTime: parseTimeFromBackend(editEvent.end_time),
        regCloseDate: editEvent.start_date || "",
        regCloseTime: { hour: "09", minute: "00", ampm: "AM" },
        amount: String(editEvent.amount || 0),
        totalSeats: String(editEvent.total_seats || 0),
        organizedBy: editEvent.organized_by || "",
        gallery: [],
        agenda: editEvent.agenda || "",
        vips: editEvent.vips || ""
      });

      setPaymentType(editEvent.is_free || parseFloat(editEvent.amount) === 0 ? "Free" : "Paid");

      setTickets([
        {
          id: 1,
          name: "General Pass",
          tag: "Default",
          price: String(editEvent.amount || 0),
          qty: String(editEvent.total_seats || 0)
        }
      ]);

      if (editEvent.vips) {
        const parsed = editEvent.vips.split("\n").map((line, idx) => {
          const match = line.match(/^([^(]+)(?:\(([^)]+)\))?/);
          if (match) {
            return {
              id: idx + 1,
              name: match[1].trim(),
              role: (match[2] || "").trim(),
              bio: ""
            };
          }
          return { id: idx + 1, name: line.trim(), role: "", bio: "" };
        });
        setSpeakers(parsed);
      }
    }
  }, [editEvent]);

  // Live banner preview
  useEffect(() => {
    if (!formData.banner) {
      setBannerPreviewUrl("");
      return;
    }
    if (typeof formData.banner === "string") {
      setBannerPreviewUrl(formData.banner);
      return;
    }
    const url = URL.createObjectURL(formData.banner);
    setBannerPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formData.banner]);

  // Live gallery preview
  useEffect(() => {
    if (!formData.gallery || formData.gallery.length === 0) {
      setGalleryPreviewUrls([]);
      return;
    }
    const urls = [];
    for (let i = 0; i < formData.gallery.length; i++) {
      const file = formData.gallery[i];
      if (typeof file === "string") {
        urls.push(file);
      } else {
        urls.push(URL.createObjectURL(file));
      }
    }
    setGalleryPreviewUrls(urls);
    return () => {
      urls.forEach(url => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [formData.gallery]);

  // Sync tickets with amount
  useEffect(() => {
    if (tickets.length > 0) {
      const firstPrice = tickets[0].price || "0";
      setFormData((prev) => ({
        ...prev,
        amount: paymentType === "Free" ? "0" : firstPrice
      }));
    }
  }, [tickets, paymentType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateField = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.eventName || !formData.eventName.trim()) return "Event Title is required.";
      if (!formData.eventCategory || !formData.eventCategory.trim()) return "Category is required.";
      if (!formData.organizedBy || !formData.organizedBy.trim()) return "Organizer Name is required.";
      if (!formData.shortDescription || !formData.shortDescription.trim()) return "Short Description is required.";
      if (!formData.banner) return "Cover Image / Banner is required.";
    }
    if (step === 2) {
      if (!formData.startDate) return "Start Date is required.";
      if (!formData.startTime.hour || !formData.startTime.minute || !formData.startTime.ampm) {
        return "Complete Start Time is required.";
      }
      if (!formData.endDate) return "End Date is required.";
      if (!formData.endTime.hour || !formData.endTime.minute || !formData.endTime.ampm) {
        return "Complete End Time is required.";
      }
    }
    if (step === 3) {
      if (!formData.totalSeats || parseInt(formData.totalSeats, 10) < 1) {
        return "Overall Event Capacity (Total Seats) is required.";
      }
      if (paymentType === "Paid") {
        const normal = tickets[0];
        const vip = tickets[1];
        if (!normal || !vip) return "Ticketing configuration is invalid.";
        if (normal.price === "" || parseFloat(normal.price) < 0) return "Normal Ticket Price is required.";
        if (vip.price === "" || parseFloat(vip.price) < 0) return "VIP Ticket Price is required.";
        if (normal.qty === "" || parseInt(normal.qty, 10) < 0) return "Normal Ticket Seats quantity is required.";
        if (vip.qty === "" || parseInt(vip.qty, 10) < 0) return "VIP Ticket Seats quantity is required.";
        if (parseInt(normal.qty, 10) + parseInt(vip.qty, 10) !== parseInt(formData.totalSeats, 10)) {
          return `The sum of Normal seats (${normal.qty}) and VIP seats (${vip.qty}) must equal the Overall Event Capacity (${formData.totalSeats}).`;
        }
      }
    }
    if (step === 4) {
      if (!formData.location || !formData.location.trim()) return "Venue Name is required.";
      if (!formData.address || !formData.address.trim()) return "Full Address is required.";
      if (!formData.state || !formData.state.trim()) return "State is required.";
      if (!formData.city || !formData.city.trim()) return "City is required.";
      if (!formData.pincode || !formData.pincode.trim()) return "Pincode is required.";
    }
    return null;
  };

  const jumpTo = (id) => {
    if (id > currentStep) {
      for (let s = currentStep; s < id; s++) {
        const err = validateStep(s);
        if (err) {
          setErrorMsg(err);
          alert(`⚠️ Please fill in all required fields:\n\n${err}`);
          return;
        }
      }
    }
    setErrorMsg("");
    setCurrentStep(id);
  };

  const goNext = () => {
    const err = validateStep(currentStep);
    if (err) {
      setErrorMsg(err);
      alert(`⚠️ Please fill in all required fields:\n\n${err}`);
      return;
    }
    setErrorMsg("");
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Ticket CRUD
  const addTicket = () => {
    setTickets([...tickets, { id: Date.now(), name: "New Ticket", tag: "", price: "0", qty: "50" }]);
  };
  const removeTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
  };
  const updateTicketField = (id, key, val) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, [key]: val } : t));
  };

  // Speaker CRUD
  const addSpeaker = () => {
    setSpeakers([...speakers, { id: Date.now(), name: "", role: "", bio: "" }]);
  };
  const removeSpeaker = (id) => {
    setSpeakers(speakers.filter(s => s.id !== id));
  };
  const updateSpeakerField = (id, key, val) => {
    setSpeakers(speakers.map(s => s.id === id ? { ...s, [key]: val } : s));
  };

  const resetForm = () => {
    setFormData({
      banner: null,
      eventName: "",
      eventCategory: "Sports",
      eventType: "Offline",
      shortDescription: "",
      location: "",
      address: "",
      state: "Tamil Nadu",
      city: "Tirunelveli",
      pincode: "627001",
      startDate: "",
      endDate: "",
      startTime: { hour: "", minute: "", ampm: "" },
      endTime:   { hour: "", minute: "", ampm: "" },
      regCloseDate: "",
      regCloseTime: { hour: "", minute: "", ampm: "" },
      amount: "",
      totalSeats: "",
      organizedBy: "",
      gallery: [],
      agenda: "",
      vips: ""
    });
    setTickets([
      { id: 1, name: "Normal Ticket", tag: "Normal", price: "200", qty: "20" },
      { id: 2, name: "VIP Ticket", tag: "VIP", price: "500", qty: "10" }
    ]);
    setSpeakers([
      { id: 1, name: "Rahul Kumar", role: "Sports Coach", bio: "" },
      { id: 2, name: "Anjali Sharma", role: "Fitness Expert", bio: "" }
    ]);
    setPaymentType("Paid");
    setCurrentStep(1);
  };

  const handleTotalSeatsChange = (val) => {
    const numSeats = parseInt(val, 10) || 0;
    setFormData(prev => ({ ...prev, totalSeats: val }));
    
    // Auto-balance Normal and VIP seats: 70% Normal, 30% VIP
    const normalSeats = Math.round(numSeats * 0.7);
    const vipSeats = numSeats - normalSeats;
    
    setTickets([
      { id: 1, name: "Normal Ticket", tag: "Normal", price: tickets[0]?.price || "200", qty: String(normalSeats) },
      { id: 2, name: "VIP Ticket", tag: "VIP", price: tickets[1]?.price || "500", qty: String(vipSeats) }
    ]);
  };

  const handleTicketChange = (id, field, value) => {
    const total = parseInt(formData.totalSeats, 10) || 0;
    
    setTickets(prevTickets => {
      return prevTickets.map(t => {
        if (t.id === id) {
          let newQty = t.qty;
          if (field === "qty") {
            const valNum = parseInt(value, 10) || 0;
            newQty = String(Math.min(total, valNum));
          }
          return { ...t, [field]: field === "qty" ? newQty : value };
        } else {
          // If we changed qty on the other ticket, auto-balance this one to match the total!
          if (field === "qty") {
            const otherValNum = parseInt(value, 10) || 0;
            const balancedQty = String(Math.max(0, total - otherValNum));
            return { ...t, qty: balancedQty };
          }
          return t;
        }
      });
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // Validate all steps before submitting
    for (let s = 1; s <= 4; s++) {
      const err = validateStep(s);
      if (err) {
        setErrorMsg(err);
        alert(`⚠️ Please correct the required fields in Step ${s}:\n\n${err}`);
        setCurrentStep(s);
        return;
      }
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("eventName", formData.eventName);
      data.append("eventCategory", formData.eventCategory);
      data.append("location", formData.location);
      data.append("address", formData.address);
      data.append("organizedBy", formData.organizedBy);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("amount", paymentType === "Free" ? "0" : formData.amount);
      data.append("total_seats", formData.totalSeats || "0");
      data.append("agenda", formData.agenda || formData.shortDescription);

      // Serialize speakers list to vips string
      const speakersText = speakers
        .filter(s => s.name.trim() !== "")
        .map(s => `${s.name.trim()} (${s.role.trim()})`)
        .join("\n");
      data.append("vips", speakersText || formData.vips);

      // Time fields
      data.append("startTime_hour", formData.startTime.hour);
      data.append("startTime_minute", formData.startTime.minute);
      data.append("startTime_ampm", formData.startTime.ampm);
      data.append("endTime_hour", formData.endTime.hour);
      data.append("endTime_minute", formData.endTime.minute);
      data.append("endTime_ampm", formData.endTime.ampm);

      if (formData.banner instanceof File) {
        data.append("banner", formData.banner);
      }

      if (formData.gallery && formData.gallery.length > 0) {
        formData.gallery.forEach(file => {
          if (file instanceof File) {
            data.append("gallery", file);
          }
        });
      }

      if (isEditMode) {
        await AdminAPI.put(`api/admin/events/${editEvent.id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("Event Updated Successfully!");
        setTimeout(() => navigate("/Eventlist"), 1500);
      } else {
        await AdminAPI.post("api/admin/events/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMsg("Event Added Successfully!");
        setTimeout(() => navigate("/Eventlist"), 1500);
      }
    } catch (err) {
      console.error("Event submit error:", err);
      setErrorMsg("Error saving event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper date formatter for preview
  const previewDate = formData.startDate
    ? new Date(formData.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "02 Jul 2026";

  const previewTime = formData.startTime.hour
    ? `${formData.startTime.hour}:${formData.startTime.minute || "00"} ${formData.startTime.ampm || "AM"}`
    : "10:00 AM";

  return (
    <div className="admin-container">
      {/* ── HERO HEADER ── */}
      <div className="admin-hero">
        <div className="admin-hero-inner">
          <div className="admin-hero-icon"><FaCalendarPlus style={{ color: "#fff" }} /></div>
          <div>
            <p className="admin-hero-label">Admin Panel</p>
            <h2 className="admin-hero-title">{isEditMode ? "Edit Event Wizard" : "Event Creation Wizard"}</h2>
            <p className="admin-hero-sub">Create and publish interactive, high-converting events using our live wizard flow</p>
          </div>
        </div>
        {isEditMode && (
          <button className="ae-back-list-btn" onClick={() => navigate("/Eventlist")}>
            <FaArrowLeft /> Back to List
          </button>
        )}
      </div>

      {/* Stepper Progress bar */}
      <div className="ae-stepper-container">
        <div className="ae-stepper">
          {STEPS.map((s, index) => {
            const isActive = currentStep === s.id;
            const isDone = currentStep > s.id;
            return (
              <React.Fragment key={s.id}>
                <div className="ae-step-item">
                  <button className="ae-step-btn" onClick={() => jumpTo(s.id)}>
                    <div className={`ae-step-circle ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                      {isDone ? <FaCheckCircle /> : s.id}
                    </div>
                    <span className={`ae-step-label ${isActive ? "active" : ""}`}>{s.label}</span>
                  </button>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`ae-step-line ${isDone ? "done" : ""}`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Grid */}
      <div className="ae-grid">
        {/* Form Panel */}
        <div className="ae-panel ae-form-panel">
          <div className="ae-panel-head">
            <div className="ae-panel-num">{currentStep}</div>
            <div>
              <h2>{STEPS[currentStep - 1].title}</h2>
              <p>{STEPS[currentStep - 1].sub}</p>
            </div>
          </div>

          <div className="ae-form-body">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="ae-step-content">
                <div className="form-group">
                  <label className="field-label">Event Title *</label>
                  <input
                    type="text"
                    placeholder="Enter event title (e.g. Chennai Sports Meet 2026)"
                    value={formData.eventName}
                    onChange={(e) => updateField("eventName", e.target.value)}
                  />
                </div>

                <div className="ae-form-row">
                  <div className="form-group">
                    <label className="field-label">Category *</label>
                    <select
                      value={formData.eventCategory}
                      onChange={(e) => updateField("eventCategory", e.target.value)}
                    >
                      <option value="Sports">Sports</option>
                      <option value="Conference">Conference</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Festival">Festival</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="field-label">Organized By *</label>
                    <input
                      type="text"
                      placeholder="Organization Name"
                      value={formData.organizedBy}
                      onChange={(e) => updateField("organizedBy", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Event Type</label>
                  <div className="ae-radio-group">
                    <label className="ae-radio-label">
                      <input
                        type="radio"
                        name="eventType"
                        value="Online"
                        checked={formData.eventType === "Online"}
                        onChange={() => updateField("eventType", "Online")}
                      />
                      Online Event
                    </label>
                    <label className="ae-radio-label">
                      <input
                        type="radio"
                        name="eventType"
                        value="Offline"
                        checked={formData.eventType === "Offline"}
                        onChange={() => updateField("eventType", "Offline")}
                      />
                      Offline Venue
                    </label>
                    <label className="ae-radio-label">
                      <input
                        type="radio"
                        name="eventType"
                        value="Hybrid"
                        checked={formData.eventType === "Hybrid"}
                        onChange={() => updateField("eventType", "Hybrid")}
                      />
                      Hybrid Mode
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Short Description *</label>
                  <textarea
                    placeholder="Provide a short description showcasing your event details..."
                    value={formData.shortDescription}
                    onChange={(e) => updateField("shortDescription", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Event Banner / Cover Image *</label>
                  <div className="ae-dropzone">
                    <input
                      type="file"
                      id="bannerUpload"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          updateField("banner", e.target.files[0]);
                        }
                      }}
                    />
                    <label htmlFor="bannerUpload" className="ae-dropzone-label">
                      <div className="ae-dropzone-icon"><FaUpload /></div>
                      <span className="ae-dropzone-text">
                        {formData.banner
                          ? `Selected: ${formData.banner.name || "Existing Banner Image"}`
                          : "Drag & drop image here or click to browse"}
                      </span>
                      <button
                        type="button"
                        className="ae-btn ae-btn-sm ae-btn-green"
                        onClick={() => document.getElementById("bannerUpload").click()}
                      >
                        Browse Files
                      </button>
                    </label>
                  </div>
                  {bannerPreviewUrl && (
                    <div className="ae-banner-preview-wrap">
                      <img src={bannerPreviewUrl} alt="Banner Preview" className="ae-banner-preview" />
                    </div>
                  )}
                </div>


              </div>
            )}

            {/* Step 2: Schedule */}
            {currentStep === 2 && (
              <div className="ae-step-content ae-schedule-step">
                <div className="ae-schedule-block">
                  <div className="ae-schedule-block-title">
                    <span className="ae-schedule-dot start"></span>
                    <h4>Event Commences (Start Date & Time)</h4>
                  </div>
                  <div className="ae-form-row">
                    <div className="form-group date-input-wrap">
                      <label className="field-label">Start Date *</label>
                      <div className="ae-date-input-container">
                        <span className="ae-date-icon"><FaCalendarAlt /></span>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => updateField("startDate", e.target.value)}
                        />
                      </div>
                    </div>
                    <TimePicker
                      label="Start Time *"
                      value={formData.startTime}
                      onChange={(val) => updateField("startTime", val)}
                    />
                  </div>
                </div>

                <div className="ae-schedule-block">
                  <div className="ae-schedule-block-title">
                    <span className="ae-schedule-dot end"></span>
                    <h4>Event Concludes (End Date & Time)</h4>
                  </div>
                  <div className="ae-form-row">
                    <div className="form-group date-input-wrap">
                      <label className="field-label">End Date *</label>
                      <div className="ae-date-input-container">
                        <span className="ae-date-icon"><FaCalendarAlt /></span>
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => updateField("endDate", e.target.value)}
                        />
                      </div>
                    </div>
                    <TimePicker
                      label="End Time *"
                      value={formData.endTime}
                      onChange={(val) => updateField("endTime", val)}
                    />
                  </div>
                </div>

                <div className="ae-schedule-block">
                  <div className="ae-schedule-block-title">
                    <span className="ae-schedule-dot reg"></span>
                    <h4>Registration Deadline (Close Date & Time)</h4>
                  </div>
                  <div className="ae-form-row">
                    <div className="form-group date-input-wrap">
                      <label className="field-label">Registration Close Date</label>
                      <div className="ae-date-input-container">
                        <span className="ae-date-icon"><FaRegCalendarAlt /></span>
                        <input
                          type="date"
                          value={formData.regCloseDate}
                          onChange={(e) => updateField("regCloseDate", e.target.value)}
                        />
                      </div>
                    </div>
                    <TimePicker
                      label="Registration Close Time"
                      value={formData.regCloseTime}
                      onChange={(val) => updateField("regCloseTime", val)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Ticketing */}
            {currentStep === 3 && (
              <div className="ae-step-content">
                <div className="ae-ticket-header">
                  <div className="form-group" style={{ width: "200px" }}>
                    <label className="field-label">Entry Fee Type</label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value)}
                    >
                      <option value="Paid">Paid Entry</option>
                      <option value="Free">Free Entry</option>
                    </select>
                  </div>
                </div>

                <div className="ae-tickets-list">
                  {paymentType === "Free" ? (
                    <>
                      <div className="ae-free-info-box">
                        <FaInfoCircle /> This is a free event. Bookings will not require payment.
                      </div>
                      <div className="form-group" style={{ marginTop: "16px" }}>
                        <label className="field-label">Overall Event Capacity (Total Seats) *</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.totalSeats}
                          placeholder="Total capacity for free event"
                          onChange={(e) => updateField("totalSeats", e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group" style={{ marginBottom: "20px" }}>
                        <label className="field-label">Overall Event Capacity (Total Seats) *</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.totalSeats}
                          placeholder="e.g. 30"
                          onChange={(e) => handleTotalSeatsChange(e.target.value)}
                        />
                        <p className="ae-hint">Enter the total capacity first, then allocate normal and VIP seats below.</p>
                      </div>

                      {parseInt(formData.totalSeats, 10) > 0 && (
                        <div className="ae-ticket-grid">
                          {tickets.map((t) => (
                            <div className="ae-ticket-card" key={t.id}>
                              <div className="ae-ticket-card-head">
                                <span className="ae-ticket-title">
                                  {t.name} Class
                                  {t.tag && <span className="ae-tag-badge">{t.tag}</span>}
                                </span>
                              </div>
                              <div className="ae-ticket-card-fields">
                                <div className="form-group">
                                  <label className="field-label">Price (₹) *</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={t.price}
                                    onChange={(e) => handleTicketChange(t.id, "price", e.target.value)}
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="field-label">Allocated Seats *</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max={formData.totalSeats}
                                    value={t.qty}
                                    onChange={(e) => handleTicketChange(t.id, "qty", e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {currentStep === 4 && (
              <div className="ae-step-content">
                <div className="form-group">
                  <label className="field-label">Venue / Location Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. PPCM+ C4, Anna Stadium"
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Full Address *</label>
                  <textarea
                    placeholder="Enter complete street address..."
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="ae-form-row-three">
                  <div className="form-group">
                    <label className="field-label">State *</label>
                    <select value={formData.state} onChange={(e) => updateField("state", e.target.value)}>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Karnataka">Karnataka</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="field-label">City *</label>
                    <select value={formData.city} onChange={(e) => updateField("city", e.target.value)}>
                      <option value="Tirunelveli">Tirunelveli</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Madurai">Madurai</option>
                      <option value="Coimbatore">Coimbatore</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="field-label">Pincode *</label>
                    <input
                      type="text"
                      placeholder="e.g. 627001"
                      value={formData.pincode}
                      onChange={(e) => updateField("pincode", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Location on Map</label>
                  <div className="ae-map-mock">
                    <span className="ae-map-pin">📍</span>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      Google Maps Location Pin (Integrated based on address: "{formData.location}")
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Gallery */}
            {currentStep === 5 && (
              <div className="ae-step-content">
                <div style={{ marginBottom: "12px", padding: "10px 14px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", fontSize: "13px", color: "#065f46" }}>
                  📸 Upload up to <strong>5 images</strong> to showcase your event. These will appear in the Event Gallery on the booking page.
                </div>

                {formData.gallery.length < 5 && (
                  <div className="ae-dropzone">
                    <input
                      type="file"
                      id="galleryUpload"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files) {
                          const newFiles = Array.from(e.target.files);
                          const combined = [...formData.gallery, ...newFiles].slice(0, 5);
                          updateField("gallery", combined);
                        }
                      }}
                    />
                    <label htmlFor="galleryUpload" className="ae-dropzone-label">
                      <div className="ae-dropzone-icon"><FaImage /></div>
                      <span className="ae-dropzone-text">
                        {formData.gallery.length > 0
                          ? `${formData.gallery.length}/5 image(s) selected — click to add more`
                          : "Drag & drop images here or click to browse (max 5)"}
                      </span>
                      <button
                        type="button"
                        className="ae-btn ae-btn-sm ae-btn-green"
                        onClick={() => document.getElementById("galleryUpload").click()}
                      >
                        Browse Files
                      </button>
                    </label>
                  </div>
                )}

                {formData.gallery.length >= 5 && (
                  <div style={{ padding: "10px 14px", background: "#fef9c3", borderRadius: "8px", border: "1px solid #fde047", fontSize: "13px", color: "#713f12", marginBottom: "12px" }}>
                    ✅ Maximum 5 images selected. Remove an image to add a different one.
                  </div>
                )}

                <div className="ae-gallery-section">
                  <span className="ae-gallery-title">Gallery Preview ({galleryPreviewUrls.length}/5 images)</span>
                  <div className="ae-gallery-grid">
                    {galleryPreviewUrls.length > 0 ? (
                      galleryPreviewUrls.map((url, idx) => (
                        <div key={idx} className="ae-gallery-thumb-wrap" style={{ position: "relative" }}>
                          <img src={url} alt={`Gallery ${idx + 1}`} className="ae-gallery-thumb" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.gallery.filter((_, i) => i !== idx);
                              updateField("gallery", updated);
                            }}
                            style={{
                              position: "absolute", top: "4px", right: "4px",
                              background: "#ef4444", color: "#fff", border: "none",
                              borderRadius: "50%", width: "22px", height: "22px",
                              cursor: "pointer", fontSize: "12px", display: "flex",
                              alignItems: "center", justifyContent: "center", lineHeight: 1
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      [1,2,3,4,5].map(i => (
                        <div key={i} className="ae-gallery-thumb placeholder"></div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Speakers */}
            {currentStep === 6 && (
              <div className="ae-step-content">
                <div className="ae-speakers-header">
                  <button type="button" className="ae-btn ae-btn-green ae-btn-sm" onClick={addSpeaker}>
                    <FaPlus /> Add Speaker / Guest
                  </button>
                </div>

                <div className="ae-speakers-list">
                  {speakers.map((s, idx) => (
                    <div className="ae-speaker-card" key={s.id}>
                      <div className="ae-speaker-card-head">
                        <span className="ae-speaker-num">Guest #{idx + 1}</span>
                        {speakers.length > 1 && (
                          <button
                            type="button"
                            className="ae-icon-btn delete"
                            onClick={() => removeSpeaker(s.id)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <div className="ae-speaker-card-fields">
                        <div className="ae-form-row">
                          <div className="form-group">
                            <label className="field-label">Name *</label>
                            <input
                              type="text"
                              value={s.name}
                              placeholder="e.g. Sachin Tendulkar"
                              onChange={(e) => updateSpeakerField(s.id, "name", e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="field-label">Designation / Role *</label>
                            <input
                              type="text"
                              value={s.role}
                              placeholder="e.g. Chief Guest / Coach"
                              onChange={(e) => updateSpeakerField(s.id, "role", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="field-label">Short Bio</label>
                          <textarea
                            value={s.bio}
                            placeholder="Brief description about the guest..."
                            onChange={(e) => updateSpeakerField(s.id, "bio", e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: "20px" }}>
                  <label className="field-label">Full Event Agenda / Timeline</label>
                  <textarea
                    placeholder="Enter agenda details, schedules, slot timeline..."
                    name="agenda"
                    value={formData.agenda}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 7: Publish & Review */}
            {currentStep === 7 && (
              <div className="ae-step-content">
                <span className="ae-publish-header-text">Final Review & Publish</span>
                <ul className="ae-review-list">
                  <li onClick={() => jumpTo(1)}>
                    <span>Basic Information: <strong>{formData.eventName || "Not Provided"}</strong></span>
                    <button className="ae-edit-link">Edit</button>
                  </li>
                  <li onClick={() => jumpTo(2)}>
                    <span>Schedule: <strong>{formData.startDate || "Date Not Set"}</strong></span>
                    <button className="ae-edit-link">Edit</button>
                  </li>
                  <li onClick={() => jumpTo(3)}>
                    <span>Ticketing: <strong>{paymentType} Pass (Price: ₹{formData.amount || "0"})</strong></span>
                    <button className="ae-edit-link">Edit</button>
                  </li>
                  <li onClick={() => jumpTo(4)}>
                    <span>Venue Location: <strong>{formData.location || "Not Set"}</strong></span>
                    <button className="ae-edit-link">Edit</button>
                  </li>
                  <li onClick={() => jumpTo(6)}>
                    <span>Speakers / Guests: <strong>{speakers.length} listed</strong></span>
                    <button className="ae-edit-link">Edit</button>
                  </li>
                </ul>

                <div className="ae-submit-box">
                  {successMsg && (
                    <div className="ae-status-success">
                      <FaCheckCircle style={{ marginRight: "6px", flexShrink: 0 }} />
                      {successMsg}
                    </div>
                  )}
                  {errorMsg && (
                    <div className="ae-status-error">
                      <FaTimesCircle style={{ marginRight: "6px", flexShrink: 0 }} />
                      {errorMsg}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="ae-actions">
            <button
              type="button"
              className={`ae-back-btn ${currentStep === 1 ? "hidden" : ""}`}
              onClick={goBack}
            >
              <FaArrowLeft /> Back
            </button>
            <div className="ae-actions-right">
              <button
                type="button"
                className="ae-btn ae-btn-outline"
                onClick={() => {
                  alert("Draft saved to browser storage! (Simulated)");
                }}
              >
                Save Draft
              </button>
              {currentStep < STEPS.length ? (
                <button type="button" className="ae-btn ae-btn-green" onClick={goNext}>
                  Next <FaArrowRight />
                </button>
              ) : (
                <button
                  type="button"
                  className="ae-btn ae-btn-green"
                  style={{ padding: "12px 32px", fontSize: "14px" }}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    "⏳ Saving..."
                  ) : (
                    <>
                      <FaSave /> {isEditMode ? "Update Event 🚀" : "Publish Event 🚀"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="ae-panel ae-preview-panel">
          <div className="ae-preview-head">
            <span>Live Interactive Preview</span>
            <div className="ae-device-toggle">
              <button
                type="button"
                className={deviceView === "desktop" ? "active" : ""}
                title="Desktop View"
                onClick={() => setDeviceView("desktop")}
              >
                <FaDesktop />
              </button>
              <button
                type="button"
                className={deviceView === "mobile" ? "active" : ""}
                title="Mobile View"
                onClick={() => setDeviceView("mobile")}
              >
                <FaMobileAlt />
              </button>
            </div>
          </div>

          <div className="ae-preview-body" id="previewBody">
            <div className={`ae-preview-device-wrapper ${deviceView}`}>
              <div className="ae-preview-cover">
                {bannerPreviewUrl ? (
                  <img src={bannerPreviewUrl} alt="Cover Preview" className="ae-preview-cover-img" />
                ) : (
                  <div className="ae-preview-cover-placeholder">
                    <FaImage size={28} />
                    <span>Upload Banner Image</span>
                  </div>
                )}
                <span className="ae-preview-featured">FEATURED</span>
              </div>

              <div className="ae-preview-details">
                <span className="ae-preview-category-badge">{formData.eventCategory.toUpperCase()}</span>
                <h3 className="ae-preview-title">{formData.eventName || "Sports Meet 2026"}</h3>
                <div className="ae-preview-meta">
                  <span>📅 {previewDate} &middot; {previewTime}</span>
                </div>
                <div className="ae-preview-meta">
                  <span>📍 {formData.location || "PPCM+ C4, Tirunelveli, Tamil Nadu"}</span>
                </div>
                <p className="ae-preview-desc">
                  {formData.shortDescription ||
                    "Join us for an exciting sports event. Explore games, connect with fellow enthusiasts, and win great prizes."}
                </p>

                <div className="ae-preview-divider"></div>

                <div className="ae-preview-price-row">
                  <div>
                    <span className="ae-preview-price-label">Ticket Price</span>
                    <p className="ae-preview-price-val">
                      {paymentType === "Free" ? "Free Entry" : `From ₹${formData.amount || "499"}.00`}
                    </p>
                  </div>
                  {formData.totalSeats && (
                    <div style={{ textAlign: "right" }}>
                      <span className="ae-preview-price-label">Available Tix</span>
                      <p className="ae-preview-seats-val">{formData.totalSeats} seats</p>
                    </div>
                  )}
                </div>

                <button type="button" className="ae-preview-book-btn">
                  Book Now
                </button>

                {/* Show Speakers in preview */}
                {speakers.filter(s => s.name.trim() !== "").length > 0 && (
                  <div className="ae-preview-speakers-box">
                    <h4>Speakers & Guests</h4>
                    <ul>
                      {speakers
                        .filter(s => s.name.trim() !== "")
                        .map((s) => (
                          <li key={s.id}>
                            <FaUser size={10} style={{ marginRight: "6px", color: "var(--green)" }} />
                            <strong>{s.name}</strong> - <small>{s.role}</small>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEvent;
