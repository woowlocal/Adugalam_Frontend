import loader from "./assets/loader.gif";
import "./Loader.css";

function Loader() {
  return (
    <div className="loader-container">
      <img src={loader} alt="Loading..." />
    </div>
  );
}

export default Loader;
