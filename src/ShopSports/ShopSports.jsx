import React, { useState, useEffect } from "react";
import "./ShopSports.css";
import { FiShoppingBag } from "react-icons/fi";
import Banner from "../Components/Banner/Banner.jsx";
import Loader from "../Loader.jsx";

// Import icons that actually exist
import FootballIcon from "../images/Foot Ball icon_Adugalam_Sports booking app.png";
import CricketIcon from "../images/Cricket icon_Adugalam_Sports booking app.png";
import BadmintonIcon from "../images/Badminton 1 icon_Adugalam_Sports booking app.png";
import fitnessIcon from "../assets/fitness.png";

const categories = [
  { name: "Football Gear", icon: FootballIcon, products: "500+ products" },
  { name: "Cricket Equipment", icon: CricketIcon, products: "800+ products" },
  { name: "Badminton Rackets", icon: BadmintonIcon, products: "300+ products" },
  { name: "Sportswear", icon: "👕", products: "1000+ products" },
  { name: "Footwear", icon: "👟", products: "600+ products" },
  { name: "Accessories", icon: "🧦", products: "400+ products" },
  { name: "Fitness Equipment", icon: fitnessIcon, products: "350+ products" },
];

const ShopSports = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="shop-sports">
      <Banner />

      {/* Hero */}
      <section className="shop-hero1">
        {/* <p className="shop-hero-tag1">Buy Sports Equipment Online</p> */}
        <h1 className="shop-hero-tag1">Buy Sports Equipment Online</h1>
        <p className="shop-hero-text1">
          Shop football, cricket, badminton gear, sportswear, and fitness equipment in Tirunelveli. Enjoy fast delivery across Tamil Nadu
        </p>
        <button className="shop-btn-pr1">Browse Store</button>
      </section>
      <div className="container">
        <div className="section-header">
          <FiShoppingBag className="section-icon" />
          <h2>Shop by Category</h2>
        </div>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">
                {category.icon.includes('/') ? (
                  <img src={category.icon} alt={category.name} />
                ) : (
                  <span style={{ fontSize: '40px', lineHeight: 1 }}>{category.icon}</span>
                )}
              </div>
              <h3>{category.name}</h3>
              <p>{category.products}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <h2 className="shop-section-title1 bowl">Features</h2>
      <p className="apples5">Store Characteristics</p>

      <section className="features-section1">

        <div className="feature-item1">
          <div className="feature-icon1">🏷️</div>
          <h4>Best Prices</h4>
          <p>Competitive pricing with exclusive member discounts</p>
        </div>

        <div className="feature-item1">
          <div className="feature-icon1">🚚</div>
          <h4>Fast Delivery</h4>
          <p>Quick delivery across Tamil Nadu with tracking</p>
        </div>

        <div className="feature-item1">
          <div className="feature-icon1">🛡️</div>
          <h4>Genuine Products</h4>
          <p>100% authentic products from authorized dealers</p>
        </div>

        <div className="feature-item1">
          <div className="feature-icon1">⭐</div>
          <h4>Player Reviews</h4>
          <p>Real reviews from verified players in our community</p>
        </div>
      </section>

      {/* Marketplace Coming Soon */}
      <section className="marketplace-wrapper1">
        <div className="marketplace-card1">
          <FiShoppingBag size={40} className="marketplace-icon1" />
          <h3>Marketplace Coming Soon</h3>
          <p>
            Buy, sell, or rent sports equipment in Tamilnadu. Get early access to our online sports marketplace across Tamil Nadu
          </p>
          <button className="marketplace-btn1">Get Early Access</button>
        </div>
      </section>

      {/* Retailer CTA */}
      <section className="retailer-section1">
        <h2>Are You a Sports Retailer?</h2>
        <p>
          Partner with Adugalam to reach thousands of sports enthusiasts across
          Tamil Nadu.
        </p>
        <button className="retailer-btn1">Become a Seller</button>
      </section>
    </div>
  );
};

export default ShopSports;