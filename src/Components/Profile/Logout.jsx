import React from 'react'
import "./logout.css"
import { RiLogoutBoxFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../utils/auth";
import { MdLogout } from "react-icons/md";
const Logout = ({ setOpen }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Use central logout utility
    logoutUser();

    // Close popup
    if (setOpen) {
      setOpen(false);
    }

    // Signal that the login popup should open on the next page load
    sessionStorage.setItem("showLoginPopup", "true");

    // Force complete page reload and navigation
    window.location.assign("/");
  };

  return (
    <div className='logout-container'>
      <div className="popup">

        {/* Icon in a colored circle */}
        <div className="logout-icon-wrap">
          <MdLogout className='logout-icon' />
        </div>

        <p className="popup-title">Log out?</p>
        <p>Are you sure you want to log out of your account?</p>

        <div className="btn-holder">
          <button type="button" className='cancel-btn' onClick={() => {
            if (setOpen) setOpen(false);
          }}>Cancel</button>
          <button
            type="button"
            className='logout-btn'
            onClick={(e) => {
              console.log("Logout button clicked");
              handleLogout(e);
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Logout
