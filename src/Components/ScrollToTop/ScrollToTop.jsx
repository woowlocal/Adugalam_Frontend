import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  // Disable browser's native scroll restoration (fixes back/forward scroll)
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top on every navigation (including back/forward)
  useEffect(() => {
    // Use setTimeout to ensure scroll happens after React re-renders
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.key]);

  return null;
};

export default ScrollToTop;