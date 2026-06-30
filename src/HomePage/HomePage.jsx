import React from "react";
import "./HomePage.css";
import ground from "../assets/ground.jpg";
import { FiUsers } from "react-icons/fi";
import { LuBuilding } from "react-icons/lu";
import { LuGraduationCap } from "react-icons/lu";
import { GoTrophy } from "react-icons/go";
import { FaRegStar, } from "react-icons/fa";

import {
  FaBolt,
  FaShieldAlt,
  FaChartLine,
  FaWifi,
  FaCode,
  FaDatabase
} from "react-icons/fa";

import {
  FaUsers,
  FaBuilding,
  FaGraduationCap,
  FaStore,
  FaTrophy,
  FaChartBar,
} from "react-icons/fa";

import {
  FaUsers as FeatureUsers,
  FaPaperPlane as FeatureSend,
  FaTrophy as FeatureTrophy,
  FaStar as FeatureStar,
  FaCalendarCheck as FeatureCalendar,
  FaBolt as FeatureBolt,
  // FaWhatsapp as FeatureWhatsapp,
  FaLock as FeatureLock,
  FaChartLine as FeatureChart,
  FaShoppingBag as FeatureBag,
  FaTruck as FeatureTruck,
  FaTags as FeatureTags,
  FaMapMarkerAlt as FeatureMap,
  FaTicketAlt as FeatureTicket,
  FaImages as FeatureImages,
} from "react-icons/fa";

import { HiOutlineAcademicCap as FeatureAcademy } from "react-icons/hi";
import { useEffect } from "react";
import axios from "axios";
import Tvl from '../Tvl/Tvl.jsx'
import Hit from '../Tvl/Hit.jsx'
import Header from '../Components/Header/Header'
import Categories from '../Components/Categories/Categories'
import PopularGround from '../Components/PopularGround/PopularGround'
import Nearby from '../Components/NearBy/Nearby'
import Banner from '../Components/Banner/Banner'
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { useState } from "react";
import Run from "../Run.jsx";

import { useRef } from "react";



import API from "../api/api";

