import loader from "./assets/run.gif";
import "./Loader.css";

function Run() {
  return (
    <div className="loader-container">
      <img src={loader} alt="Loading..." />
    </div>
  );
}

export default Run;
