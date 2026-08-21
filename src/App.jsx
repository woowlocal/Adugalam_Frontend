import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import LoginPopup from "./Components/LoginPopup/LoginPopup.jsx";
import { AlertProvider } from "./Context/AlertContext.jsx";

import Navbar from "./Navbar/Navbar.jsx";
import Footer from "./Footer/Footer.jsx";
import Tvl from "./Tvl/Tvl.jsx";
import Hit from "./Tvl/Hit.jsx";
import HomePage from "./HomePage/HomePage.jsx";
import Login from "./Login/Login.jsx";
import SignUp from "./Login/SignUp.jsx";
import Book from "./Book/Book.jsx";
import Play from "./Play/Play.jsx";
import Train from "./Train/Train.jsx";
import Profile from "./Profile/Profile.jsx";
import MyProfile from "./Profile/MyProfile.jsx";
import ProfileHistory from "./Profile/History.jsx";
import Events from "./Events/Events.jsx";
import EventBooking from "./Events/EventBooking.jsx";
import ShopSports from "./ShopSports/ShopSports.jsx";
import { Tournments } from "./Tournments/Tournments.jsx";
import About from "./About/About.jsx";
import Contact from "./Contact/Contact.jsx";
import PatnerSection from "./PatnerSection/PatnerSection.jsx";
import EditProfile from "./Profile/EditProfile.jsx";
import Settings from "./Settings/Settings.jsx";
import ChangePassword from "./Settings/ChangePassword.jsx";
import Terms from "./Settings/Terms.jsx";
import Privacy from "./Privacypolicy/Privacy.jsx";
import PartnerForm from "./PatnerSection/PartnerForm.jsx";
import ClubPolicy from "./ClubPolicy/ClubPolicy.jsx";
import ContactMessages from "./Admin/ContactMessages.jsx";
import PeakHourPage from "./Admin/Peakhours/PeakHourPage.jsx";
import AdminEvent from "./Admin/AdminEvent.jsx";
import Eventlist from "./Admin/Eventlist.jsx";
import EventReviews from "./Admin/EventReviews.jsx";
import EventBookingsAdmin from "./Admin/EventBookingsAdmin.jsx";


import Dashboard from "./Admin/Dashboard.jsx";
import AdminSettings from "./Admin/AdminSettings.jsx";
import Bookingmanagement from "./Admin/BookingManagement1.jsx";
import Chart from "./Admin/Chart.jsx";
import PaymentsReport from "./Admin/PaymentsReport.jsx";
import Sidebar from "./Admin/Sidebar.jsx";
import TurfManagement from "./Admin/TurfManagement.jsx";
import UserManagement from "./Admin/UserManagement.jsx";
import UserDelete from "./Admin/UserDelete/UserDelete.jsx";
import Vendor from "./Admin/Vender.jsx";
import AdminLogin from "./Admin/AdminLogin/AdminLogin.jsx";
import AdminForgotPassword from "./Admin/AdminLogin/AdminForgotPassword.jsx";
import AddVendor from "./Admin/AddVendor/AddVendor.jsx";
import AdminSideBar from "./Admin/AdminSideBar/AdminSideBar.jsx";
import AdminLayout from "./Admin/AdminLayout.jsx";
import AddTurf from "./Vendor/AddTurf.jsx";
import VendorRequest from "./Admin/VendorRequest/VendorRequest.jsx";
import VendorTurfList from "./Vendor/VendorTurfList.jsx";
import VendorAddTurf from "./Vendor/VendorAddTurf.jsx";
import VendorEditTurf from "./Vendor/VendorEditTurf.jsx";
import VendorList from "./Admin/VendorList/VendorList.jsx";
import EditVendor from "./Admin/EditVendor/EditVendor.jsx";
import TurfList from "./Admin/TurfList/TurfList.jsx";
import EditTurf from "./Admin/EditTurf/EditTurf.jsx";
import VendorLogin from "./Vendor/VendorLogin/VendorLogin.jsx";
import VendorSignup from "./Vendor/VendorLogin/VendorSignup.jsx";
import VendorPeakHours from "./Vendor/VendorPeakHours.jsx";
// import Addturf from "./Vendor/VendorAddTurf.jsx";
import Discount from "./Vendor/DiscountPage.jsx";
import VendorBookingManagement from "./Vendor/BookingManagement.jsx";
import VendorDashboard from "./Vendor/VendorDashboard.jsx";
import VendorSlotBooking from "./Vendor/VendorSlotBooking.jsx";
import VendorLogout from "./Vendor/Logout.jsx";
import Scheduletime from "./Vendor/ScheduleTime.jsx";
import VendorLayout from "./Vendor/layouts/VendorLayout.jsx";
import VendorProfile from "./Vendor/VendorProfile.jsx";