const Homepage = () => {

  const navigate = useNavigate();
  const featureRef = useRef(null);
  const builtRef = useRef(null);


  const [showHit, setShowHit] = useState(() => localStorage.getItem("hasHit") === "true");
  const [hitCount, setHitCount] = useState(0);
  const [selectedSport, setSelectedSport] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sport = searchParams.get("sport");
    if (sport) setSelectedSport(sport);
  }, [searchParams]);

  const handleSelectSport = (sportName) => {
    setSelectedSport(prev => prev === sportName ? null : sportName);
  };

  useEffect(() => {
    // Fetch initial hit stats
    API.get("api/hit-stats/")
      .then(res => {
        setHitCount(res.data.total_hits);
        if (res.data.has_hit) {
          setShowHit(true);
          localStorage.setItem("hasHit", "true");
        }
      })
      .catch(err => console.error("Hit stats error:", err));
  }, []);

  const handleHeartHit = () => {
    if (localStorage.getItem("hasHit") === "true") return; // Already hit — block
    API.post("api/record-hit/")
      .then(res => {
        setHitCount(res.data.total_hits);
        setShowHit(true);
        localStorage.setItem("hasHit", "true"); // Save one-time flag
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          alert("Please login to show your love for Adugalam!");
          navigate("/login");
        } else {
          console.error("Record hit error:", err);
        }
      });
  };







  useEffect(() => {
    const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "");
    axios.get(`${API_BASE}/api/home/`)
      .then(res => {
        console.log("Home API Response:", res.data);
      })
      .catch(err => {
        console.error("API ERROR:", err);
      });
  }, []);





  useEffect(() => {
    if (window.innerWidth > 640) return; // ONLY mobile

    const autoScroll = (ref) => {
      if (!ref.current) return;

      let scrollAmount = 0;
      const speed = 0.5; // swipe speed

      const interval = setInterval(() => {
        if (!ref.current) return;

        scrollAmount += speed;
        ref.current.scrollLeft += speed;

        // Reset when end reached
        if (
          ref.current.scrollLeft + ref.current.clientWidth >=
          ref.current.scrollWidth - 5
        ) {
          ref.current.scrollLeft = 0;
          scrollAmount = 0;
        }
      }, 20);

      return interval;
    };

    const featureInterval = autoScroll(featureRef);
    const builtInterval = autoScroll(builtRef);

    return () => {
      clearInterval(featureInterval);
      clearInterval(builtInterval);
    };
  }, []);




  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Run />;
  }








  return (

    <div className="home">
      <div className="home-container">
        <Header />
        <Banner />
        <Categories selectedSport={selectedSport} onSelectSport={setSelectedSport} />
        <Nearby selectedSport={selectedSport} />
        <PopularGround selectedSport={selectedSport} />
        {/* <Tvl/>   */}

        {!showHit ? (
          <Tvl onHit={handleHeartHit} hitCount={hitCount} />
        ) : (
          <Hit hitCount={hitCount} />
        )}
      </div>







      {/* HERO SECTION */}
      <div
        className="hero1 "
        style={{
          backgroundImage: `url(${ground})`,
        }}
      >
        <div className="overlay1">

          <div className="hero-content1 glass1">
            <h1>
              Turf Booking <br />
              <span className="highlight1">Platform</span>
            </h1>

            <h2 className="sub-highlight1">Play Anytime. Book Any Venue</h2>

            <p className="description1">
              Discover players near you, join games instantly, book venues in seconds,
              train with certified coaches, shop hyperlocal sports gear, and explore
              tournaments & events - all in one powerful app
            </p>

            <div className="hero-buttons1">
              <button className="primary-btn1"
                onClick={() => navigate("/Bookhome")}>Start Playing Now</button>
              <button className="primary-btn1"
                onClick={() => navigate("/partner")}>
                List Your Venue / Academy / Shop
              </button>
            </div>

            <div className="stats1">
              <div className="stat1">
                <h3>10,000+</h3>
                <p>Players</p>
              </div>
              <div className="stat1">
                <h3>100+</h3>
                <p>Cities</p>
              </div>
              <div className="stat1">
                <h3>200+</h3>
                <p>Sports</p>
              </div>
              <div className="stat1">
                <h3>1,200+</h3>
                <p>Matches Hosted</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ECOSYSTEM SECTION (BELOW HERO) */}
      <div className="ecosystem1">
        <h2 className="ecosystem-title1">
          Book Sports Turf in Tamil Nadu – Football, Cricket & More
        </h2>

        <p className="ecosystem-desc1">
          Book football turfs, cricket grounds, badminton courts, and pickleball courts across Tamil Nadu. <br /> Find and reserve nearby turf venues quickly with real-time availability and easy booking options
        </p>

        <p className="ecosystem-solution1">
          Our platform connects players, sports venues, coaches, event organizers, and sports shops in one powerful sports community
        </p>
      </div>


      {/* FEATURES SECTION */}
      <div className="features1">
        <h2 className="features-title1">
          Play. Book. Train. Shop. Compete – All in One Sports Community Platform
        </h2>
        <p className="features-subtitle1">
          Everything you need in one powerful sports community platform
        </p>

        <div className="features-flex1" ref={featureRef}>

          {/* PLAY */}
          <div className="feature-card51" onClick={() => navigate("/play")}>
            <h4 className="feature-tag1">PLAY</h4>
            <h3>Match With Players Instantly</h3>
            <p>Connect with anyone in Tamil Nadu who wants to play the same sport as you.</p>
            <ul>
              <li><FeatureUsers /> Discover players nearby</li>
              <li><FeatureSend /> Send & receive play requests</li>
              <li><FeatureTrophy /> Join ongoing games or host your own match</li>
              <li><FeatureStar /> Build your Adugalam Skill Score</li>
            </ul>
            <div className="feature-para1">
              <p>Find players for cricket, football, badminton, volleyball, kabaddi, table tennis, and more - across Tirunelveli, Madurai, Coimbatore, Trichy, Chennai, and every district.</p>
            </div>
          </div>

          {/* BOOK */}
          <div className="feature-card51" onClick={() => navigate("/Bookhome")}>
            <h4 className="feature-tag1">BOOK</h4>
            <h3>Smart Venue Booking for Every Sport</h3>
            <p>Book courts, turfs, grounds, and sports venues across Tamil Nadu in seconds.</p>
            <ul>
              <li><FeatureCalendar /> Real-time availability</li>
              <li><FeatureBolt /> Instant booking confirmation</li>
              {/* <li><FeatureWhatsapp /> Invite players via WhatsApp</li> */}
              <li><FeatureStar /> Earn credibility through reviews</li>
            </ul>
            <div className="feature-para1">
              <p>Adugalam partners with 100+ venues across Tamil Nadu to make booking sports venues faster, safer, and transparent.</p>
            </div>
          </div>

          {/* TRAIN */}
          <div className="feature-card51" onClick={() => navigate("/train")}>
            <h4 className="feature-tag1">TRAIN</h4>
            <h3>Learn From Certified Coaches</h3>
            <p>Choose from the best trainers in your city.</p>
            <ul>
              <li><FeatureAcademy /> Book coaching programs</li>
              <li><FeatureLock /> Pay securely</li>
              <li><FeatureChart /> Track your progress</li>
              <li><FeatureUsers /> Join beginner to advanced batches</li>
            </ul>
            <div className="feature-para1">
              <p>Find badminton coaches, football academies, swimming instructors, cricket trainers, and fitness coaches across Tamil Nadu.</p>
            </div>
          </div>

          {/* SHOP */}
          <div className="feature-card51" onClick={() => navigate("/shop")}>
            <h4 className="feature-tag1">SHOP</h4>
            <h3>Hyperlocal Sports Marketplace</h3>
            <p>Support local sports shops & get fast delivery.</p>
            <ul>
              <li><FeatureBag /> Football, cricket, badminton gear</li>
              <li><FeatureTruck /> Same-day delivery in select areas</li>
              <li><FeatureTags /> Price transparency & exclusive deals</li>
              <li><FeatureStar /> Verified buyer reviews</li>
            </ul>
            <div className="feature-para1">
              <p>Buy sports items locally from trusted shops in Tamil Nadu. Faster and cheaper than national e-commerce platforms.</p>
            </div>
          </div>

          {/* TOURNAMENTS */}
          <div className="feature-card51" onClick={() => navigate("/tournaments")}>
            <h4 className="feature-tag1">TOURNAMENTS</h4>
            <h3>Participate, Organize, Win</h3>
            <p>Stay updated with tournaments happening across Tamil Nadu.</p>
            <ul>
              <li><FeatureTrophy /> Current & upcoming tournaments</li>
              <li><FeatureUsers /> Register your team</li>
              <li><FeatureCalendar /> Book venues for tournaments</li>
              <li><FeatureChart /> Live brackets & score updates</li>
            </ul>

          </div>

          {/* EVENTS */}
          <div className="feature-card51" onClick={() => navigate("/events")}>
            <h4 className="feature-tag1">EVENTS</h4>
            <h3>Discover Sports Events in Tamil Nadu</h3>
            <p>From fun runs to marathons, sports expos, coaching camps.</p>
            <ul>
              <li><FeatureCalendar /> Event details & registration</li>
              <li><FeatureMap /> Location maps</li>
              <li><FeatureTicket /> Tickets & booking</li>
              <li><FeatureImages /> Media & photos</li>
            </ul>
          </div>

        </div>
      </div>



      {/* ================= BUILT FOR EVERY SPORTS LOVER ================= */}
      <div className="built-section1">
        <h2 className="built-title1">Built for Every Sports Lover</h2>

        <p className="built-subtitle1">
          Join Tamil Nadu Sports Community & Book Turf Easily
        </p>

        <div className="built-grid1" ref={builtRef}>
          <div className="built-card1">
            <div className="built-icon1">
              <FaUsers />
            </div>
            <h3>Players</h3>
            <p>Find partners, build your rating, play regularly.</p>
          </div>

          <div className="built-card1">
            <div className="built-icon1">
              <FaBuilding />
            </div>
            <h3>Venue Owners</h3>
            <p>Increase bookings, manage timings, gain visibility.</p>
          </div>

          <div className="built-card1">
            <div className="built-icon1">
              <FaGraduationCap />
            </div>
            <h3>Coaches</h3>
            <p>Grow your academy and earn reputation.</p>
          </div>

          <div className="built-card1">
            <div className="built-icon1">
              <FaStore />
            </div>
            <h3>Shops</h3>
            <p>Sell more without competing against big marketplaces.</p>
          </div>

          <div className="built-card1">
            <div className="built-icon1">
              <FaTrophy />
            </div>
            <h3>Organizers</h3>
            <p>Run smoother tournaments & events.</p>
          </div>

          <div className="built-card1">
            <div className="built-icon1">
              <FaChartBar />
            </div>
            <h3>Investors & Partners</h3>
            <p>
              Join the fastest growing sports-tech ecosystem in Tamil Nadu.
            </p>
          </div>
        </div>
      </div>



      {/* ================= TECH STACK SECTION ================= */}
      <div className="tech-section1">
        <h2 className="tech-title1">
          Turf Booking Platform in Tamil Nadu – Adugalam
        </h2>

        <p className="tech-subtitle1">
          Adugalam is a turf booking platform in Tamil Nadu that helps you book football and cricket turfs easily <br /> Find nearby sports venues, check availability, and book turf online instantly
        </p>

        <div className="tech-box1">
          <p className="tech-desc1">
            Adugalam is engineered with a fast and scalable React JS frontend and a
            secure Python backend. This ensures:
          </p>

          <div className="tech-grid1">
            <div className="tech-item1">
              <FaBolt className="tech-icon1" />
              <span>Lightning-fast UI</span>
            </div>

            <div className="tech-item1">
              <FaShieldAlt className="tech-icon1" />
              <span>High security for payments & user data</span>
            </div>

            <div className="tech-item1">
              <FaChartLine className="tech-icon1" />
              <span>Scalable architecture for 1,00,000+ users</span>
            </div>

            <div className="tech-item1">
              <FaWifi className="tech-icon1" />
              <span>Real-time match updates</span>
            </div>

            <div className="tech-item1">
              <FaCode className="tech-icon1" />
              <span>Optimized API for training programs & bookings</span>
            </div>

            <div className="tech-item1">
              <FaDatabase className="tech-icon1" />
              <span>Secure Python backend</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= GREEN STATS SECTION ================= */}
      <div className="stats-green1">
        <h2 className="stats-green-title1">
          Tamil Nadu's Fastest-Growing Sports Community
        </h2>

        <div className="stats-green-grid1">
          <div className="stats-green-item1">
            <div className="stats-green-icon1">
              <FaRegStar size={20} />
            </div>
            <h3>4.9/5</h3>
            <p>Player Rating</p>
          </div>

          <div className="stats-green-item1">
            <div className="stats-green-icon1">
              <FiUsers size={20} />
            </div>
            <h3>10,000+</h3>
            <p>Players Engaged</p>
          </div>

          <div className="stats-green-item1">
            <div className="stats-green-icon1">
              <LuBuilding size={20} />
            </div>
            <h3>100+</h3>
            <p>Venues Onboarded</p>
          </div>

          <div className="stats-green-item1">
            <div className="stats-green-icon1">
              <LuGraduationCap size={25} />
            </div>
            <h3>200+</h3>
            <p>Coaches Listed</p>
          </div>

          <div className="stats-green-item1">
            <div className="stats-green-icon1">
              <GoTrophy size={20} />
            </div>
            <h3>1,200+</h3>
            <p>Matches Hosted</p>
          </div>
        </div>
      </div>



      {/* ================= INFO PARAGRAPH ================= */}
      <div className="info-section1">
        <p>
          Adugalam is a sports venue booking platform in Tamil Nadu that helps players book football turfs, cricket grounds, and badminton courts online.
          Find turf booking in Tirunelveli, football grounds in Tenkasi, and cricket grounds in Thoothukudi with real-time availability.
          Connect with local players, join matches, and
          explore sports venues across Tenkasi, Kanyakumari, Virudhunagar, Ramanathapuram, Sivagangai, Theni, and Dindigul, with expansion planned across more regions
        </p>
      </div>

      {/* ================= TESTIMONIALS ================= */}
      <div className="testimonials1">
        <h2 className="testimonials-title1">What Our Community Says</h2>
        <p className="testimonials-subtitle1">
          Real stories from players, venue owners, and coaches
        </p>

        <div className="testimonials-grid1">
          <div className="testimonial-card1">
            <div className="stars1">
              ★★★★★
            </div>
            <p className="testimonial-text1">
              "Finding players for badminton was always a challenge. Adugalam made it
              so easy!"
            </p>
            <h4>Rajesh Kumar</h4>
            <span>Player</span>
          </div>

          <div className="testimonial-card1">
            <div className="stars1">
              ★★★★★
            </div>
            <p className="testimonial-text1">
              "Our bookings increased by 40% after partnering with Adugalam."
            </p>
            <h4>Priya Venkatesh</h4>
            <span>Venue Owner</span>
          </div>

          <div className="testimonial-card1">
            <div className="stars1">
              ★★★★★
            </div>
            <p className="testimonial-text1">
              "I can now reach more students and manage my batches efficiently."
            </p>
            <h4>Coach Selvam</h4>
            <span>Cricket Coach</span>
          </div>
        </div>
      </div>


      {/* ================= BECOME A PARTNER ================= */}
      <div className="stats-green1">
        <h2 className="stats-green-title1">Become a Partner</h2>

        <p className="partner-desc1">
          Join Adugalam as a Venue Partner, Coach, Shop Owner, or Event Organizer and
          grow your business with Tamil Nadu's fastest-growing sports community.
        </p>

        <div className="partner-buttons1">
          <button className="partner-btn1 primary1" onClick={() => navigate("/partner")}>Partner With Us</button>
          <button className="partner-btn1 secondary1" onClick={() => navigate("/Contact")}>Contact Us</button>
        </div>
      </div>


    </div>

  );
};

export default Homepage;