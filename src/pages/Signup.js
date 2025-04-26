import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import React from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { State, City } from "country-state-city";

const SignupSection = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  useEffect(() => {
    const germanStates = State.getStatesOfCountry("DE"); // DE = Germany
    setStates(germanStates);
  }, []);
  useEffect(() => {
    if (selectedState) {
      const foundCities = City.getCitiesOfState("DE", selectedState);
      setCities(foundCities);
    }
  }, [selectedState]);
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
            <h1 className="title">Sign Up</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container
        className="mt-5 mb-5 p-4 border rounded shadow"
        style={{ maxWidth: "600px", backgroundColor: "#f8f9fa" }}
      >
        <h3 className="text-center mb-4">Sign Up</h3>

        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="firstName"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  name="lastName"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* تاريخ الميلاد */}
          <Form.Label>Date of Birth</Form.Label>
          <Row className="mb-3">
            <Col>
              <Form.Select name="birthDay">
                <option>Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select name="birthMonth">
                <option>Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, i) => (
                  <option key={i + 1} value={i + 1}>
                    {month}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select name="birthYear">
                <option>Year</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year}>{year}</option>;
                })}
              </Form.Select>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select name="gender">
              <option>Male</option>
              <option>Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
            />
          </Form.Group>

          {/* العنوان */}
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Select
              name="state"
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option>Select German State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Select name="city">
              <option>Select City</option>
              {cities.map((city, i) => (
                <option key={i}>{city.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Full Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your address (street..)"
              name="fullAddress"
            />
          </Form.Group>

          <Button
            href="/Verificationcode"
            className="w-100 mb-2 welcome-button"
            type="submit"
          >
            Sign Up
          </Button>
        </Form>
      </Container>
    </>
  );
};
const Signup = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <SignupSection />
      <Footer />
    </div>
  );
};

export default Signup;
