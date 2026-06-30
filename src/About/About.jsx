import React from "react";
import "./About.css";
import { FiZap } from "react-icons/fi";
import { FaHeart, FaBullseye } from "react-icons/fa";
import { RiGroupLine, RiComputerLine, RiTeamLine } from "react-icons/ri";
import { CiLocationOn } from "react-icons/ci";
import { GiTrophyCup } from "react-icons/gi";

import { useEffect,useState } from "react";
import Loader from "../Loader.jsx";

const About = () => {


const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }



  return (
    
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero"   >
        <h1>About Adugalam</h1>
        <p className="about-subtitle">
          Adugalam is a sports venue booking platform in Tamil Nadu that helps players discover and book football turfs, cricket grounds, and badminton courts online with real-time availability and instant confirmation.
          The platform makes it easy to join matches, connect with players, and explore training programs, tournaments, and sports events in one place.
          By bringing together players, venue owners, coaches, and organizers, Adugalam creates a seamless and reliable experience that helps users stay active, improve their game, and engage with a growing sports community
        </p>

        <div className="about-stats1">
          <div className="stat-card1">
            <h2>500+</h2>
            <p>Venues Listed</p>
          </div>
          <div className="stat-card1">
            <h2>50,000+</h2>
            <p>Booking Slots</p>
          </div>
          <div className="stat-card1">
            <h2>25+</h2>
            <p>Cities Covered</p>
          </div>
          <div className="stat-card1">
            <h2>10,000+</h2>
            <p>Happy Players</p>
          </div>
        </div>
          <div className="stat-line"></div>
      </section>

      {/* Our Story */}
      <section className="about-section1">
        <h3>Our Story</h3>
        <p>
          Adugalam was created to simplify sports venue booking in Tamil Nadu. Finding football turfs, cricket grounds, badminton courts, and volleyball venues was often difficult due to manual bookings, unclear pricing, and lack of real-time availability
        </p>
        <p>
         To solve this, we built Adugalam to provide instant turf booking, transparent pricing, and real-time updates. Today, the platform connects players, coaches, venue owners, and sports communities in one place, making it easier to play, train, and organize games
        </p>
        <p>
          Our mission is simple, to make sports more accessible and easier to book for everyone
        </p>
      </section>

      {/* What Drives Us */}
      <section className="about-section">
        <h2>What Drives Us</h2>
        <p className="new8">What Motivates Us</p>
        <div className="card-row">
          <div className="info-card">
            {/* <div className="card-icon">🎯</div> */}
             <div className="card-icon"><FaBullseye size={30}  color="#15803d"/></div>    
            <h4>Our Mission</h4>
            <p>
              To make sports more accessible by helping players discover venues, book turfs, and join games with ease 
               {/* coaches and community. */}
            </p>
          </div>
          <div className="info-card">
             {/* <div className="card-icon"><FaHeart /></div> */}
             <div className="card-icon heart-icon"><svg xmlns="http://www.w3.org/2000/svg"  height="35px" viewBox="0 -960 960 960" width="35px"   fill="currentColor"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg></div>
            <h4>Our Passion</h4>
            <p>
              We believe sports bring people together, build communities, and promote active and healthy lifestyles
            </p>
          </div>
          <div className="info-card">
              <div className="card-icon"><FiZap  size={30}  color="#15803d"/></div> 
            <h4>Our Promise</h4>
            <p>
              Instant bookings, transparent pricing, and a seamless experience from search to play.
            </p>
          </div>
        </div>
      </section>

      {/* Where We Operate */}
      <section className="about-section">
         <h3><CiLocationOn color="#15803d"/> <span>Where We Operate</span> </h3>  
            <p>
          Adugalam is a sports venue booking platform currently serving players across key cities in Tamil  Nadu, with continuous expansion into new locations: 
        </p>
        <div className="pill-row">
          <span className="pill">Tirunelveli</span>
          <span className="pill">Tenkasi</span>
          <span className="pill">Thoothukudi</span>
          <span className="pill">Madurai</span>
          <span className="pill">Trichy</span>
          <span className="pill">Erode</span>
          <span className="pill">Vellore</span>
          <span className="pill">Thanjavur</span>
          <span className="pill pill-muted">+ More coming soon</span>
        </div>
      </section>

      {/* Our Team */}
   <section className="about-section">
  <h2>Our Team</h2>
  {/* <p className="new9">Our Group</p> */}

  <div className="card-row">
    {/* Card 1 */}
    <div className="info-card">
      <div className="team-icon">
        <RiGroupLine color="#15803d" />
      </div>
      <h4>Sports Enthusiasts</h4>
      <p>Built by players, for players who love the<span> games</span></p>
    </div>

    {/* Card 2 */}
    <div className="info-card">
      <div className="team-icon">
        <RiGroupLine color="#15803d"/>
      </div>
      <h4>Tech Innovators</h4>
      <p>Creating seamless and reliable sports booking<span>experiences</span></p>
    </div>

    {/* Card 3 */}
    <div className="info-card">
      <div className="team-icon">
       <RiGroupLine color="#15803d"/>
      </div>
      <h4>Community Builders</h4>
      <p>Connecting players and growing the sports community across<span>Tamil Nadu</span></p>
    </div>
  </div>
</section>


      {/* Bottom CTA */}
      <section className="about-cta">
        <div className="tropy"><GiTrophyCup /></div>
        <h3>Join the Adugalam Community</h3>
        <p>
          Whether you're looking to book football turfs, cricket grounds, or badminton courts across cities like Tenkasi, Tirunelveli, and Thoothukudi
          Adugalam makes it easy to find nearby venues, join matches, and connect with players across Tamil Nadu
        </p>
      </section>
    </div>
  );
};

export default About;