import React from "react";
import "./Privacy.css";
import { FaArrowLeft } from "react-icons/fa";
import { VscChevronLeft } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-page">
      <div className="privacy-card">
        {/* Header */}
        <div className="privacy-header">
          <span>
               <button className="animated-back-btn" data-text="Back" onClick={() => navigate(-1)}>
                 <VscChevronLeft className="animated-back-icon" />
               </button>
          </span>
         
          <h2>Privacy policy</h2>
        </div>

        {/* Content */}
        <div className="privacy-content">
          <h3>1. Types of data we collect</h3>
          <p>
            Duis tristique diam nunc. Sed at tincidunt orci. Mauris
            egestas congue leo, cras erat at vitae convallis.
            Duis semper magna nec tortor tincidunt, id tincidunt
            quam blandit. Vivamus vehicula dictum magna quis
            eleifend. Fusce ac odio ac nibh tempus euismod.
          </p>

          <h3>2. Use of your personal data</h3>
          <p>
            Sed sollicitudin nisi mollis libero consectetur rutrum.
            Nam maximus mollis nisl quis facilisis. Integer
            fermentum commodo nibh. Ut mollis tincidunt
            hendrerit. Duis ipsum velit, maximus sed commodo
            imperdiet, dapibus id velit.
          </p>

          <h3>3. Disclosure of your personal data</h3>
          <p>
            Sed sollicitudin nisi mollis libero consectetur rutrum.
            Nam maximus mollis nisl quis facilisis. Integer
            fermentum commodo nibh. Ut mollis tincidunt
            hendrerit. Duis ipsum velit, maximus sed commodo
            imperdiet, dapibus id velit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