import BannerManagement from "./Admin/BannerManagement/BannerManagement.jsx";
import Galarypage from "./Book/Galarypage.jsx";
import BookingGround from "./Book/BookingGround.jsx";
import Payment from "./Book/PaymentPage";
import Bookhome from "./Book/Bookhome.jsx";
import Summary from "./Book/Summary.jsx";
import Mybooking from "./Book/MyBooking.jsx";
import Newonadugalam from "./Components/Newonadugalam/Newonadugalam.jsx";
import Tennis from "./Book/Tennis.jsx";
import AllCategories from "./AllCategories/AllCategories.jsx";
import Myfavourite from "./Profile/Myfavourite.jsx";
import Myreviews from "./Profile/Myreviews.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import Bottomnavbar from "./Bottomnavbar/Bottomnavbar.jsx";
import Location from "./Location/Location.jsx";
import ForgotPassword from "./Login/ForgotPassword.jsx";
import Cartpage from "./Book/Cartpage.jsx";
import { VscChevronLeft } from "react-icons/vsc";
import NotFound from "./NotFound/NotFound.jsx";


/* ---------------- BACK BUTTON WRAPPER (Fixed) ---------------- */
const BackButtonWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.toLowerCase();
  const showBackButtonRoutes = ["/bookingground", "/cart", "/payment"];
  const isBookPage = currentPath.startsWith("/book/") || currentPath === "/book";

  if (!showBackButtonRoutes.includes(currentPath) && !isBookPage) {
    return null;
  }

  let backText = "Back";
  if (isBookPage) backText = "Back to Home";
  else if (currentPath === "/bookingground") backText = "Back to Book";
  else if (currentPath === "/cart") backText = "Back to Booking";
  else if (currentPath === "/payment") backText = "Back to Checkout";

  const handleBack = () => {
    if (isBookPage) {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="gp-headerr">
      <button
        className="animated-back-btn"
        data-text={backText}
        onClick={handleBack}
      >
        <VscChevronLeft className="animated-back-icon" />
      </button>
    </div>
  );
};

/* ---------------- HELPER TO CHECK VALID ROUTES ---------------- */
const isValidRoute = (pathname) => {
  const validExactRoutes = [
    "/", "/login", "/signup", "/vendorlogin", "/vendorsignup", "/adminlogin", "/admin-forgot-password",
    "/play", "/train", "/profile", "/editprofile", "/myprofile", "/profilehistory", "/hit", "/tvl",
    "/events", "/eventbooking", "/shop", "/tournaments", "/about", "/contact", "/partner", "/settings",
    "/changepassword", "/terms", "/privacy", "/clubpolicy",
    "/peak-hour", "/contact-messages", "/bannermanagement", "/dashboard", "/adminsettings", "/bookingmanagement",
    "/chart", "/paymentsreport", "/sidebar", "/turfmanagement", "/usermanagement", "/userdelete", "/vendor",
    "/addvendor", "/adminsidebar", "/adminlayout", "/addturf", "/vendorrequest", "/vendorturflist",
    "/vendoraddturf", "/vendoreditturf", "/vendorlist", "/editvendor", "/turflist", "/editturf",
    "/vendordashboard", "/vendorslotbooking", "/discount", "/vendorbookingmanagement", "/vendorlogout",
    "/scheduletime", "/vendorprofile",
    "/cart", "/galary", "/bookingground", "/payment", "/bookhome", "/summary", "/mybooking",
    "/partnerform", "/newonadugalam", "/tennis", "/allcategories", "/myfavourite", "/myreviews",
    "/download", "/location", "/bottomnavbar", "/forgot-password"
  ];
  
  const path = pathname.toLowerCase();
  
  if (validExactRoutes.includes(path)) return true;
  
  if (path.startsWith("/book/") || 
      path.startsWith("/vendoreditturf/") || 
      path.startsWith("/vendor-edit/") || 
      path.startsWith("/edit-turf/")) {
    return true;
  }
  
  return false;
};

