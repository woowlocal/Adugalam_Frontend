import React from 'react'
import "./Play.css"
import { IoIosFootball } from "react-icons/io";
import { TbCricket } from "react-icons/tb";
import { MdSportsTennis } from "react-icons/md";
import { GiTennisRacket } from "react-icons/gi";
import { FaBasketball } from "react-icons/fa6";
import { TbBallVolleyball } from "react-icons/tb";
import { IoIosBasketball } from "react-icons/io";
// import "./Favourite.css"


import { Routes, Route, useNavigate } from "react-router-dom";
import Football from "../pages/Football.jsx";
import Cricket from "../pages/Cricket.jsx";



import { FiUsers } from "react-icons/fi";
import { MdEventAvailable } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import { AiOutlineSchedule } from "react-icons/ai";


import FootballIcon from "../images/Foot Ball icon_Adugalam_Sports booking app.png";
import CricketIcon from "../images/Cricket icon_Adugalam_Sports booking app.png";
import BadmintonIcon from "../images/Badminton 1 icon_Adugalam_Sports booking app.png";
import BasketballIcon from "/Swimming.png";
import TennisIcon from "../images/Tennis icon_Adugalam_Sports booking app.png";
import VolleyballIcon from "../images/Sports Vector - Intro Adugalam (4).png";
import StarIcon from "../icons/star.svg";


import Banner from "../Components/Banner/Banner.jsx";


import { useEffect, useState } from "react";
import Loader from "../Loader.jsx";



const sportsData = [
  {
    icon: FootballIcon,
    name: "Football",
    players: "2,500+ players",
    venues: "150+ venues",
    // path: "football"
  },
  {
    icon: CricketIcon,
    name: "Cricket",
    players: "3,200+ players",
    venues: "200+ venues",
    path: "cricket"
  },
  {
    icon: BadmintonIcon,
    name: "Badminton",
    players: "1,800+ players",
    venues: "120+ venues",
    path: "badminton"
  },
  {
    icon: BasketballIcon,
    name: "Swimming",
    players: "900+ players",
    venues: "60+ venues",
    path: "basketball"
  },
  {
    icon: TennisIcon,
    name: "Tennis",
    players: "600+ players",
    venues: "45+ venues",
    path: "tennis"
  },
  {
    icon: VolleyballIcon,
    name: "Volleyball",
    players: "750+ players",
    venues: "50+ venues",
    path: "volleyball"
  }
];




function Play() {


  const navigate = useNavigate();


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
    <div className="heading-section11">
      <Banner />
      <br></br>
      <br></br>
      <div className="grade11">
        <h1 className="head11">Find & Book the Best Turf in Tirunelveli for Football & Cricket</h1>
        <br></br><h6 className="subtitle11">
          Play football, cricket, badminton, tennis, swimming, and volleyball on the best turf in Tirunelveli.
          Discover local matches, connect with nearby players, and book your preferred turf easily to start playing instantly
        </h6>
        <div className="button-row11">
          <button className="start5" onClick={() => navigate("/Bookhome")}>Start Playing →</button>
          <button className="venue-btn11" onClick={() => navigate("/FindVenues")}>Find Venues</button>
        </div>
      </div>


      <h2 className="popular-heading11">Sports turf near me</h2><br />
      <h className="apple">Play football, cricket, badminton, tennis, swimming, and volleyball in Tirunelveli. Find local matches and connect with sports players near you</h>



      <div className="sports-row11">
        {sportsData.map((sport, index) => (
          <div className="sport-card11" key={index} style={{ cursor: "default" }} >
            <img src={sport.icon} className="icon11" />
            <h3>{sport.name}</h3>
            <p className="play11">{sport.players}</p>
            <p className="venue11">{sport.venues}</p>
          </div>
        ))}
      </div>




      <div className="how-works-heading11 text-center">
        <h2 className="text-4xl font-bold text-black">How to Play & Book Turf in Tirunelveli</h2><br />
        <h className='apple'>Join Matches & Book Turf Online</h>

      </div>


      <div className="how-row11">

        <div className="how-card11">
          <FiUsers className="how-icon11" />
          <h3>Find Players</h3>
          <p className="how-sub11">
            Connect with players who share your interests and skill level
          </p>
        </div>

        <div className="how-card11">
          <MdEventAvailable className="how-icon11" />
          <h3>Join Matches</h3>
          <p className="how-sub11">
            Get notified when players book slots for your favourite sports
          </p>
        </div>

        <div className="how-card11">
          <FaMapMarkedAlt className="how-icon11" />
          <h3>Discover Venues</h3>
          <p className="how-sub11">
            Find the best turfs and courts near you with real time availability
          </p>
        </div>

        <div className="how-card11">
          <AiOutlineSchedule className="how-icon11" />
          <h3>Easy Scheduling</h3>
          <p className="how-sub11">
            Book slots instantly and manage your sports calendar
          </p>
        </div>

      </div>
      <div className="interest-card11">
        <div className="interest-header11">
          <img src={StarIcon} className="star11" />
          <span>Player Interest Matching</span>
        </div>

        <p className="interest-sub11">
          When you sign up, tell us your favourite sports. We’ll notify you whenever other players
          book slots for the same sports near you. Never miss a chance to join a game!
        </p>

        <button className="interest-btn11" onClick={() => navigate("/SetYourInterests")}>Set Your Interests</button>
      </div>



    </div>




  );
}

export default Play;