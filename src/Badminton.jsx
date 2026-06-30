import badminton from "./assets/badminton.gif";
import "./Loader.css";

function Badminton() {
  return (
    <div className="loader-container">
      <img src={badminton} alt="Loading..." />
    </div>
  );
}

export default Badminton;
