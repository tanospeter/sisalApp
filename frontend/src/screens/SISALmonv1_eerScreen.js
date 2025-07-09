import "./SISALmonv1_eerScreen.css";
import { ReactComponent as ER } from "../pic/Sisal_monv1_structure_diagram.svg";

const DatabaseScreen = () => {
  return (
    <div className="svgContainer">
      <ER
      className="svgFullWidth"
        viewBox="0 0 2810 2560"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default DatabaseScreen;
