import "./ScheduleTime.css";
import { NavLink } from "react-router-dom";

import { VENDOR_SIDEBAR_LINKS } from "./VendorSidebar";

export default function ScheduleTime() {
  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Turf Manager</h2>
        <div className="role"></div>

        <ul>
          {VENDOR_SIDEBAR_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path}>{link.label}</NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>Schedule Time Slots</h1>
        </div>

        <div className="schedule-card">
          <form>
            <div className="form-row">
              <div>
                <label>Date</label>
                <input type="date" required />
              </div>

              <div>
                <label>Turf</label>
                <select required>
                  <option value="">Select Turf</option>
                  <option>Turf 1</option>
                  <option>Turf 2</option>
                  <option>Turf 3</option>
                </select>
              </div>
            </div>

            {/* Morning */}
            <TimeSection
              title="Morning (04:00 AM - 12:00 PM)"
              slots={[
                "04:00 - 05:00",
                "05:00 - 06:00",
                "06:00 - 07:00",
                "07:00 - 08:00",
                "08:00 - 09:00",
                "09:00 - 10:00",
                "10:00 - 11:00",
                "11:00 - 12:00",
              ]}
            />

            {/* Afternoon */}
            <TimeSection
              title="Afternoon (12:00 PM - 04:00 PM)"
              slots={[
                "12:00 - 01:00",
                "01:00 - 02:00",
                "02:00 - 03:00",
                "03:00 - 04:00",
              ]}
            />

            {/* Evening */}
            <TimeSection
              title="Evening (04:00 PM - 08:00 PM)"
              slots={[
                "04:00 - 05:00",
                "05:00 - 06:00",
                "06:00 - 07:00",
                "07:00 - 08:00",
              ]}
            />

            {/* Night */}
            <TimeSection
              title="Night (08:00 PM - 12:00 AM)"
              slots={[
                "08:00 - 09:00",
                "09:00 - 10:00",
                "10:00 - 11:00",
                "11:00 - 12:00",
              ]}
            />

            <button className="btn">Save Schedule</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Reusable Time Section */
function TimeSection({ title, slots }) {
  return (
    <div className="time-section">
      <h3>{title}</h3>
      <div className="time-slots">
        {slots.map((slot, index) => (
          <label key={index} className="slot">
            <input type="checkbox" /> {slot}
          </label>
        ))}
      </div>
    </div>
  );
}
