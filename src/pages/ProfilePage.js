import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { State, City } from "country-state-city";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import bcrypt from "bcryptjs";
import {
  updateUserProfileData,
  UpdateLoggedUserPassword,
} from "../Redux/actions/Useraction";
import { useDispatch, useSelector } from "react-redux";
import notify from "../Hook/useNotification";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userFromStorage = JSON.parse(localStorage.getItem("user")) || {};

  const [firstname, setFirstname] = useState(userFromStorage.firstname || "");
  const [lastname, setLastname] = useState(userFromStorage.lastname || "");
  const [email, setEmail] = useState(userFromStorage.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState(userFromStorage.state || "");
  const [city, setCity] = useState(userFromStorage.city || "");
  const [fullAddress, setFullAddress] = useState(
    userFromStorage.fullAddress || ""
  );
  const [image, setImage] = useState(
    userFromStorage.imageProfile || "profile.jpg"
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    password: false,
    address: false,
  });
  const [loading, setLoading] = useState(false);
  const [Loading, setloading] = useState(true);
  const fileInputRef = useRef(null);
  const states = State.getStatesOfCountry("DE");

  useEffect(() => {
    if (selectedState) {
      const stateCities = City.getCitiesOfState("DE", selectedState);
      setCities(stateCities);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const toggleEdit = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleSubmit = async (field) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("email", email);
      formData.append("state", state);
      formData.append("city", city);
      formData.append("fullAddress", fullAddress);
      formData.append("imageProfile", selectedFile);

      // إرسال البيانات باستخدام الـ action
      await dispatch(updateUserProfileData(formData));

      // تحديث localStorage
      const updatedUser = {
        ...userFromStorage,
        firstname,
        lastname,
        email,
        state,
        city,
        fullAddress,
        imageProfile: image,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // إعادة تعيين وضع التعديل
      toggleEdit(field);
      notify("Profile updated successfully", "success");

      // تحديث الصفحة
      window.location.reload();
    } catch (error) {
      notify("Error updating profile", "error");
    } finally {
      setLoading(false);
    }
  };
  const res = useSelector((state) => state.alluser.userpassword);
  console.log(res);
  const handlePasswordChange = async () => {
    const hashedPassword = userFromStorage?.password;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return notify("Please fill all password fields", "warn");
    }

    if (newPassword !== confirmPassword) {
      return notify("New password and confirmation do not match", "warn");
    }

    if (!hashedPassword || !currentPassword) {
      return notify("Missing stored or entered password", "warn");
    }
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

    if (!isMatch) {
      return notify("Current password is incorrect", "warn");
    }

    setloading(true);
    await dispatch(
      UpdateLoggedUserPassword({
        password: newPassword,
      })
    );
    setloading(false);
  };

  useEffect(() => {
    if (Loading === false) {
      if (res && res.status === 200) {
        notify("password changed successfully", "success");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/Login");
        }, 1000);
      } else {
        notify("Password update failed", "warn");
      }
    }
  }, [Loading]);
  return (
    <>
      <Header />
      <NavBar />

      <Container className="mt-5 mb-5">
        <h2 className="mb-4">My Profile</h2>
        <Row>
          <Col md={8}>
            <Card className="p-4 shadow-sm">
              {/* Full Name */}
              <div className="mb-3">
                <strong>Full Name</strong> <br />
                {!editMode.name ? (
                  <div className="d-flex justify-content-between">
                    {firstname} {lastname}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => toggleEdit("name")}
                    >
                      Edit
                    </Button>
                  </div>
                ) : (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </Form.Group>

                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => handleSubmit("name")}
                      disabled={loading}
                    >
                      Save
                    </Button>
                  </>
                )}
              </div>
              <hr />

              {/* Email */}
              <div className="mb-3 d-flex justify-content-between">
                <div>
                  <strong>Email</strong> <br />
                  {editMode.email ? (
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    email
                  )}
                </div>
                <Button
                  variant="link"
                  className="p-0"
                  onClick={
                    editMode.email
                      ? () => handleSubmit("email")
                      : () => toggleEdit("email")
                  }
                  disabled={loading}
                >
                  {editMode.email ? "Save" : "Edit"}
                </Button>
              </div>
              <hr />

              {/* Password */}
              {/* Password Section */}
              <div className="mb-3">
                <strong>Password</strong> <br />
                {!editMode.password ? (
                  <div className="d-flex justify-content-between">
                    ••••••••
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => toggleEdit("password")}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        isInvalid={
                          !!currentPassword && currentPassword.length < 6
                        } // Basic validation
                      />
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        isInvalid={!!newPassword && newPassword.length < 6} // Basic validation
                      />
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        isInvalid={
                          !!confirmPassword &&
                          (confirmPassword.length < 6 ||
                            confirmPassword !== newPassword)
                        } // Validate match
                      />
                      <Form.Control.Feedback type="invalid">
                        {confirmPassword && confirmPassword !== newPassword
                          ? "Passwords do not match"
                          : "Password must be at least 6 characters"}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button
                        variant="primary"
                        onClick={handlePasswordChange}
                        disabled={
                          loading ||
                          !currentPassword ||
                          !newPassword ||
                          !confirmPassword
                        }
                      >
                        {loading ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => {
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          toggleEdit("password");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <hr />

              {/* Address */}
              <div className="mb-3">
                <strong>Address</strong>
                {!editMode.address ? (
                  <>
                    <div className="mt-2">
                      {state || "-"}, {city || "-"}, {fullAddress || "-"}
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
                          setState(stateName);
                          setCity("");
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
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
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
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                      />
                    </Form.Group>

                    <Button
                      variant="link"
                      className="p-0 mt-1"
                      onClick={() => handleSubmit("address")}
                      disabled={loading}
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
            <Button
              variant="primary"
              onClick={() => handleSubmit()}
              disabled={loading}
            >
              Save Image
            </Button>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default ProfilePage;
