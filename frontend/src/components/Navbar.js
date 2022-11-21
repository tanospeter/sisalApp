import './Navbar.css'
import { NavLink } from 'react-router-dom'
import React, { useState } from 'react';
import logo from '../pic/fav.png'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar
        container="fluid"
        expand="md"
        color="dark"
        dark={true}
        light={false}
      >
        <NavbarBrand>
          <NavLink to="/" className="navbar-brand">
            <img
              alt="logo"
              src={logo}
              style={{
                height: 40,
                width: 40
              }}
            />
            SISAL
          </NavLink>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink to="step1" className="nav-link">Querying</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="database" className="nav-link">
                SISALv3 EER
              </NavLink>
            </NavItem>
            <NavItem>
              <a href="https://pastglobalchanges.org/taxonomy/term/119/publications" target="_blank" className="nav-link">
                Publications
              </a>
            </NavItem>
          </Nav>
          <NavbarText>PAST GLOBAL CHANGES</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  )
}


/*const Navbar = () => {
  
  return (
    <nav className = "navbar">      
      <div className="navbar__logo">
        <h2>SISAL</h2>
      </div>
      
      <ul className="navbar__links">
        <li>
          <Link to="/">
            Home
          </Link>
        </li>
        <li>
          <Link to="/step1">
            Querying
          </Link>
        </li>
        <li>
          <Link to="/database">
            Database
          </Link>
        </li>
      </ul>            
    </nav>
  )
}*/
export default Navbar2