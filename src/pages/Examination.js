import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import Header from "../component/Header";
import NavBarProfile from "../component/NavBarProfile";
import Footer from "../component/Footer";

const Examination = () => {
  const [key, setKey] = useState("patient");
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    ethnicity: "",
    refraction: "",
    image: null,
  });

  const handleNext = () => {
    if (key === "patient") {
      const { name, gender, dob, ethnicity } = formData;
      if (!name || !gender || !dob || !ethnicity) {
        alert("Please fill in all required fields");
        return;
      }
      setKey("history");
    } else if (key === "history") {
      setKey("exam");
    }
  };

  return (
    <>
      <Header />
      <NavBarProfile />

      <Container
        className="mt-5 mb-5 p-4 border rounded shadow"
        style={{ maxWidth: "1100px", backgroundColor: "#f8f9fa" }}
      >
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
          <Tab eventKey="patient" title="Patient Information">
            <Form>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender">
                      <option>Male</option>
                      <option>Female</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Ethnicity</Form.Label>
                    <Form.Control
                      placeholder="Enter ethnicity"
                      value={formData.ethnicity}
                      onChange={(e) =>
                        setFormData({ ...formData, ethnicity: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Refraction</Form.Label>
                    <Form.Check
                      type="radio"
                      label="OD"
                      name="refraction"
                      inline
                      onChange={() =>
                        setFormData({ ...formData, refraction: "OD" })
                      }
                    />
                    <Form.Check
                      type="radio"
                      label="OS"
                      name="refraction"
                      inline
                      onChange={() =>
                        setFormData({ ...formData, refraction: "OS" })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Image Upload */}
              <Row className="mt-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Upload Eye Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button className="mt-3" onClick={handleNext}>
                Next
              </Button>
            </Form>
          </Tab>

          <Tab eventKey="history" title="Medical History">
            <Form>
              {[
                "Stroke",
                "Heart Disease",
                "High Blood Pressure",
                "Diabetes",
                "Glaucoma",
                "Cataract",
                "Smoking",
                "Lens Opacity",
              ].map((disease, idx) => (
                <Row key={idx} className="mb-2">
                  <Col md={3}>
                    <Form.Label>{disease}</Form.Label>
                  </Col>
                  <Col>
                    <Form.Check type="checkbox" label="Yes" />
                  </Col>
                  <Col>
                    <Form.Check type="checkbox" label="Self" />
                  </Col>
                  <Col>
                    <Form.Check type="checkbox" label="In Family" />
                  </Col>
                </Row>
              ))}
              <Row className="mt-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Height (cm)</Form.Label>
                    <Form.Control placeholder="Enter height in cm" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Weight (kg)</Form.Label>
                    <Form.Control placeholder="Enter weight in kg" />
                  </Form.Group>
                </Col>
              </Row>
              <Button className="mt-3" onClick={handleNext}>
                Next
              </Button>
            </Form>
          </Tab>

          <Tab eventKey="exam" title="Eye Examination">
            <Form>
              <h5>Right Eye</h5>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Visus (CC)</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Previous Value</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Since</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Refraction</Form.Label>
                    <Form.Control placeholder="Sphere" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Control placeholder="Cylinder" />
                </Col>
                <Col>
                  <Form.Control placeholder="Axis" />
                </Col>
              </Row>

              <h5 className="mt-4">Left Eye</h5>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Visus (CC)</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Previous Value</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Since</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Refraction</Form.Label>
                    <Form.Control placeholder="Sphere" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Control placeholder="Cylinder" />
                </Col>
                <Col>
                  <Form.Control placeholder="Axis" />
                </Col>
              </Row>

              <h5 className="mt-4">Additional Results</h5>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Intraocular Pressure</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Check type="checkbox" label="Corrected" />
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Corneal Thickness</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Anterior Chamber Angle</Form.Label>
                    <Form.Control />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Check type="checkbox" label="Amsler Test Abnormal" />
                </Col>
              </Row>

              <Button variant="primary" className="mt-3">
                Save Data
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </Container>

      <Footer />
    </>
  );
};

export default Examination;
