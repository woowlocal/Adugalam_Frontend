import { NavLink, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    sessionStorage.clear();
    navigate("/AdminLogin");
  };

  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <h2 className="logo">Adugalam</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Menu..."
        className="menu-search"
      />

      {/* MAIN */}
      <p className="menu-title">MAIN</p>
      <ul>
        <li>
          <NavLink to="/Dashboard">Dashboard</NavLink>
        </li>
      </ul>

      {/* MANAGEMENT */}
      <p className="menu-title">MANAGEMENT</p>
      <ul>
        {/* <li><NavLink to="/Vendor">Vendor Management</NavLink></li> */}
        <li><NavLink to="/UserManagement">User Management</NavLink></li>
        {/* <li><NavLink to="/TurfManagement">Turf Management</NavLink></li> */}
        <li><NavLink to="/BookingManagement">Booking Management</NavLink></li>
        <li><NavLink to="/PaymentsReport">Payments & Reports</NavLink></li>
        <li><NavLink to="/contact-messages">Contact Messages</NavLink></li>
        {/* <li><NavLink to="/AdminSettings">Settings</NavLink></li> */}
        <li><NavLink to="/BannerManagement">Homepage Banner</NavLink></li>
      </ul>
      <p className="menu-title">Turf MANAGEMENT</p>
      <ul>
        <li><NavLink to="/AddVendor">Add Vendor </NavLink></li>
        <li><NavLink to="/AddTurf">Add Turf</NavLink></li>
        <li><NavLink to="/TurfList">Turf List</NavLink></li>
        <li><NavLink to="/VendorRequest">Vendor Request </NavLink></li>
        <li><NavLink to="/VendorList">Vendor List </NavLink></li>
      </ul>


      <p className="menu-title">Event MANAGEMENT</p>
      <ul>
        <li><NavLink to="/AdminEvent">Add Events </NavLink></li>
        <li><NavLink to="/Eventlist">Event List</NavLink></li>
        <li><NavLink to="/EventReviews">Event Reviews</NavLink></li>
      </ul>

      {/* Logout */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}