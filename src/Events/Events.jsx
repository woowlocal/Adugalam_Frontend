
import "./Events.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Banner from "../Components/Banner/Banner.jsx";

import FeaturedEvents from "./FeaturedEvents.jsx";
import OngoingSportsEvents from "./OngoingSportsEvents.jsx";
import UpcomingSportsEvents from "./UpcomingSportsEvents.jsx";

// const upcomingEvents = [
//   {
//     emoji: "🏃",
//     type: "Marathon",
//     title: "Chennai Marathon 2025",
//     date: "March 2, 2025",
//     location: "Marina Beach, Chennai",
//     players: "10,000+",
//     path: "Marathon"
//   },
//   {
//     emoji: "🎪",
//     type: "Exhibition",
//     title: "Tamil Nadu Sports Expo",
//     date: "Feb 16-17, 2025",
//     location: "Trade Center, Coimbatore",
//     players: "500+ Brands",
//     path:"Exhibition"
//   },
//   {
//     emoji: "🏏",
//     type: "Coaching Camp",
//     title: "Youth Cricket Camp",
//     date: "April 1-10, 2025",
//     location: "MA Chidambaram Stadium",
//     players: "200 Slots",
//     path:"CoachingCamp"
//   },
//   {
//     emoji: "💪",
//     type: "Workshop",
//     title: "Fitness Workshop",
//     date: "March 15, 2025",
//     location: "Phoenix MarketCity, Chennai",
//     players: "100 Slots",
//     path:"Workshop"
//   }
// ];


// const eventCategories = [
//   { title: "Fun Runs & Marathons", count: "15+ events/year",path:"FunRunsAndMarathons" },
//   { title: "Sports Expos", count: "4+ events/year",path:"SportsExpos" },
//   { title: "Coaching Camps", count: "50+ events/year",path:"CoachingCamps" },
//   { title: "Fitness Workshops", count: "30+ events/year",path:"FitnessWorkshops" },
//   { title: "Corporate Sports Days", count: "20+ events/year",path:"CorporateSportsDays" },
//   { title: "School Sports Events", count: "100+ events/year",path:"SchoolSportsEvents" }
// ];



// const eventFeatures = [
//   {
//     icon: <CiCalendar className="calender2" />,
//     title: "Event Details",
//     desc: "Complete event information & registration",
//     path:"EventDetails"
//   },
//   {
//     icon: <CiLocationOn className="calender2" />,
//     title: "Location Maps",
//     desc: "Easy navigation to event venues",
//     path:"LocationMaps"
//   },
//   {
//     icon: <LuTicket className="calender2" />,
//     title: "Tickets & Booking",
//     desc: "Seamless ticket purchase & entry",
//     path:"TicketsAndBooking"
//   },
//   {
//     icon: <CiCamera className="calender2" />,
//     title: "Media & Photos",
//     desc: "Event galleries and memories",
//     path:"MediaAndPhotos"
//   }
// ];



function Events() {


  const navigate = useNavigate();



  // const [badminton, setLoading] = useState(true);

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       setLoading(false);
  //     }, 2000); // 3000 milliseconds = 3 seconds

  //     return () => clearTimeout(timer);
  //   }, []);

  //   if (badminton) {
  //     return <Badminton />;
  //   }





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