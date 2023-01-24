import './Step1Screen.css'
//import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import {useState} from "react"
import axios from 'axios'
import Datatable from '../components/Datatable'

//import XLSX from 'xlsx'
//import {Link} from 'react-router-dom'
import {
  Form,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Button
} from 'reactstrap';

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
  const [query, setQuery] = useState([])
  
  const sendQueryParams = () => {       
    setEntityList([]) 
    const siteNameEmpty = siteName === ''
    const latLonEmpty = latFrom === '' && latTo === '' && longFrom === '' && longTo === ''
    const latLonIncomplete = !latLonEmpty && (latFrom === '' || latTo === '' || longFrom === '' || longTo === '' || latFrom > latTo || longFrom > longTo)
    const ageEmpty = interpAgeFrom === '' && interpAgeTo === ''
    const ageIncomplete = !ageEmpty && (interpAgeFrom === '' || interpAgeTo === '' || interpAgeFrom > interpAgeTo)
    if (siteNameEmpty && latLonEmpty && ageEmpty) {
      alert("None of the query's filter parameters are specified correctly!\nPlease specify the Site Name and/or Lat-Lon coordinates and/or interval of InterpAge and try again!")
    } else if (latLonIncomplete) {
      alert("The coordinates are incorrect or some are missing!\nPlease revise the coordinates, and try again!")
    } else if (ageIncomplete){
      alert("The InterpAge interval is incorrect or incomlete!\nPlease revise the begin and end of the interval, and try again! ")
    } else {
      axios.post(`http://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_SERVER_API}/getentitymeta`, {
        email:email,
        siteName: siteName,
        lat: [ latFrom, latTo ],
        lon: [ longFrom, longTo ],
        age: [ interpAgeFrom, interpAgeTo ]
      }).then((response) => {          
        console.log(response.data)
        setQuery(response.data.sql)                          
        setEntityList(response.data.meta)        
      }).catch(error => console.log(error))
    }    
  }

      
  return (
    <div className="Step1Screen">
      <div className="wrapper">
        <div className="box">
          <h2>Quering entity metadata</h2>
          <p>Please specify the parameters of the query below. Make sure that at least one of the parameters 
            (Site Name, Lat-Lon Coordinates or InterpAge time interval) is defined! If more than one of the above 
            has been defined, they will be filled together for the result of the query. (So there is a logical AND 
            connection between parameters).</p>
          <div>
            <Form inline>
              <Row>
                <Col>
                  <FormGroup floating>
                    <Input
                      id="Email"
                      name="email"
                      placeholder="Email"
                      type="email"
                      onChange={(event)=>{
                        setEmail(event.target.value)
                      }}
                    />
                    <Label for="Email">
                      Email
                    </Label>                
                  </FormGroup>
                </Col>              
              </Row>
              
              
              <h5 className="filterTitle">Filter type 1 (Site)</h5>
              <Row>
                <Col>
                  <FormGroup floating>
                    <Input
                      id="SiteName"
                      name="siteName"
                      placeholder="Site name"                
                      onChange={(event)=>{
                        setSiteName(event.target.value)
                      }}/>
                    <Label for="SiteName">Site name</Label>
                  </FormGroup>              
                </Col>              
              </Row>         
              
              
              <h5 className="filterTitle">Filter type 2 (Lat-Lon)</h5>
              <Row>            
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LatFrom"
                      name="latFrom"
                      placeholder="Latitude from"                
                      onChange={(event)=>{
                        setLatFrom(event.target.value)
                      }}/>
                    <Label for="LatFrom">Latitude from</Label>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LatTo"
                      name="latTo"
                      placeholder="Latitude to"                
                      onChange={(event)=>{
                        setLatTo(event.target.value)
                      }}/>
                    <Label for="LatTo">Latitude to</Label>
                  </FormGroup>
                </Col>            
              </Row>                   
              <Row>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LonFrom"
                      name="lonFrom"
                      placeholder="Longitude from"                
                      onChange={(event)=>{
                        setLongFrom(event.target.value)
                      }}/>
                    <Label for="LonFrom">Longitude from</Label>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LonTo"
                      name="lonTo"
                      placeholder="Longitude to"                
                      onChange={(event)=>{
                        setLongTo(event.target.value)
                      }}/>
                    <Label for="LonTo">Longitude to</Label>
                  </FormGroup>
                </Col>
              </Row>


              <h5 className="filterTitle">Filter type 3 (Interp_age)</h5>
              <p>Usage is mandatory for advanced querying!</p>
              <Row>            
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LatFrom"
                      name="latFrom"
                      placeholder="Iterp_age from"                
                      onChange={(event)=>{
                        setInterpAgeFrom(event.target.value)
                      }}/>
                    <Label for="LatFrom">Iterp_age from</Label>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LatTo"
                      name="latTo"
                      placeholder="Iterp_age to"  
                      value={interpAgeTo}              
                      onChange={(event)=>{
                        setInterpAgeTo(event.target.value)                      
                      }}/>
                    <Label for="LatTo">Iterp_age to</Label>
                  </FormGroup>
                </Col>            
              </Row>                               
            </Form>
          </div>       
          <div>
            <Button 
              color="primary"           
              onClick={sendQueryParams}
            >Get entity list</Button>
          </div>
        </div>
        <div className="box">                    
          <Datatable data={entityList} query={query} interpAgeFrom={interpAgeFrom} interpAgeTo={interpAgeTo}/>
        </div>
      </div>
    </div>
  )
}

export default Step1Screen