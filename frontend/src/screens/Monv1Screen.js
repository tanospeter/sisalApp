import "./Step1Screen.css";
import { useState, useCallback } from "react";
import axios from "axios";
import Datatable from "../components/DatatableMonv1";
import {
  Form,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Button,
  Alert,
  Spinner,
} from "reactstrap";
import { MapContainer, TileLayer } from "react-leaflet";
import Map from "../components/Map";

const Monv1Screen = () => {
  const [siteName, setSiteName] = useState("");
  const [latFrom, setLatFrom] = useState("");
  const [latTo, setLatTo] = useState("");
  const [longFrom, setLongFrom] = useState("");
  const [longTo, setLongTo] = useState("");

  const [entityList, setEntityList] = useState([]);
  const [query, setQuery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAreaSelected = useCallback((bounds) => {
    console.log("Selected area bounds:", bounds);
    setLatFrom(bounds.southWest.lat.toFixed(5));
    setLatTo(bounds.northEast.lat.toFixed(5));
    setLongFrom(bounds.southWest.lng.toFixed(5));
    setLongTo(bounds.northEast.lng.toFixed(5));
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendQueryParams();
    }
  };

  const sendQueryParams = () => {
    setIsLoading(true);
    setEntityList([]);
    const siteNameEmpty = siteName === "";
    const latLonEmpty =
      latFrom === "" && latTo === "" && longFrom === "" && longTo === "";
    const latLonIncomplete =
      !latLonEmpty &&
      (latFrom === "" ||
        latTo === "" ||
        longFrom === "" ||
        longTo === "" ||
        parseInt(latFrom) > parseInt(latTo) ||
        parseInt(longFrom) > parseInt(longTo));
    if (siteNameEmpty && latLonEmpty) {
      alert(
        "None of the query's filter parameters are specified correctly!\nPlease specify the site_name and/or Lat-Lon coordinates and/or interp_age interval and try again! Please see the user guide for instructions on the main page."
      );
    } else if (latLonIncomplete) {
      alert(
        "The coordinates are incorrect or some are missing! Please revise the coordinates, and try again! Default is global coverage from -90° to 90° and from -180° to 180°."
      );
    } else {
      axios
        .post(
          `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}/${process.env.REACT_APP_SERVER_API}/getMonv1`,
          {
            siteName: siteName,
            lat: [latFrom, latTo],
            lon: [longFrom, longTo],
          }
        )
        .then((response) => {
          setQuery(response.data.sql);
          setEntityList(response.data.meta);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="Step1Screen">
      <div className="wrapper">
        <div className="box">
          <Alert color="info">
            <span>🛈</span>
            <span>
              When using the SISALwebApp please cite the app itself
              https://geochem.hu/SISAL_webApp/ AND the corresponding paper{" "}
              <strong>
                Hatvani IG, Kern Z, Tanos P, Wilhelm M, Lechleitner FA, Kaushal
                N (2024). The SISAL webApp: exploring the speleothem climate and
                environmental archives of the world. Quaternary Research 118,
                211-217.{" "}
                <a href="https://doi.org/10.1017/qua.2023.39">
                  https://doi.org/10.1017/qua.2023.39
                </a>
              </strong>{" "}
              .
            </span>
          </Alert>
          <h2>Quering entity metadata</h2>
          <p>
            Please specify the parameters of the query below. Make sure that at
            least one of the parameters (Site Name or Lat-Lon Coordinates) is defined! If more than one of the above
            has been defined, they will be filled together for the result of the
            query. (So there is a logical AND connection between parameters).
          </p>
          <div>
            <Form>
              <h5 className="filterTitle">Filter type 1 (Site)</h5>
              <Row>
                <Col>
                  <FormGroup floating>
                    <Input
                      id="SiteName"
                      name="siteName"
                      placeholder="site_name"
                      onChange={(event) => {
                        setSiteName(event.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    <Label for="SiteName">site_name</Label>
                  </FormGroup>
                </Col>
              </Row>

              <h5 className="filterTitle">Filter type 2 (Lat-Lon)</h5>
              <p>You can also use the rectangle tool on the map.</p>
              <Row>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LatFrom"
                      name="latFrom"
                      placeholder="Latitude from -90°"
                      value={latFrom}
                      onChange={(event) => {
                        setLatFrom(event.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    <Label for="LatFrom">Latitude from -90°</Label>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LatTo"
                      name="latTo"
                      placeholder="Latitude to 90°"
                      value={latTo}
                      onChange={(event) => {
                        setLatTo(event.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                    />
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
                      value={longFrom}
                      onChange={(event) => {
                        setLongFrom(event.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    <Label for="LonFrom">Longitude from -180°</Label>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup floating>
                    <Input
                      id="LonTo"
                      name="lonTo"
                      placeholder="Longitude to 180°"
                      value={longTo}
                      onChange={(event) => {
                        setLongTo(event.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    <Label for="LonTo">Longitude to 180°</Label>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </div>
          <div>
            <Button color="primary" onClick={sendQueryParams}>
              Get entity list
            </Button>
          </div>
        </div>
        <div className="box">
          {isLoading ? (
            <Spinner color="secondary" className="m-5">Loading...</Spinner>
          ) : entityList && entityList.length ? (
            <Datatable data={entityList} query={query} />
          ) : (
            ""
          )}
        </div>
      </div>

      <MapContainer
        center={[51.505, -0.09]}
        zoom={3}
        style={{ height: "400px", width: "100%" }}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        <Map data={entityList} onAreaSelected={handleAreaSelected} />
      </MapContainer>
    </div>
  );
};

export default Monv1Screen;
