import './Step1Screen.css'
//import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import {useState} from "react"
import axios from 'axios'
import Datatable from '../components/Datatable'

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
    axios.post("http://localhost:5010/api/step1", {
      email:email,
      siteName:siteName,
      lat: [ latFrom, latTo ],
      lon: [ longFrom, longTo ],
      age: [ interpAgeFrom, interpAgeTo ],
      type: 'meta'
    }).then((response) => {
      console.log(response.data.meta)
      const k = Object.keys(response.data.meta[0])      
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
  
  
  return (
    <div className="Step1Screen">
      
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
        
      </div>

      <div>
        <Datatable data={entityList} />
      </div>
    </div>
  )
}

export default Step1Screen