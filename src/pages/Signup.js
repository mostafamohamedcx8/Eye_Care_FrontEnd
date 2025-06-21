import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Signup_Hook } from "../Hook/Signup_Hook";

const SignupSection = () => {
  const [
    handleShowModal,
    firstname,
    lastname,
    dateOfBirthDay,
    dateOfBirthMonth,
    dateOfBirthYear,
    salutation,
    email,
    password,
    confirmPassword,
    selectedState,
    states,
    selectedcity,
    cities,
    postalCode,
    fullAddress,
    ispress,
    loading,
    showModal,
    handleCloseModal,
    handelSubmit,
    imagemedicallicense,
    onChangefirstname,
    onChangelastname,
    onChangeEmail,
    onChangedFullAddress,
    onChangedPostalCode,
    onChangedSelectedState,
    onChangedSelectedcity,
    onChangedateOfBirthDay,
    onChangedateOfBirthMonth,
    onChangedateOfBirthYear,
    onChangedimagemedicallicense,
    onChangedsalutation,
    onChangedPassword,
    onChangeConfirmPassword,
  ] = Signup_Hook();
  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
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

        <Form onSubmit={handleShowModal}>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={firstname}
                  onChange={onChangefirstname}
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
                  onChange={onChangelastname}
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
                onChange={onChangedateOfBirthDay}
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
                onChange={onChangedateOfBirthMonth}
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
                onChange={onChangedateOfBirthYear}
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
            <Form.Label>Salutation</Form.Label>
            <Form.Select value={salutation} onChange={onChangedsalutation}>
              <option value="" disabled hidden>
                Select Salutation
              </option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Mx">Mx</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={onChangeEmail}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={onChangedPassword}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
            />
          </Form.Group>

          {/* العنوان */}
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Select
              name="state"
              value={selectedState} // لازم تربطه بالقيمة الحالية
              onChange={onChangedSelectedState}
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
            <Form.Select value={selectedcity} onChange={onChangedSelectedcity}>
              <option>Select City</option>
              {cities.map((city, i) => (
                <option key={i}>{city.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your Postal Code (12564)"
              value={postalCode}
              onChange={onChangedPostalCode}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Full Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your address (street..)"
              value={fullAddress}
              onChange={onChangedFullAddress}
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-2 welcome-button">
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Medical license Or Shop license </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Medical license Or Shop license</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={onChangedimagemedicallicense}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={(e) => {
              handleCloseModal();
              handelSubmit(e); // ← نفذ السبميت بعد رفع الصورة
            }}
            disabled={!imagemedicallicense} // اعمل تعطيل للزر لو مفيش صورة
          >
            Confirm & Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
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
