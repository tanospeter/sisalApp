import './Step1Screen.css'
//import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import {useState} from "react"
import axios from 'axios'
import Datatable from '../components/Datatable'
import XLSX from 'xlsx'
import {Link} from 'react-router-dom'

const Step1Screen = () => {
  
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
    const siteNameEmpty = siteName === ''
    const latLonEmpty = latFrom === '' && latTo === '' && longFrom === '' && longTo === ''
    const latLonIncomplete = !latLonEmpty && (latFrom === '' || latTo === '' || longFrom === '' || longTo === '')
    const ageEmpty = interpAgeFrom === '' && interpAgeTo === ''
    const ageIncomplete = !ageEmpty && (interpAgeFrom === '' || interpAgeTo === '')
    if (siteNameEmpty && latLonEmpty && ageEmpty) {
      alert("None of the query's filter parameters are specified correctly!\nPlease specify the Site Name and/or Lat-Lon coordinates and/or interval of InterpAge and try again!")
    } else if (latLonIncomplete) {
      alert("The coordinates are incorrect or some are missing!\nPlease revise the coordinates, and try again!")
    } else if (ageIncomplete){
      alert("The InterpAge interval is incorrect or incomlete!\nPlease revise the begin and end of the interval, and try again! ")
    } else {
      axios.post("http://localhost:5010/api/step1", {
        email:email,
        siteName: siteName,
        lat: [ latFrom, latTo ],
        lon: [ longFrom, longTo ],
        age: [ interpAgeFrom, interpAgeTo ],
        type: 'meta'
      }).then((response) => {
        console.log(response.data.meta)           
        setEntityList(response.data.meta)      
      }).catch(error => console.log(error))
    }    
  }
    
  return (
    <div className="Step1Screen">
      <div className="wrapper">
        <h2>Quering entity metadata</h2>
        <div>Please specify the parameters of the query below. Make sure that at least one of the parameters 
          (Site Name, Lat-Lon Coordinates or InterpAge time interval) is defined! If more than one of the above 
          has been defined, they will be filled together for the result of the query. (So there is a logical AND 
          connection between parameters).</div>
        <div className="inputArea">                
          <div className="filteArea">
            <h5 className="filterTitle">Filter type 1 (Site)</h5>
            <label >Site name</label>
            <input type="text" onChange={(event)=>{
              setSiteName(event.target.value)
            }}/>
          </div>
          <div className="filteArea">
            <h5 className="filterTitle">Filter type 2 (Lat-Lon)</h5>
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
          </div>
          
          <div className="filteArea">
            <h5 className="filterTitle">Filter type 3 (InterpAge)</h5>
            <label>Iterp_age from</label>
            <input type="text" onChange={(event)=>{
              setInterpAgeFrom(event.target.value)
            }}/>

            <label>Iterp_age to</label>
            <input type="text" onChange={(event)=>{
              setInterpAgeTo(event.target.value)
            }}/>
          </div>

          <label>Email address</label>
          <input type="text" onChange={(event)=>{
            setEmail(event.target.value)
          }}/>
          <button onClick={sendQueryParams}>Get entity list</button>           
          
        </div>

        <div>          
          <Datatable data={entityList} />
        </div>
      </div>
    </div>
  )
}

export default Step1Screen