/* ---------------- NAVBAR WRAPPER ---------------- */
const NavbarWrapper = () => {
  const location = useLocation();

  if (!isValidRoute(location.pathname)) {
    return null;
  }

  const hideNavbarRoutes = [
    "/Dashboard",
    "/AdminLogin",
    "/AdminSettings",
    "/BookingManagement",
    "/Chart",
    "/PaymentsReport",
    "/TurfManagement",
    "/peak-hour",
    "/AddVendor",
    "/UserManagement",
    "/UserDelete",
    "/VendorPeakHours",
    "/Vendor",
    "/edit-vendor",
    "/AdminLogout",
    "/AddTurf",
    "/VendorAddTurf",
    "/VendorTurfList",
    "/vendor-edit/:id",
    "/VendorRequest",
    "/VendorList",
    "/EditVendor",
    "/TurfList",
    "/VendorDashboard",
    "/VendorSlotBooking",
    "/addturf",
    "/discount",
    "/BannerManagement",
    "/VendorBookingManagement",
    "/VendorLogout",
    "/Scheduletime",
    "/clubpolicy",
    "/contact-messages",
    "/admin-forgot-password",
    "/forgot-password",
    "/VendorLogin",
    "/VendorSignup",
    "/VendorProfile",
    "/AdminEvent",
    "/Eventlist",
    "/Turflist",
    "/EventReviews"
  ];

  if (hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/VendorEditTurf") ||
    location.pathname.startsWith("/vendor-edit/") ||
    location.pathname.startsWith("/edit-turf")) {
    return null;
  }

  return <Navbar />;
};

/* ---------------- FOOTER WRAPPER ---------------- */
const FooterWrapper = () => {
  const location = useLocation();

  if (!isValidRoute(location.pathname)) {
    return null;
  }

  const hideFooterRoutes = [
    "/cart",
    "/payment",
    "/location",
    "/Dashboard",
    "/AdminSettings",
    "/BookingManagement",
    "/Chart",
    "/edit-turf",
    "/PaymentsReport",
    "/TurfManagement",
    "/VendorPeakHours",
    "/AddVendor",
    "/UserManagement",
    "edit-vendor",
    "/UserDelete",
    "/Vendor",
    "/peak-hour",
    "/AdminLogout",
    "/AddTurf",
    "/vendor-edit/:id",
    "/VendorAddTurf",
    "/VendorTurfList",
    "/VendorRequest",
    "/VendorList",
    "/EditVendor",
    "/TurfList",
    "/VendorDashboard",
    "/VendorSlotBooking",
    "/addturf",
    "/discount",
    "/BannerManagement",
    "/VendorBookingManagement",
    "/VendorLogout",
    "/Scheduletime",
    "/clubpolicy",
    "/mybooking",
    "/contact-messages",
    "/admin-forgot-password",
    "/login",
    "/AdminLogin",
    "/signup",
    "/forgot-password",
    "/VendorLogin",
    "/VendorSignup",
    "/VendorProfile",
    "/Privacy",
    "/Terms",
    "/profilehistory",
    "/Settings",
    "/MyProfile",
    "/EditProfile",
    "/myfavourite",
    "/profile",
    "/vendor-edit/:id",
    "/Turflist",
    "/AdminEvent",
    "/EventReviews",

  ];

  if (hideFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/VendorEditTurf") ||
    location.pathname.startsWith("/vendor-edit/") ||
    location.pathname.startsWith("/edit-turf")) {
    return null;
  }

  return <Footer />;
};

