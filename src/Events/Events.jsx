
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

      {/* <h1 className="head">Sports Events in Tamil Nadu</h1>
      <br></br><p className="subtitle1">
       Discover marathons, coaching camps, sports expos, and fitness events in Chennai, Coimbatore, Madurai, and across Tamil Nadu. Register online and stay updated-<br>
        </br>sponsored events. Discover what's happening near you
      </p>
     <div className="button-row">
  <button className="start1"  onClick={() => navigate("/ViewAllEvents")}>
    <img src={calender} alt="" className="calender"/>
    View All Events
  </button>
  <button className="venue-btn1" onClick={() => navigate("/submit-event")}>Submit an Event</button>
</div>

<h2 className="popular-heading">Upcoming Sports Events Near You</h2>
<p className="new">Discover marathons, cricket camps, fitness workshops, and sports events across Tamil Nadu</p>


<div className="how-row16">
  {upcomingEvents.map((event, index) => (
    <div className="how-card11" key={index}  onClick={() => navigate(`/${event.path}`)}
  style={{ cursor: "pointer" }}>
      <p className="emoji">{event.emoji}</p>
      <button className="marathon">{event.type}</button>

      <h4>{event.title}</h4>

      <p className="how-sub1">
        <img src={calender} className="calender1" /> {event.date}<br />
        <CiLocationOn className="location" /> {event.location}<br />
        <img src={players} className="location" /> {event.players}
      </p>

      <button className="learnmore"  onClick={() => navigate(`/${event.path}`)}>Learn More</button>
    </div>
  ))}
</div>


<h2 className="popular-heading">Event Categories</h2>
<p className="new">Types of Events</p>


<div className="how-row2">
  {eventCategories.map((cat, index) => (
    <div className="how-card2" key={index}  onClick={() => navigate(`/${cat.path}`)}
  style={{ cursor: "pointer" }}>
      <h4>{cat.title}</h4>
      <p className="how-sub2">{cat.count}</p>
    </div>
  ))}
</div>




<div className="how-row3">
  {eventFeatures.map((item, index) => (
    <div className="how-card3" key={index}   onClick={() => navigate(item.path)}
  style={{ cursor: "pointer" }}
>
      {item.icon}
      <h4>{item.title}</h4>
      <p className="how-sub3">{item.desc}</p>
    </div>
  ))}
</div>




*/}


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