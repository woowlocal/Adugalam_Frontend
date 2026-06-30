import React from "react";
import "./Bookhome.css";
import "../index.css";
import ground from "../assets/ground.jpg";

import { FiUsers } from "react-icons/fi";
import { LuBuilding } from "react-icons/lu";
import { LuGraduationCap } from "react-icons/lu";
import { GoTrophy } from "react-icons/go";
import {FaRegStar,} from "react-icons/fa";

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





import Header from '../Components/Header/Header'
import Categories from '../Components/Categories/Categories'
import PopularGround from '../Components/PopularGround/PopularGround'
import Nearby from '../Components/NearBy/Nearby'
import Footer from '../Footer/Footer'
import Banner from '../Components/Banner/Banner'
import { Navigate ,useNavigate} from "react-router-dom";
import Newonadugalam from "../Components/Newonadugalam/Newonadugalam";






const Bookhome = () => {





  const navigate = useNavigate();





  useEffect(() => {
    axios.get(`${(import.meta.env.VITE_API_BASE_URL || "https://api.adugalam.com").replace(/\/$/, "")}/api/home/`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.error("API ERROR:",err);
      });
  }, []);

  return (
    
    <div className="home">
<br></br>
<Banner/>
<Nearby/>
<PopularGround/>
<Newonadugalam></Newonadugalam>









    </div>
    
  );
};

export default Bookhome;