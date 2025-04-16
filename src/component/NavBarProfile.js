import React from "react";
import { Container, Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import { FaGlobe } from "react-icons/fa";
// ← Make sure this path is correct

const NavBarProfile = () => {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="fw-bold button-color">
          Eye Care
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center gap-3">
            <Nav.Link href="/Examination">Home</Nav.Link>
            <Nav.Link href="/History">Previous Scans</Nav.Link>
            <Nav.Link href="/about">About Us</Nav.Link>

            <NavDropdown
              title={
                <Image
                  src={"Myprofile.jpg"}
                  roundedCircle
                  width="40"
                  height="40"
                  style={{ objectFit: "cover" }}
                />
              }
              id="user-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item href="/profile">Your Profile</NavDropdown.Item>
              <NavDropdown.Item href="mailto:yasminashraf048@gmail.com">
                Contact Us
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/">Logout</NavDropdown.Item>
            </NavDropdown>

            <button className="btn btn-outline-secondary d-flex align-items-center gap-1">
              <FaGlobe /> Language
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBarProfile;
