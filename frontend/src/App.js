import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
//import {useState} from "react"
//import axios from 'axios'

// screens
import HomeScreen from './screens/HomeScreen'
import Step1Screen from './screens/Step1Screen'
import Step2Screen from './screens/Step2Screen'
import DatabaseScreen from './screens/DatabaseScreen'

// components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {

  return (
    <Router basename={process.env.REACT_APP_SERVER_BASEURL}>
      <Navbar />
      <main className='content'>
        <Routes>
          <Route exact path="/" element={<HomeScreen />} />
          <Route exact path="/step1" element={<Step1Screen />} />
          <Route exact path="/step2" element={<Step2Screen />} />
          <Route exact path="/database" element={<DatabaseScreen />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
