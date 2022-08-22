import './Navbar.css'
import {Link} from 'react-router-dom'
import React, { useState } from 'react';
import logo from '../pic/fav.png'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
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
        full={true}
      >
        <NavbarBrand href="/">
          <img
            alt="logo"
            src={logo}
            style={{
              height: 40,
              width: 40
            }}
          />
          SISAL
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink href="/step1/">Querying</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/database/">
              database
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
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