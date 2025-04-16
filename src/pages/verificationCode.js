import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Button, Container, Form, Row } from "react-bootstrap";

const VerificationSection = () => {
  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className="about-hero">
          <div className="overlay about-hero">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>
              <span className="separator">/</span>
              <span className="active">Registration</span>
            </div>
            <h1 className="title">Verify Your Email</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container
        className="mt-5 mb-5 p-4 border rounded shadow"
        style={{ maxWidth: "600px", backgroundColor: "#f8f9fa" }}
      >
        <h4 className="text-center mb-4">Verify Your Email</h4>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Enter the code sent to your email</Form.Label>
            <Form.Control type="text" placeholder="Enter verification code" />
          </Form.Group>
          <Button href="/login" className="w-100" type="submit">
            Verify
          </Button>
        </Form>
      </Container>
    </>
  );
};
const Verificationcode = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <VerificationSection />
      <Footer />
    </div>
  );
};

export default Verificationcode;
