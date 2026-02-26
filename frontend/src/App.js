import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';

// screens
import HomeScreen from './screens/HomeScreen'
import Step1Screen from './screens/Step1Screen'
import Monv1Screen from './screens/Monv1Screen'
import SisalMonv1DescriptionScreen from './screens/Sisal_monv1DescriptionScreen'
import Sisalv3DescriptionScreen from './screens/Sisalv3DescriptionScreen'

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
          <Route exact path="/SISALv3_spel_database" element={<Step1Screen />} />
          <Route exact path="/SISALmonv1_monit_database" element={<Monv1Screen />} />
          <Route exact path="/SISALv3_EER" element={<Sisalv3DescriptionScreen />} />
          <Route exact path="/SISALmonv1_EER" element={<SisalMonv1DescriptionScreen />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
