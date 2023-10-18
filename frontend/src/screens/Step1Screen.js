import './Step1Screen.css'
//import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import { useState, useEffect } from "react"
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
  Button,
  Alert
} from 'reactstrap';

import { MapContainer, TileLayer } from 'react-leaflet';
import Map from '../components/Map';

const tempSpeleothemType = [
  { name: 'non-composite', isChecked: true },
  { name: 'composite', isChecked: false }
]

const Step1Screen = () => {

  const [email, setEmail] = useState("")
  const [siteName, setSiteName] = useState("")
  const [latFrom, setLatFrom] = useState("")
  const [latTo, setLatTo] = useState("")
  const [longFrom, setLongFrom] = useState("")
  const [longTo, setLongTo] = useState("")
  const [interpAgeFrom, setInterpAgeFrom] = useState("")
  const [interpAgeTo, setInterpAgeTo] = useState("")

  const [entityList, setEntityList] = useState([])
  const [query, setQuery] = useState([])

  const [speleothemType, setSpeleothemType] = useState([tempSpeleothemType])
  useEffect(() => {
    setSpeleothemType(tempSpeleothemType)
  }, [])

  const sendQueryParams = () => {
    setEntityList([])
    const siteNameEmpty = siteName === ''
    const latLonEmpty = latFrom === '' && latTo === '' && longFrom === '' && longTo === ''
    const latLonIncomplete = !latLonEmpty && (latFrom === '' || latTo === '' || longFrom === '' || longTo === '' || parseInt(latFrom) > parseInt(latTo) || parseInt(longFrom) > parseInt(longTo))
    const ageEmpty = interpAgeFrom === '' && interpAgeTo === ''
    const ageIncomplete = !ageEmpty && (interpAgeFrom === '' || interpAgeTo === '' || parseInt(interpAgeFrom) > parseInt(interpAgeTo))
    if (siteNameEmpty && latLonEmpty && ageEmpty) {
      alert("None of the query's filter parameters are specified correctly!\nPlease specify the site_name and/or Lat-Lon coordinates and/or interp_age interval and try again! Please see the user guide for instructions on the main page.")
    } else if (latLonIncomplete) {
      alert("The coordinates are incorrect or some are missing! Please revise the coordinates, and try again! Default is global coverage from -90° to 90° and from -180° to 180°.")
    } else if (ageIncomplete) {
      alert("The interp_age interval is incorrect or incomplete!\nPlease revise the beginning (younger) and end (older) of the interval, and try again!")
    } else if (speleothemType[0].isChecked === false && speleothemType[1].isChecked === false) {
      alert("Please select at least one speleothem_type!")
    } else {
      axios.post(`${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_SERVER_API}/getentitymeta`, {
        email: email,
        siteName: siteName,
        lat: [latFrom, latTo],
        lon: [longFrom, longTo],
        age: [interpAgeFrom, interpAgeTo],
        speleothemType: speleothemType
      }).then((response) => {
        console.log(response.data)
        setQuery(response.data.sql)
        setEntityList(response.data.meta)
      }).catch(error => console.log(error))
    }
  }

  const selectSpeleothemType = (e) => {
    const { name, checked } = e.target
    console.log(name, checked, speleothemType)
    let tmp = speleothemType.map((st) =>
      st.name === name ? { ...st, isChecked: checked } : st
    )
    console.log(tmp)
    setSpeleothemType(tmp)
  }

  return (
    <div className="Step1Screen">
      <div className="wrapper">
        <div className="box">
          <Alert color='info'>
            <span>🛈</span>
            <span>When using the SISALwebApp please cite the app itself https://geochem.hu/SISAL_webApp/ AND the corresponding paper <strong>
              Hatvani IG, Kern Z, Tanos P, Wilhelm M, Lechleitner FA, Kaushal N
                (2023). The SISAL webApp: exploring the speleothem climate and environmental archives of the world. Quaternary Research 1-7. <a href="https://doi.org/10.1017/qua.2023.39">https://doi.org/10.1017/qua.2023.39</a>
            </strong> .</span>
          </Alert>
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
                      onChange={(event) => {
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
                      placeholder="site_name"
                      onChange={(event) => {
                        setSiteName(event.target.value)
                      }} />
                    <Label for="SiteName">site_name</Label>
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
                      placeholder="Latitude from -90°"
                      onChange={(event) => {
                        setLatFrom(event.target.value)
                      }} />
                    <Label for="LatFrom">Latitude from -90°</Label>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LatTo"
                      name="latTo"
                      placeholder="Latitude to 90°"
                      onChange={(event) => {
                        setLatTo(event.target.value)
                      }} />
                    <Label for="LatTo">Latitude to 90°</Label>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LonFrom"
                      name="lonFrom"
                      placeholder="Longitude from -180°"
                      onChange={(event) => {
                        setLongFrom(event.target.value)
                      }} />
                    <Label for="LonFrom">Longitude from -180°</Label>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LonTo"
                      name="lonTo"
                      placeholder="Longitude to 180°"
                      onChange={(event) => {
                        setLongTo(event.target.value)
                      }} />
                    <Label for="LonTo">Longitude to 180°</Label>
                  </FormGroup>
                </Col>
              </Row>


              <h5 className="filterTitle">Filter type 3 (interp_age)</h5>
              <p>Usage is mandatory for advanced querying!</p>
              <Row>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LatFrom"
                      name="latFrom"
                      placeholder="interp_age from (years BP)"
                      onChange={(event) => {
                        setInterpAgeFrom(event.target.value)
                      }} />
                    <Label for="LatFrom">interp_age from (years BP)</Label>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LatTo"
                      name="latTo"
                      placeholder="Iterp_age to (years BP)"
                      value={interpAgeTo}
                      onChange={(event) => {
                        setInterpAgeTo(event.target.value)
                      }} />
                    <Label for="LatTo">interp_age to (years BP)</Label>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <h5 className="filterTitle">Included speleothem_type(s)</h5>
                <p>At least one of the checkboxes below must be checked!</p>
                <Col sm="4" xs="6">
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      defaultChecked="checked"
                      name="non-composite"
                      onChange={selectSpeleothemType}
                    />
                    <Label>Non-Composite</Label>
                  </div>
                </Col>
                <Col sm="4" xs="6">
                  <div className="form-check">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      name="composite"
                      onChange={selectSpeleothemType}
                    />
                    <Label>Composite</Label>
                  </div>
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
          <Datatable data={entityList} query={query} interpAgeFrom={interpAgeFrom} interpAgeTo={interpAgeTo} />
        </div>
      </div>

      <MapContainer center={[51.505, -0.09]} zoom={3} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Map data={entityList} />
      </MapContainer>
    </div>
  )
}

export default Step1Screen
