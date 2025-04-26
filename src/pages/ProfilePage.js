import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { State, City } from "country-state-city";
import Header from "../component/Header";
import NavBarProfile from "../component/NavBarProfile";
import Footer from "../component/Footer";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "Youssef Gogo",
    email: "yjww179@gmail.com",
    password: "••••••••",
    state: "",
    city: "",
    address: "",
  });
  const [image, setImage] = useState("https://www.gravatar.com/avatar/?d=mp");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    password: false,
    address: false,
  });

  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const states = State.getStatesOfCountry("DE"); // Germany

  useEffect(() => {
    if (selectedState) {
      const stateCities = City.getCitiesOfState("DE", selectedState);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const toggleEdit = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  return (
    <>
      <Header />
      <NavBarProfile />
      <Container className="mt-5 mb-5">
        <h2 className="mb-4">My Profile</h2>
        <Row>
          <Col md={8}>
            <Card className="p-4 shadow-sm">
              {/* Full Name */}
              <div className="mb-3 d-flex justify-content-between">
                <div>
                  <strong>Full Name</strong> <br />
                  {editMode.name ? (
                    <Form.Control
                      type="text"
                      value={user.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  ) : (
                    user.name
                  )}
                </div>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => toggleEdit("name")}
                >
                  {editMode.name ? "Save" : "Edit"}
                </Button>
              </div>
              <hr />

              {/* Email */}
              <div className="mb-3 d-flex justify-content-between">
                <div>
                  <strong>Email</strong> <br />
                  {editMode.email ? (
                    <Form.Control
                      type="email"
                      value={user.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  ) : (
                    user.email
                  )}
                </div>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => toggleEdit("email")}
                >
                  {editMode.email ? "Save" : "Edit"}
                </Button>
              </div>
              <hr />

              {/* Password */}
              <div className="d-flex justify-content-between">
                <div>
                  <strong>Password</strong> <br />
                  {editMode.password ? (
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                  ) : (
                    "••••••••"
                  )}
                </div>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => toggleEdit("password")}
                >
                  {editMode.password ? "Save" : "Change"}
                </Button>
              </div>
              <hr />

              {/* Address */}
              <div className="mb-3">
                <strong>Address</strong>
                {!editMode.address ? (
                  <>
                    <div className="mt-2">
                      {user.state || "-"}, {user.city || "-"},{" "}
                      {user.address || "-"}
                    </div>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => toggleEdit("address")}
                    >
                      Edit
                    </Button>
                  </>
                ) : (
                  <>
                    <Form.Group className="mt-2">
                      <Form.Label>State</Form.Label>
                      <Form.Select
                        value={selectedState}
                        onChange={(e) => {
                          const iso = e.target.value;
                          setSelectedState(iso);
                          const stateName =
                            states.find((s) => s.isoCode === iso)?.name || "";
                          handleChange("state", stateName);
                          handleChange("city", "");
                        }}
                      >
                        <option value="">Select German State</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-2">
                      <Form.Label>City</Form.Label>
                      <Form.Select
                        value={user.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        disabled={!selectedState}
                      >
                        <option value="">Select City</option>
                        {cities.map((city, i) => (
                          <option key={i}>{city.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-2">
                      <Form.Label>Full Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your address (street...)"
                        value={user.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                      />
                    </Form.Group>

                    <Button
                      variant="link"
                      className="p-0 mt-1"
                      onClick={() => toggleEdit("address")}
                    >
                      Save
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </Col>

          {/* Profile Image */}
          <Col md={4} className="text-center">
            <img
              src={image}
              alt="Profile"
              className="rounded-circle mb-3"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <p
              className="text-muted"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={handleClick}
            >
              change your profile Image{" "}
            </p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default ProfilePage;
