import React from "react";
import "./Bookhome.css";
import "../index.css";


import { useEffect, useState } from "react";
import Badminton from "../Badminton.jsx";

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
import axios from "axios";





import Header from '../Components/Header/Header'
import Categories from '../Components/Categories/Categories'
import PopularGround from '../Components/PopularGround/PopularGround'
import Nearby from '../Components/NearBy/Nearby'
import Footer from '../Footer/Footer'
import Banner from '../Components/Banner/Banner'
import { Navigate, useNavigate } from "react-router-dom";
import Newonadugalam from "../Components/Newonadugalam/Newonadugalam";


const Bookhome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/home/`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.error("API ERROR:", err);
      });
  }, []);



  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Badminton />;
  }

  return (

    <div className="home">
      <br></br>
      <Banner />
      <Nearby />
      <Newonadugalam />
      <PopularGround />

    </div>

  );
};

export default Bookhome;