import './App.css'
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import {useState} from "react"
import axios from 'axios'

// screens
import HomeScreen from './screens/HomeScreen'
import Step1Screen from './screens/Step1Screen'
import Step2Screen from './screens/Step2Screen'
import DatabaseScreen from './screens/DatabaseScreen'

// components
import Navbar from './components/Navbar'
import Table from './components/Table'
 
function App() {
  const [email, setEmail] = useState("")
  const [siteName, setSiteName] = useState("")
  const [latFrom, setLatFrom] = useState("")
  const [latTo, setLatTo] = useState("")
  const [longFrom, setLongFrom] = useState("")
  const [longTo, setLongTo] = useState("")
  const [interpAgeFrom, setInterpAgeFrom] = useState("")
  const [interpAgeTo, setInterpAgeTo] = useState("")

  const [entityList,setEntityList] = useState([])
  
  const sendQueryParams = () => {
    axios.post("http://localhost:5000/api/step1", {
      email:email,
      siteName:siteName,
      lat: [ latFrom, latTo ],
      lon: [ longFrom, longTo ],
      age: [ interpAgeFrom, interpAgeTo ],
      type: 'meta'
    }).then((response) => {
      console.log(response.data.meta)
      const k = Object.keys(response.data.meta[0])
      console.log(k)
      setEntityList(response.data.meta)
      .catch(error => console.log(error))
    })
  }

  var request = {
    params:{
      email:email,
      siteName:siteName,
      latFrom:latFrom,
      latTo:latTo,
      longFrom:longFrom,
      longTo:longTo,
      intAgeFrom:interpAgeFrom,
      intAgeTo:interpAgeTo
    }
  }
  const getAllChronos = () =>{
    axios.get("http://localhost:3000/chronology/",{request}).then((response)=>{
      //console.log(response.data.chronos)
      setEntityList(response.data.chronos)
    })
  }

  //Object.keys(entityList[0])}/> 
  
  return (
    <Router>    
      <Navbar />
       
      
            
      <main className="app">
        
      <div className="inputArea">
        <label>Email address</label>
        <input type="text" onChange={(event)=>{
          setEmail(event.target.value)
        }}/>
        
        <label >Site name</label>
        <input type="text" onChange={(event)=>{
          setSiteName(event.target.value)
        }}/>

        <label >Latitude from</label>
        <input type="text" onChange={(event)=>{
          setLatFrom(event.target.value)
        }}/>
        
        <label>Latitude to</label>
        <input type="text" onChange={(event)=>{
          setLatTo(event.target.value)
        }}/>
              
        <label>Longitude from</label>
        <input type="text" onChange={(event)=>{
          setLongFrom(event.target.value)
        }}/>
        
        <label>Longitude to</label>
        <input type="text" onChange={(event)=>{
          setLongTo(event.target.value)
        }}/>

        <label>Iterp_age from</label>
        <input type="text" onChange={(event)=>{
          setInterpAgeFrom(event.target.value)
        }}/>

        <label>Iterp_age to</label>
        <input type="text" onChange={(event)=>{
          setInterpAgeTo(event.target.value)
        }}/>
        <button onClick={sendQueryParams}>Get entity list</button> 
        <button onClick={sendQueryParams}>Get chronos list</button> 
        
        <Table data = {entityList} column = {[
          "publication_doi",
          "site_id",
          "entity_id",
          "entity_name",
          "entity_status",
          "corresponding_current",
          "depth_ref",
          "cover_thickness",
          "distance_entrance",
          "speleothem_type",
          "drip_type",
          "d13C",
          "d18O",
          "d18O_water_equilibrium",
          "trace_elements",
          "organics",
          "fluid_inclusions",
          "mineralogy_petrology_fabric",
          "clumped_isotopes",
          "noble_gas_temperatures",
          "C14",
          "ODL",
          "Mg_Ca",
          "contact",
          "data_DOI_URL",
          "site_name",
          "latitude",
          "longitude",
          "elevation",
          "geology",
          "rock_age",
          "monitoring",
          "interp_age"]}/>
        
        {
          
          entityList.map((val, key) => {            
            return <div> {val.entity_name} </div>
          })
        }
      </div>
      
      <div>
        <button onClick={getAllChronos}>Get entity list</button>

       
      </div>
        
        <Routes >          
          <Route exact path="/" component={HomeScreen}/>
          <Route exact path="/step1" component={Step1Screen}/>
          <Route exact path="/step2" component={Step2Screen}/> 
          <Route exact path="/database" component={DatabaseScreen}/>         
        </Routes >
      </main>    
    </Router>
  );
}

export default App;
