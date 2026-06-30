import { NavLink } from "react-router-dom";

function sidebar()
{
  return(

  
  <div className="sidebar">
  <h2>Adugalam</h2>
  <ul>
    <li className="active">
      <NavLink to="/Dashboard">Dashboard</NavLink>
    </li>

    <li>
      <NavLink to="/Vendor">Vendor Management</NavLink>
    </li>

    <li>
      <NavLink to="/UserManagement">User Management</NavLink>
    </li>

    <li>
      <NavLink to="/TurfManagement">Turf Management</NavLink>
    </li>

    <li>
      <NavLink to="/BookingManagement">Booking Management</NavLink>
    </li>

    <li>
      <NavLink to="/PaymentsReport">Payments & Reports</NavLink>
    </li>
    <li>
      <NavLink to="/contact-messages">Contact Messages</NavLink>
    </li>
    <li>
      <NavLink to="/AdminSettings">Settings</NavLink>
    </li>

    <li className="logout">
      <NavLink to="/login">Logout</NavLink>
    </li>
  </ul>
</div>
  );
}
export default sidebar;
