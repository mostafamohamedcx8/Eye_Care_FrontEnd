import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Button, Container, Form, Row, Card } from "react-bootstrap";

const NewPasswordSection = () => {
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

      {/* New Password Form Section */}
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Card style={{ width: "100%", maxWidth: "400px" }}>
          <Card.Body>
            <h4 className="text-center mb-3">Create a New Password</h4>
            <p className="text-center text-muted mb-4">
              Your new password must be different from the previous password.
            </p>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                />
              </Form.Group>

              <Button
                href="/Login"
                variant="primary"
                className="w-100"
                type="submit"
              >
                Reset Password
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};
const Newpassword = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <NewPasswordSection />
      <Footer />
    </div>
  );
};

export default Newpassword;