/* ---------------- BOTTOM NAVBAR WRAPPER (Mobile Only) ---------------- */
const BottomNavbarWrapper = () => {
  const location = useLocation();

  if (!isValidRoute(location.pathname)) {
    return null;
  }

  const hideBottomNavbarRoutes = [
    "/Dashboard",
    "/AdminSettings",
    "/BookingManagement",
    "/Chart",
    "/PaymentsReport",
    "/TurfManagement",
    "/AddVendor",
    "/UserManagement",
    "/UserDelete",
    "/VendorPeakHours",
    "/Vendor",
    "/AdminLogout",
    "/AddTurf",
    "/vendor-edit/:id",
    "/VendorAddTurf",
    "/peak-hour",
    "/VendorTurfList",
    "/VendorRequest",
    "/VendorList",
    "/EditVendor",
    "/TurfList",
    "/VendorDashboard",
    "/VendorSlotBooking",
    "/addturf",
    "/discount",
    "/VendorBookingManagement",
    "/VendorLogout",
    "/Scheduletime",
    "/clubpolicy",
    "/payment",
    "/location",
    "/login",
    "/BannerManagement",
    "/signup",
    "/VendorLogin",
    "/VendorSignup",
    "/AdminLogin",
    "/contact-messages",
    "/admin-forgot-password",
    "/VendorProfile",
    "/AdminEvent",
    "/Eventlist"
  ];

  if (hideBottomNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/VendorEditTurf") ||
    location.pathname.startsWith("/vendor-edit/") ||
    location.pathname.startsWith("/edit-turf")) {
    return null;
  }

  return <Bottomnavbar />;
};
/* ---------------- ROUTE TRANSITION WRAPPER ---------------- */
// NOTE: Admin/Vendor routes must NOT be wrapped in a CSS transform — any
// transform on a parent breaks position:fixed on child elements (the sidebar).
const adminVendorPaths = [
  "/Dashboard", "/AdminSettings", "/BookingManagement", "/Chart",
  "/PaymentsReport", "/TurfManagement", "/AddVendor", "/UserManagement",
  "/UserDelete", "/Vendor", "/AdminLogout", "/AddTurf", "/VendorRequest",
  "/VendorList", "/TurfList", "/vendorlist", "/peak-hour",
  "/contact-messages", "/BannerManagement",
  "/VendorDashboard", "/VendorSlotBooking", "/VendorAddTurf", "/VendorTurfList",
  "/VendorPeakHours", "/discount", "/VendorBookingManagement",
  "/VendorLogout", "/Scheduletime", "/VendorProfile",
  "/AdminEvent",
  "/Eventlist",
  "/EventReviews"
];

const RouteTransition = ({ children }) => {
  const location = useLocation();

  // Skip the transform wrapper for admin/vendor routes so that
  // position:fixed on the sidebar works relative to the viewport.
  const isAdminOrVendor =
    adminVendorPaths.some((p) => location.pathname === p) ||
    location.pathname.startsWith("/vendor-edit/") ||
    location.pathname.startsWith("/VendorEditTurf") ||
    location.pathname.startsWith("/edit-turf/");

  if (isAdminOrVendor) {
    // Render without transform so position:fixed is never broken
    return <>{children}</>;
  }

  return (
    <div className="route-transition" key={location.pathname}>
      {children}
    </div>
  );
};

