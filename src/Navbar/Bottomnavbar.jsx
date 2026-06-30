// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FiHome,
//   FiPlay,
//   FiCalendar,
//   FiUser,
//   FiSettings
// } from "react-icons/fi";
// import "./Bottomnavbar.css";

// const Bottomnavbar = () => {
//   return (
//     <div className="bottom-navbar">
//       <NavLink
//         to="/"
//         end
//         className={({ isActive }) =>
//           isActive ? "nav-item active" : "nav-item"
//         }
//       >
//         <FiHome />
//       </NavLink>

//       <NavLink
//         to="/play"
//         className={({ isActive }) =>
//           isActive ? "nav-item active" : "nav-item"
//         }
//       >
//         <FiPlay />
//       </NavLink>

//       <NavLink
//         to="/book"
//         className={({ isActive }) =>
//           isActive
//             ? "nav-item active center-btn"
//             : "nav-item center-btn"
//         }
//       >
//         <FiCalendar />
//       </NavLink>

//       <NavLink
//         to="/profile"
//         className={({ isActive }) =>
//           isActive ? "nav-item active" : "nav-item"
//         }
//       >
//         <FiUser />
//       </NavLink>

//       <NavLink
//         to="/settings"
//         className={({ isActive }) =>
//           isActive ? "nav-item active" : "nav-item"
//         }
//       >
//         <FiSettings />
//       </NavLink>
//     </div>
//   );
// };

// export default Bottomnavbar;