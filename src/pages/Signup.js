import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../component/Footer";
import { Button, Container, Form, Row, Col, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import React, { State, City } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { CreateUser } from "../Redux/actions/Useraction";
import { validateSignupForm } from "../Validations/validateSignupForm";
import notify from "../Hook/useNotification";

const SignupSection = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedcity, setSelectedcity] = useState("");
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

  const dispatch = useDispatch();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirthDay, setDateOfBirthDay] = useState("");
  const [dateOfBirthMonth, setDateOfBirthMonth] = useState("");
  const [dateOfBirthYear, setDateOfBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [loading, setloading] = useState(true);
  const [ispress, setispress] = useState(false);
  const User = useSelector((state) => state.alluser.User);

  const resetFormFields = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setGender("");
    setDateOfBirthDay("Day");
    setDateOfBirthMonth("Month");
    setDateOfBirthYear("Year");
    setSelectedState("");
    setSelectedcity("");
    setFullAddress("");
    setloading(true);
    setispress(false);
  };
  const handelSubmit = async (event) => {
    event.preventDefault();

    const monthNames = [
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
    ];

    const monthName = monthNames[parseInt(dateOfBirthMonth) - 1];
    const stateObject = states.find((state) => state.isoCode === selectedState);
    const stateName = stateObject ? stateObject.name : selectedState;

    const userData = {
      firstname,
      lastname,
      email,
      password,
      passwordConfirm: confirmPassword,
      gender: gender.toLowerCase(),
      dateOfBirth: {
        day: Number(dateOfBirthDay),
        month: monthName,
        year: Number(dateOfBirthYear),
      },
      state: stateName,
      city: selectedcity,
      fullAddress,
    };

    const isValid = validateSignupForm({
      firstname,
      lastname,
      email,
      password,
      passwordConfirm: confirmPassword,
      dateOfBirthDay,
      dateOfBirthMonth,
      dateOfBirthYear,
      gender,
      state: selectedState,
      city: selectedcity,
      fullAddress,
    });

    if (!isValid) return;

    setloading(true);
    setispress(true);
    console.log(userData);

    await dispatch(CreateUser(userData)); // Redux thunk
    setloading(false);
  };

  useEffect(() => {
    if (loading === false && User) {
      setispress(false);

      if (User?.status === 201) {
        resetFormFields();
        notify(
          "Account created. Please check your email for the verification link.",
          "success"
        );
        navigate("/Login");
      } else if (User?.data?.errors?.[0]?.msg === "Email already exists") {
        console.log(User?.data?.errors?.[0]?.msg);
        notify("Email already exists", "warn");
      } else {
        notify(User?.data?.message || "There is a problem", "error");
      }

      setTimeout(() => {
        setloading(true); // يرجع الزر لحالته الطبيعية
      }, 1500);
    }
  }, [loading, User]);
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
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* تاريخ الميلاد */}
          <Form.Label>Date of Birth</Form.Label>
          <Row className="mb-3">
            <Col>
              <Form.Select
                value={dateOfBirthDay}
                onChange={(e) => setDateOfBirthDay(e.target.value)}
              >
                <option>Day</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1}>{i + 1}</option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                value={dateOfBirthMonth}
                onChange={(e) => setDateOfBirthMonth(e.target.value)}
              >
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
              <Form.Select
                value={dateOfBirthYear}
                onChange={(e) => setDateOfBirthYear(e.target.value)}
              >
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
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="" disabled hidden>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          {/* العنوان */}
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Select
              name="state"
              value={selectedState} // لازم تربطه بالقيمة الحالية
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="" disabled>
                Select German State
              </option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Select
              value={selectedcity}
              onChange={(e) => setSelectedcity(e.target.value)}
            >
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
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
            />
          </Form.Group>

          <Button className="w-100 mb-2 welcome-button" onClick={handelSubmit}>
            Sign Up
          </Button>
        </Form>
        {ispress ? (
          loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <h4> done </h4>
          )
        ) : null}
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
