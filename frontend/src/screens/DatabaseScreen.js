import './DatabaseScreen.css'
import eer from '../pic/sisalv3_eer.png'

const DatabaseScreen = () => {
  return (
    <div className="DatabaseScreen">
      <img src={eer}></img>
      <p>The structure of the SISAL database version 3. The colours refer to the format of that field: Enum, Int, Varchar, Double or
Decimal. For trace element records, as series of identical tables was generated (labelled X_Ca where X stands for the specific element: Mg, Sr, Ba, U, P).
More information on the list of predefined menus can be found in Kaushal et al. (2024). The diagram was
modified after Kaushal et al. (2024): Figure 1.</p>
    </div>
  )
}

export default DatabaseScreen