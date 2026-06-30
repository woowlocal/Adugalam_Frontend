// src/ShopSports.jsx
import React from "react";
import { Tag, Truck, ShieldCheck, Star } from "lucide-react";

import "./ShopSports.css";
import { FiShoppingBag } from "react-icons/fi";
import { GiBasketballBall } from "react-icons/gi";

// Image imports
import footballImg from "../images/Foot Ball icon_Adugalam_Sports booking app.png";
import cricketImg from "../images/Cricket icon_Adugalam_Sports booking app.png";
import badmintonImg from "../images/Badminton 1 icon_Adugalam_Sports booking app.png";
import fitnessImg from "../assets/fitness.png";
import footwearImg from "../assets/footwear.png";
import sportswearImg from "../assets/sportswear.PNG";
import accessoriesImg from "../assets/accessories.PNG";


const categories = [
  { name: "Football Gear",      icon: <img src={footballImg}    alt="Football"   />, products: "500+ products" },
  { name: "Cricket Equipment",  icon: <img src={cricketImg}     alt="Cricket"    />, products: "800+ products" },
  { name: "Badminton Rackets",  icon: <img src={badmintonImg}   alt="Badminton"  />, products: "300+ products" },
  { name: "Basketball",         icon: <GiBasketballBall />,                          products: "200+ products" },
  { name: "Sportswear",         icon: <img src={sportswearImg}  alt="Sportswear" />, products: "1000+ products" },
  { name: "Footwear",           icon: <img src={footwearImg}    alt="Footwear"   />, products: "600+ products" },
  { name: "Accessories",        icon: <img src={accessoriesImg} alt="Accessories"/>, products: "400+ products" },
  { name: "Fitness Equipment",  icon: <img src={fitnessImg}     alt="Fitness"    />, products: "350+ products" },
];


const ShopSports = () => {
  return (
    <div className="shop-page">
      
      
      <section className="hero">
        <p className="hero-tag">Shop Sports Essentials</p>
        <p className="hero-text">
                    Everything you need to play your best

          Quality sports equipment, apparel and accessories from top brands 
        </p>
        <div className="hero-buttons">
          <button className="btn-pr">Browse Store</button>
        </div>
      </section>

      <section className="section category-section">
        <h2 className="section-title">Shop by Category</h2>

        <div className="category-grid">
          {categories.map((item, index) => (
            <div className="category-card" key={index}>
              <div className="category-icon">{item.icon}</div>
              <p>{item.name}</p>
              <div className="category-product">
              <p>{item.products}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      
       <section className="section features">
      <div className="feature">
        <div className="icon">
          <Tag size={40} />
        </div>
        <h3>Best Prices</h3>
        <p>Competitive pricing with exclusive member discounts.</p>
      </div>

      <div className="feature">
        <div className="icon">
          <Truck size={40} />
        </div>
        <h3>Fast Delivery</h3>
        <p>Quick delivery across Tamil Nadu with tracking.</p>
      </div>

      <div className="feature">
        <div className="icon">
          <ShieldCheck size={40} />
        </div>
        <h3>Genuine Products</h3>
        <p>100% authentic products from authorized .</p>
        <p>dealers</p>
      </div>

      <div className="feature">
        <div className="icon">
          <Star size={40} />
        </div>
        <h3>Player Reviews</h3>
        <p>Real reviews from verified players in our community.</p>
      </div>
    </section>

      <section className="section coming-soon">
  <div className="coming-icon">
    <FiShoppingBag class="coming"/>
  </div>

  <h3>Marketplace Coming Soon</h3>

  <p>
    We're building a comprehensive sports marketplace where you can buy
    equipment, rent gear, and even sell your used sports items. Stay tuned!
  </p>

  <button className="btn-outline">Get Early Access</button>
</section>
      
      <section className="section retailer-cta">
        <h2>Are You a Sports Retailer?</h2>
        <p>Partner with Adusports to expand your reach.</p>
        <button className="btn-primary">Become a Seller</button>
      </section>

      
      
    </div>
  );
};

export default ShopSports;
