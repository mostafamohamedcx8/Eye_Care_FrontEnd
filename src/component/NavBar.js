import { React } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { FaGlobe } from "react-icons/fa";

const NavBar = () => {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="fw-bold button-color">
          Eye Care
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About Us</Nav.Link>
            <Nav.Link href="/Login">Login</Nav.Link>
            <Nav.Link href="/Signup">Registration</Nav.Link>
            <Button
              variant="button-color"
              className="ms-3 d-flex align-items-center gap-1 button-color"
            >
              <FaGlobe /> Language
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