/* ---------------- MAIN APP ---------------- */
const App = () => {
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("showLoginPopup") === "true") {
      sessionStorage.removeItem("showLoginPopup");
      setLoginPopupOpen(true);
    }
  }, []);

  return (
    <AlertProvider>
    <Router>
      <ScrollToTop />
      <NavbarWrapper />
      <BackButtonWrapper />
      <LoginPopup isOpen={loginPopupOpen} onClose={() => setLoginPopupOpen(false)} />

      <RouteTransition>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/VendorLogin" element={<VendorLogin />} />
          <Route path="/VendorSignup" element={<VendorSignup />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />



          {/* USER */}
          <Route path="/book/:turfSlug" element={<Book />} />
          <Route path="/book" element={<Navigate to="/" replace />} />
          <Route path="/play" element={<Play />} />
          <Route path="/train" element={<Train />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/MyProfile" element={<MyProfile />} />
          <Route path="/profilehistory" element={<ProfileHistory />} />
          <Route path="/hit" element={<Hit />} />
          <Route path="/tvl" element={<Tvl />} />
          <Route path="/events" element={<Events />} />
          <Route path="/eventbooking" element={<EventBooking />} />
          <Route path="/shop" element={<ShopSports />} />
          <Route path="/tournaments" element={<Tournments />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partner" element={<PatnerSection />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/Privacy" element={<Privacy />} />
          <Route path="/ClubPolicy" element={<ClubPolicy />} />

          {/* ADMIN */}
          <Route element={<AdminLayout />}>
            <Route path="/peak-hour" element={<PeakHourPage />} />
            <Route path="/contact-messages" element={<ContactMessages />} />
            <Route path="/BannerManagement" element={<BannerManagement />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/AdminSettings" element={<AdminSettings />} />
            <Route path="/BookingManagement" element={<Bookingmanagement />} />
            <Route path="/Chart" element={<Chart />} />
            <Route path="/PaymentsReport" element={<PaymentsReport />} />
            <Route path="/TurfManagement" element={<TurfManagement />} />
            <Route path="/AddVendor" element={<AddVendor />} />
            <Route path="/UserManagement" element={<UserManagement />} />
            <Route path="/UserDelete" element={<UserDelete />} />
            <Route path="/Vendor" element={<Vendor />} />
            <Route path="/AdminLogout" element={<AdminLogin />} />
            <Route path="/AddTurf" element={<AddTurf />} />
            <Route path="/VendorRequest" element={<VendorRequest />} />
            <Route path="/VendorList" element={<VendorList />} />
            <Route path="/TurfList" element={<TurfList />} />
            <Route path="/vendorlist" element={<VendorList />} />
            <Route path="/vendor-edit/:id" element={<EditVendor />} />
            <Route path="/edit-turf/:id" element={<EditTurf />} />
            <Route path="/AdminEvent" element={<AdminEvent />} />
            <Route path="/Eventlist" element={<Eventlist />} />
            <Route path="/EventReviews" element={<EventReviews />} />
            <Route path="/EventBookings" element={<EventBookingsAdmin />} />
          </Route>


          {/* VENDOR */}
          <Route element={<VendorLayout />}>
            <Route path="/VendorDashboard" element={<VendorDashboard />} />
            <Route path="/VendorSlotBooking" element={<VendorSlotBooking />} />
            <Route path="/VendorAddTurf" element={<VendorAddTurf />} />
            <Route path="/VendorEditTurf/:id" element={<VendorEditTurf />} />
            <Route path="/VendorTurfList" element={<VendorTurfList />} />
            <Route path="/VendorPeakHours" element={<VendorPeakHours />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/VendorBookingManagement" element={<VendorBookingManagement />} />
            <Route path="/VendorLogout" element={<VendorLogout />} />
            <Route path="/Scheduletime" element={<Scheduletime />} />
            <Route path="/VendorProfile" element={<VendorProfile />} />
          </Route>

          {/* BOOKING */}
          <Route path="/cart" element={<Cartpage />} />
          <Route path="/book/:turfSlug/BookingGround/cart" element={<Cartpage />} />
          <Route path="/galary" element={<Galarypage />} />
          <Route path="/bookingground" element={<BookingGround />} />
          <Route path="/book/:turfSlug/BookingGround" element={<BookingGround />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/Bookhome" element={<Bookhome />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/mybooking" element={<Mybooking />} />

          {/* OTHER */}
          <Route path="/partnerform" element={<PartnerForm />} />
          <Route path="/newonadugalam" element={<Newonadugalam />} />
          <Route path="/tennis" element={<Tennis />} />
          <Route path="/allcategories" element={<AllCategories />} />
          <Route path="/myfavourite" element={<Myfavourite />} />
          <Route path="/myreviews" element={<Myreviews />} />
          <Route path="/download" element={<h1>Coming Soon</h1>} />
          <Route path="/location" element={<Location />} />
          <Route path="/Bottomnavbar" element={<Bottomnavbar />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* FALLBACK 404 NOT FOUND */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RouteTransition>

      <FooterWrapper />
      <BottomNavbarWrapper />
    </Router>
    </AlertProvider>
  );
};

export default App;