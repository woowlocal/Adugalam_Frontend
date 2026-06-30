import React, { useState } from "react";
import "./AdminEvent.css";
import AdminAPI from "../api/adminApi";

/* ── Time Picker constants ── */
const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

/* ── Reusable TimePicker component ── */
function TimePicker({ label, value, onChange }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="ae-time-picker">
        <select
          className="ae-time-sel"
          value={value.hour}
          onChange={(e) => onChange({ ...value, hour: e.target.value })}
        >
          <option value="">HH</option>
          {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>

        <span className="ae-time-colon">:</span>

        <select
          className="ae-time-sel"
          value={value.minute}
          onChange={(e) => onChange({ ...value, minute: e.target.value })}
        >
          <option value="">MM</option>
          {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          className="ae-time-sel"
          value={value.ampm}
          onChange={(e) => onChange({ ...value, ampm: e.target.value })}
        >
          <option value="" disabled>AM/PM</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}

function AdminEvent() {
  const [paymentType, setPaymentType] = useState("Paid");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    banner: null,
    eventName: "",
    eventCategory: "",
    location: "",
    address: "",
    startDate: "",
    endDate: "",
    startTime: { hour: "", minute: "", ampm: "" },
    endTime:   { hour: "", minute: "", ampm: "" },
    amount: "",
    totalSeats: "",
    organizedBy: "",
    gallery: [],
    whyAttend: [
      { heading: "", description: "" },
      { heading: "", description: "" },
      { heading: "", description: "" },
      { heading: "", description: "" },
    ],
    agenda: "",
    vips: "",
    benefits: [
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
    faqs: [
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhyAttendChange = (index, field, value) => {
    const updated = [...formData.whyAttend];
    updated[index][field] = value;
    setFormData({ ...formData, whyAttend: updated });
  };

  const handleFaqChange = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index][field] = value;
    setFormData({ ...formData, faqs: updated });
  };

  const handleBenefitsChange = (index, field, value) => {
    const updated = [...formData.benefits];
    updated[index][field] = value;
    setFormData({ ...formData, benefits: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const data = new FormData();

      // Basic fields
      data.append("eventName", formData.eventName);
      data.append("eventCategory", formData.eventCategory);
      data.append("location", formData.location);
      data.append("address", formData.address);
      data.append("organizedBy", formData.organizedBy);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("amount", paymentType === "Free" ? "0" : formData.amount);
      data.append("total_seats", formData.totalSeats || "0");
      data.append("agenda", formData.agenda);
      data.append("vips", formData.vips);
      data.append("status", "upcoming");

      // Time fields (separate hour/minute/ampm)
      data.append("startTime_hour", formData.startTime.hour);
      data.append("startTime_minute", formData.startTime.minute);
      data.append("startTime_ampm", formData.startTime.ampm);
      data.append("endTime_hour", formData.endTime.hour);
      data.append("endTime_minute", formData.endTime.minute);
      data.append("endTime_ampm", formData.endTime.ampm);

      // Image (banner)
      if (formData.banner) {
        data.append("banner", formData.banner);
      }

      await AdminAPI.post("api/admin/events/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("✅ Event Added Successfully! It will now show on the Events page.");

      // Reset form
      setFormData({
        banner: null,
        eventName: "",
        eventCategory: "",
        location: "",
        address: "",
        startDate: "",
        endDate: "",
        startTime: { hour: "", minute: "", ampm: "" },
        endTime:   { hour: "", minute: "", ampm: "" },
        amount: "",
        totalSeats: "",
        organizedBy: "",
        gallery: [],
        whyAttend: [
          { heading: "", description: "" },
          { heading: "", description: "" },
          { heading: "", description: "" },
          { heading: "", description: "" },
        ],
        agenda: "",
        vips: "",
        benefits: [
          { question: "", answer: "" },
          { question: "", answer: "" },
          { question: "", answer: "" },
          { question: "", answer: "" },
        ],
        faqs: [
          { question: "", answer: "" },
          { question: "", answer: "" },
          { question: "", answer: "" },
          { question: "", answer: "" },
        ],
      });
      setPaymentType("Paid");

    } catch (err) {
      console.error("Event save error:", err);
      setErrorMsg("❌ Error saving event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-container">

      {/* ── HERO HEADER ── */}
      <div className="admin-hero">
        <div className="admin-hero-inner">
          <div className="admin-hero-icon">🎪</div>
          <div>
            <p className="admin-hero-label">Admin Panel</p>
            <h2 className="admin-hero-title">Event Management</h2>
            <p className="admin-hero-sub">Create and manage events shown on the public Events page</p>
          </div>
        </div>
      </div>

      {/* ── FORM CARD ── */}
      <div className="admin-form-card">
        <form onSubmit={handleSubmit} className="admin-form">

          {/* Banner */}
          <div className="form-section-title">Basic Information</div>

          <div className="form-row">
            <div className="form-group">
              <label>Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, banner: e.target.files[0] })
                }
              />
            </div>
            <div className="form-group">
              <label>Event Category</label>
              <select name="eventCategory" onChange={handleChange} value={formData.eventCategory}>
                <option value="">Select Category</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Festival">Festival</option>
              </select>
            </div>
          </div>

          <div className="form-group full">
            <label>Event Name</label>
            <input type="text" name="eventName" placeholder="e.g. Chennai Tech Summit 2026" onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" placeholder="e.g. Marina Beach, Chennai" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Organized By</label>
              <input type="text" name="organizedBy" placeholder="e.g. Adugalam Events" onChange={handleChange} />
            </div>
          </div>

          <div className="form-group full">
            <label>Full Address</label>
            <textarea name="address" placeholder="Enter complete venue address..." onChange={handleChange} />
          </div>

          {/* Date & Time */}
          <div className="form-section-title">Date &amp; Time</div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <TimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={(val) => setFormData({ ...formData, startTime: val })}
            />

            <TimePicker
              label="End Time"
              value={formData.endTime}
              onChange={(val) => setFormData({ ...formData, endTime: val })}
            />
          </div>

          {/* Pricing & Gallery */}
          <div className="form-section-title">Pricing &amp; Media</div>

          <div className="form-row">
            <div className="form-group">
              <label>Entry Fee Type</label>
              <select 
                value={paymentType} 
                onChange={(e) => {
                  setPaymentType(e.target.value);
                  if (e.target.value === "Free") {
                    setFormData({ ...formData, amount: "0" });
                  } else {
                    setFormData({ ...formData, amount: "" });
                  }
                }}
              >
                <option value="Paid">Paid</option>
                <option value="Free">Free</option>
              </select>
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input 
                type="number" 
                name="amount" 
                min="0"
                value={formData.amount}
                placeholder={paymentType === "Free" ? "0" : "Enter Amount"} 
                onChange={handleChange} 
                disabled={paymentType === "Free"}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                    e.preventDefault();
                  }
                }}
                className="no-spin-button"
              />
            </div>

            <div className="form-group">
              <label>Total Seats</label>
              <input 
                type="number" 
                name="totalSeats" 
                min="0"
                value={formData.totalSeats}
                placeholder="e.g. 100 (0 = Unlimited)" 
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                    e.preventDefault();
                  }
                }}
                className="no-spin-button"
              />
            </div>

            <div className="form-group">
              <label>Event Gallery</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, gallery: e.target.files })
                }
              />
            </div>
          </div>

          {/* Why Attend */}
          <div className="form-section-title">Why Should Attend <span className="section-badge">4 Sections</span></div>
          {formData.whyAttend.map((item, index) => (
            <div key={index} className="section-box">
              <div className="section-box-num">{index + 1}</div>
              <div className="section-box-fields">
                <input
                  type="text"
                  placeholder="Heading"
                  value={item.heading}
                  onChange={(e) => handleWhyAttendChange(index, "heading", e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleWhyAttendChange(index, "description", e.target.value)}
                />
              </div>
            </div>
          ))}

          {/* Agenda & VIPs */}
          <div className="form-section-title">Agenda &amp; Guests</div>

          <div className="form-group full">
            <label>Agenda</label>
            <textarea name="agenda" placeholder="Enter agenda details, schedule, speakers..." onChange={handleChange} rows={4} />
          </div>

          <div className="form-group full">
            <label>VIPs &amp; Chief Guests</label>
            <textarea name="vips" placeholder="Enter VIP and Chief Guest details..." onChange={handleChange} rows={3} />
          </div>

          {/* Benefits */}
          <div className="form-section-title">Benefits <span className="section-badge">4 Q&amp;A</span></div>
          {formData.benefits.map((item, index) => (
            <div key={index} className="section-box">
              <div className="section-box-num">{index + 1}</div>
              <div className="section-box-fields">
                <input
                  type="text"
                  placeholder="Benefit Heading"
                  value={item.question}
                  onChange={(e) => handleBenefitsChange(index, "question", e.target.value)}
                />
                <textarea
                  placeholder="Benefit Description"
                  value={item.answer}
                  onChange={(e) => handleBenefitsChange(index, "answer", e.target.value)}
                />
              </div>
            </div>
          ))}

          {/* FAQs */}
          <div className="form-section-title">Frequently Asked Questions <span className="section-badge">4 FAQs</span></div>
          {formData.faqs.map((item, index) => (
            <div key={index} className="section-box">
              <div className="section-box-num">{index + 1}</div>
              <div className="section-box-fields">
                <input
                  type="text"
                  placeholder="Question"
                  value={item.question}
                  onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                />
                <textarea
                  placeholder="Answer"
                  value={item.answer}
                  onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                />
              </div>
            </div>
          ))}

          <div className="form-footer">
            {successMsg && (
              <div style={{ color: "green", marginBottom: "12px", fontWeight: "600" }}>
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div style={{ color: "red", marginBottom: "12px", fontWeight: "600" }}>
                {errorMsg}
              </div>
            )}
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "⏳ Submitting..." : "🎉 Submit Event"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminEvent;
