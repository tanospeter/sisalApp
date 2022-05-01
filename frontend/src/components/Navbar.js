import './Navbar.css'
import {Link} from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className = "navbar">
      
      <div className="navbar__logo">
        <h2>SISAL Project</h2>
      </div>
      
      <ul className="navbar__links">
        <li>
          <Link to="/">
            Home
          </Link>
        </li>
        <li>
          <Link to="/query">
            Querying
          </Link>
        </li>
        <li>
          <Link to="/database">
            Database
          </Link>
        </li>
      </ul>
      
      <div className="hamburger__menu">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  )
}

export default Navbar