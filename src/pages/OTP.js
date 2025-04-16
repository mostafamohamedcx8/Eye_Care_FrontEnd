import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Button, Container, Form, Row, Card } from "react-bootstrap";

const OTPSection = () => {
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
              <span className="active">Reset Password</span>
            </div>
            <h1 className="title">Verify Your Identity</h1>
          </div>
        </div>
      </Row>

      {/* OTP Code Entry Section */}
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Card style={{ width: "100%", maxWidth: "400px" }}>
          <Card.Body>
            <h4 className="text-center mb-3">Enter Verification Code</h4>
            <p className="text-center text-muted mb-4">
              Please enter the 6-digit code that was sent to your email address.
            </p>

            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  maxLength="6"
                  placeholder="Enter verification code"
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button href="/Login" variant="secondary">
                  Cancel
                </Button>
                <Button href="/NewPassword" variant="primary" type="submit">
                  Verify
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
const OtpCode = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <OTPSection />
      <Footer />
    </div>
  );
};

export default OtpCode;
