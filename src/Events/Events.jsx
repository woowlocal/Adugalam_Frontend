
import "./Events.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Banner from "../Components/Banner/Banner.jsx";
import FeaturedEvents from "./FeaturedEvents.jsx";
import UpcomingSportsEvents from "./UpcomingSportsEvents.jsx";


function Events() {

  const navigate = useNavigate();

  return (
    <div className="heading-section1">

      <Banner />
      <FeaturedEvents />
      {/* <OngoingSportsEvents /> */}
      <UpcomingSportsEvents />
      <div className="last">
        <h2 className="head1">Host Your Sports Event with Us</h2>
        <br></br><p className="subtitle2">
          Partner with Adugalam to promote your event to thousands of sports enthusiasts across Tamil Nadu.
        </p>
        <button className="venue-btn2" onClick={() => navigate("/submit-event")}>Submit Your Event</button>

      </div>
    </div>
  );
}

export default Events;