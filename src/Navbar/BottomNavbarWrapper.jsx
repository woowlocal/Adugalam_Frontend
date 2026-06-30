import { useLocation } from "react-router-dom";
import Bottomnavbar from "./Bottomnavbar/Bottomnavbar.jsx";

const BottomNavbarWrapper = () => {
  const location = useLocation();

  // ❌ Bottom navbar hide panna vendiya routes
  const hideBottomNavRoutes = [
    "/login",
    "/signup",
    "/cart",
    "/payment",
    "/Dashboard",
    "/VendorDashboard",
    "/VendorLayout",
    "/location",
    
  ];

  if (hideBottomNavRoutes.includes(location.pathname)) {
    return null;
  }

  return <Bottomnavbar />;
}; 

export default BottomNavbarWrapper;
