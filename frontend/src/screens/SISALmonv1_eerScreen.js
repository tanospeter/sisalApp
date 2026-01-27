import "./SISALmonv1_eerScreen.css";
import ER from "../pic/EER_monv1_db_v8.0.png";

const DatabaseScreen = () => {
  return (
    <div className="svgContainer">
      <img src={ER} alt="Sisal Monitor EER" className="svgFullWidth" />
    </div>
  );
};

export default DatabaseScreen;
