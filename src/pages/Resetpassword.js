import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Button, Container, Form, Row, Card } from "react-bootstrap";

const ResetSection = () => {
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
            <h1 className="title">Reset Your Password</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Card style={{ width: "100%", maxWidth: "400px" }}>
          <Card.Body>
            <h4 className="text-center mb-3">Find Your Account</h4>
            <p className="text-center text-muted mb-4">
              Please Enter Your E-mail To Receive OTP To Reset Your Password.
            </p>

            <Form>
              <Form.Group className="mb-3">
                <Form.Control type="email" placeholder="Email address" />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button href="/Login" variant="secondary">
                  Cancel
                </Button>
                <Button href="/OtpCode" variant="primary" type="submit">
                  Search
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
const ResetPassword = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <ResetSection />
      <Footer />
    </div>
  );
};

export default ResetPassword;
