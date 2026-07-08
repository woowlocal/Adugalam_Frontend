import React from "react";
import "./AllCategories.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AllCategories = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "Football", icon: "/Football.png" },
    { id: 2, name: "Tennis", icon: "/Tennis.png" },
    { id: 3, name: "Basketball", icon: "/Basketball.png" },
    { id: 4, name: "Volleyball", icon: "/VolleyBall.png" },
    { id: 5, name: "Cricket", icon: "/cricket.png" },
    { id: 6, name: "Badminton", icon: "/Badminton.png" },
    { id: 7, name: "Swimming", icon: "/Swimming.png" },
    { id: 8, name: "Archery", icon: "/Archery.png" },
    { id: 9, name: "Golf", icon: "/image.png" },
    { id: 10, name: "Kabaddi", icon: "/image copy.png" }
  ];


  const handleCategoryClick = (categoryName) => {
    navigate(`/?sport=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="allcat-page">

      {/* Header */}
      <div className="allcat-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft />
        </button>
        <h3>All Categories</h3>
      </div>

      {/* Categories Grid */}
      <div className="allcat-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="allcat-item"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <img src={cat.icon} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AllCategories;