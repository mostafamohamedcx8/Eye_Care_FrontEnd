import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import Header from "../component/Header";
import NavBarProfile from "../component/NavBarProfile";
import Footer from "../component/Footer";

const Examination = () => {
  const [key, setKey] = useState("patient");
  const [subTab, setSubTab] = useState("medical");

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    ethnicity: "",
    refraction: "",
    image: null,
  });
  const [medicalDiseases, setMedicalDiseases] = useState([
    "Diabetes M.",
    "Hypertension",
    "Rheumatic diseases",
    "Thyroid",
    "Tumours",
    "Genetic",
  ]);

  const [eyeDiseases, setEyeDiseases] = useState([
    "Cataract",
    "Glaucoma",
    "Age-related macular degeneration",
  ]);

  const [newMedical, setNewMedical] = useState("");
  const [newEye, setNewEye] = useState("");
  const [rightEyeImages, setRightEyeImages] = useState([]);
  const [leftEyeImages, setLeftEyeImages] = useState([]);

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

  const handleAddMedical = () => {
    if (newMedical.trim() !== "") {
      setMedicalDiseases([...medicalDiseases, newMedical]);
      setNewMedical("");
    }
  };

  const handleAddEye = () => {
    if (newEye.trim() !== "") {
      setEyeDiseases([...eyeDiseases, newEye]);
      setNewEye("");
    }
  };

  return (
    <>
      <Header />
      <NavBarProfile />

      <Container
        className="mt-5 mb-5 p-4 border rounded shadow"
        style={{ maxWidth: "1200px", backgroundColor: "#f8f9fa" }}
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
                    <Form.Select
                      value={formData.ethnicity}
                      onChange={(e) =>
                        setFormData({ ...formData, ethnicity: e.target.value })
                      }
                    >
                      <option value="">Select ethnicity</option>

                      <optgroup label="Asian or Asian British">
                        <option value="Indian">Indian</option>
                        <option value="Pakistani">Pakistani</option>
                        <option value="Bangladeshi">Bangladeshi</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Any other Asian background">
                          Any other Asian background
                        </option>
                      </optgroup>

                      <optgroup label="Black, Black British, Caribbean or African">
                        <option value="Caribbean">Caribbean</option>
                        <option value="African">African</option>
                        <option value="Any other Black, Black British, or Caribbean background">
                          Any other Black, Black British, or Caribbean
                          background
                        </option>
                      </optgroup>

                      <optgroup label="Mixed or multiple ethnic groups">
                        <option value="White and Black Caribbean">
                          White and Black Caribbean
                        </option>
                        <option value="White and Black African">
                          White and Black African
                        </option>
                        <option value="White and Asian">White and Asian</option>
                        <option value="Any other Mixed or multiple ethnic background">
                          Any other Mixed or multiple ethnic background
                        </option>
                      </optgroup>

                      <optgroup label="White">
                        <option value="English, Welsh, Scottish, Northern Irish or British">
                          English, Welsh, Scottish, Northern Irish or British
                        </option>
                        <option value="Irish">Irish</option>
                        <option value="Gypsy or Irish Traveller">
                          Gypsy or Irish Traveller
                        </option>
                        <option value="Roma">Roma</option>
                        <option value="Any other White background">
                          Any other White background
                        </option>
                      </optgroup>

                      <optgroup label="Other ethnic group">
                        <option value="Arab">Arab</option>
                        <option value="Any other ethnic group">
                          Any other ethnic group
                        </option>
                      </optgroup>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Refraction</Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="OD"
                      name="refractionOD"
                      inline
                      checked={formData.refraction?.includes("OD")}
                      onChange={(e) => {
                        const { checked } = e.target;
                        const updated = checked
                          ? [...(formData.refraction || []), "OD"]
                          : (formData.refraction || []).filter(
                              (val) => val !== "OD"
                            );
                        setFormData({ ...formData, refraction: updated });
                      }}
                    />
                    <Form.Check
                      type="checkbox"
                      label="OS"
                      name="refractionOS"
                      inline
                      checked={formData.refraction?.includes("OS")}
                      onChange={(e) => {
                        const { checked } = e.target;
                        const updated = checked
                          ? [...(formData.refraction || []), "OS"]
                          : (formData.refraction || []).filter(
                              (val) => val !== "OS"
                            );
                        setFormData({ ...formData, refraction: updated });
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button className="mt-3" onClick={handleNext}>
                Next
              </Button>
            </Form>
          </Tab>

          <Tab eventKey="history" title="History">
            <Tabs
              activeKey={subTab}
              onSelect={(k) => setSubTab(k)}
              className="mb-3"
            >
              <Tab eventKey="medical" title="Medical">
                <Form>
                  {medicalDiseases.map((disease, index) => (
                    <Row key={index} className="mb-2 align-items-center">
                      <Col md={4}>
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
                    <Col md={6}>
                      <Form.Control
                        placeholder="Add new medical disease"
                        value={newMedical}
                        onChange={(e) => setNewMedical(e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Button onClick={handleAddMedical}>Add Disease</Button>
                    </Col>
                  </Row>
                </Form>
              </Tab>

              <Tab eventKey="eye" title="Eye">
                <Form>
                  {eyeDiseases.map((disease, index) => (
                    <Row key={index} className="mb-2 align-items-center">
                      <Col md={4}>
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
                    <Col md={6}>
                      <Form.Control
                        placeholder="Add new eye disease"
                        value={newEye}
                        onChange={(e) => setNewEye(e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Button onClick={handleAddEye}>Add Disease</Button>
                    </Col>
                  </Row>
                </Form>
              </Tab>
            </Tabs>

            <Button className="mt-3" onClick={() => setKey("exam")}>
              Next
            </Button>
          </Tab>

          <Tab eventKey="exam" title="Eye Examination">
            <Form>
              {/* Right Eye Card */}
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Right Eye</h5>

                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          Visus (CC){" "}
                          <span className="text-muted">(Decimal)</span>
                        </Form.Label>
                        <Form.Select>
                          <option>Select Visus</option>
                          <option>2.0 (20/10)</option>
                          <option>1.6 (20/12)</option>
                          <option>1.26 (20/16)</option>
                          <option>1.0 (20/20)</option>
                          <option>0.8 (20/25)</option>
                          <option>0.63 (20/30)</option>
                          <option>0.5 (20/40)</option>
                          <option>0.4 (20/50)</option>
                          <option>0.32 (20/60)</option>
                          <option>0.25 (20/80)</option>
                          <option>0.2 (20/100)</option>
                          <option>0.16 (20/125)</option>
                          <option>0.13 (20/160)</option>
                          <option>0.1 (20/200)</option>
                          <option>0.08 (20/250)</option>
                          <option>0.063 (20/300)</option>
                          <option>0.05 (20/400)</option>
                          <option>0.04 (20/500)</option>
                          <option>0.032 (20/600)</option>
                          <option>0.025 (20/800)</option>
                          <option>0.02 (20/1000)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          Previous Value{" "}
                          <span className="text-muted">(Decimal)</span>
                        </Form.Label>
                        <Form.Select>
                          <option>Select Visus</option>
                          <option>Select Visus</option>
                          <option>2.0 (20/10)</option>
                          <option>1.6 (20/12)</option>
                          <option>1.26 (20/16)</option>
                          <option>1.0 (20/20)</option>
                          <option>0.8 (20/25)</option>
                          <option>0.63 (20/30)</option>
                          <option>0.5 (20/40)</option>
                          <option>0.4 (20/50)</option>
                          <option>0.32 (20/60)</option>
                          <option>0.25 (20/80)</option>
                          <option>0.2 (20/100)</option>
                          <option>0.16 (20/125)</option>
                          <option>0.13 (20/160)</option>
                          <option>0.1 (20/200)</option>
                          <option>0.08 (20/250)</option>
                          <option>0.063 (20/300)</option>
                          <option>0.05 (20/400)</option>
                          <option>0.04 (20/500)</option>
                          <option>0.032 (20/600)</option>
                          <option>0.025 (20/800)</option>
                          <option>0.02 (20/1000)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Since</Form.Label>
                        <Form.Control type="date" />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Upload with preview */}
                  <Form.Group className="mt-3">
                    <Form.Label>Upload Images (Right Eye)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setRightEyeImages([...e.target.files])}
                    />
                    <Form.Text className="text-muted">
                      Please upload high-quality images. Blurry images may
                      affect diagnosis.
                    </Form.Text>
                    <div className="mt-2 d-flex flex-wrap">
                      {rightEyeImages?.map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          width={100}
                          className="m-2 rounded border"
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Label>Sphere</Form.Label>
                      <Form.Control placeholder="(+/- 0.0 - 25.0)" />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Cylinder</Form.Label>
                      <Form.Control placeholder="(+/-)" />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Axis</Form.Label>
                      <Form.Control placeholder="Axis" />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      <Form.Label>Intraocular Pressure (mmHg)</Form.Label>
                      <Form.Select>
                        <option value="">Select</option>
                        {[...Array(91)].map((_, i) => (
                          <option key={i}>{i}</option>
                        ))}
                        <option>Not Measurable</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Label>Corneal Thickness</Form.Label>
                      <Form.Control />
                    </Col>
                    <Col>
                      <Form.Label>Chamber Angle</Form.Label>
                      <Form.Control />
                    </Col>
                  </Row>

                  <Form.Check
                    className="mt-2"
                    type="checkbox"
                    label="Amsler Test Abnormal"
                  />
                </Card.Body>
              </Card>

              {/* Left Eye Card */}
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Left Eye</h5>

                  <Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          Visus (CC){" "}
                          <span className="text-muted">(Decimal)</span>
                        </Form.Label>
                        <Form.Select>
                          <option>Select Visus</option>
                          <option>Select Visus</option>
                          <option>2.0 (20/10)</option>
                          <option>1.6 (20/12)</option>
                          <option>1.26 (20/16)</option>
                          <option>1.0 (20/20)</option>
                          <option>0.8 (20/25)</option>
                          <option>0.63 (20/30)</option>
                          <option>0.5 (20/40)</option>
                          <option>0.4 (20/50)</option>
                          <option>0.32 (20/60)</option>
                          <option>0.25 (20/80)</option>
                          <option>0.2 (20/100)</option>
                          <option>0.16 (20/125)</option>
                          <option>0.13 (20/160)</option>
                          <option>0.1 (20/200)</option>
                          <option>0.08 (20/250)</option>
                          <option>0.063 (20/300)</option>
                          <option>0.05 (20/400)</option>
                          <option>0.04 (20/500)</option>
                          <option>0.032 (20/600)</option>
                          <option>0.025 (20/800)</option>
                          <option>0.02 (20/1000)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          Previous Value{" "}
                          <span className="text-muted">(Decimal)</span>
                        </Form.Label>
                        <Form.Select>
                          <option>Select Visus</option>
                          <option>2.0 (20/10)</option>
                          <option>1.6 (20/12)</option>
                          <option>1.26 (20/16)</option>
                          <option>1.0 (20/20)</option>
                          <option>0.8 (20/25)</option>
                          <option>0.63 (20/30)</option>
                          <option>0.5 (20/40)</option>
                          <option>0.4 (20/50)</option>
                          <option>0.32 (20/60)</option>
                          <option>0.25 (20/80)</option>
                          <option>0.2 (20/100)</option>
                          <option>0.16 (20/125)</option>
                          <option>0.13 (20/160)</option>
                          <option>0.1 (20/200)</option>
                          <option>0.08 (20/250)</option>
                          <option>0.063 (20/300)</option>
                          <option>0.05 (20/400)</option>
                          <option>0.04 (20/500)</option>
                          <option>0.032 (20/600)</option>
                          <option>0.025 (20/800)</option>
                          <option>0.02 (20/1000)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Since</Form.Label>
                        <Form.Control type="date" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mt-3">
                    <Form.Label>Upload Images (Left Eye)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setLeftEyeImages([...e.target.files])}
                    />
                    <Form.Text className="text-muted">
                      Please upload high-quality images. Blurry images may
                      affect diagnosis.
                    </Form.Text>
                    <div className="mt-2 d-flex flex-wrap">
                      {leftEyeImages?.map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          width={100}
                          className="m-2 rounded border"
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Label>Sphere</Form.Label>
                      <Form.Control placeholder="(+/- 0.0 - 25.0)" />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Cylinder</Form.Label>
                      <Form.Control placeholder="(+/-)" />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Axis</Form.Label>
                      <Form.Control placeholder="Axis" />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      <Form.Label>Intraocular Pressure (mmHg)</Form.Label>
                      <Form.Select>
                        <option value="">Select</option>
                        {[...Array(91)].map((_, i) => (
                          <option key={i}>{i}</option>
                        ))}
                        <option>Not Measurable</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Label>Corneal Thickness</Form.Label>
                      <Form.Control />
                    </Col>
                    <Col>
                      <Form.Label>Chamber Angle</Form.Label>
                      <Form.Control />
                    </Col>
                  </Row>

                  <Form.Check
                    className="mt-2"
                    type="checkbox"
                    label="Amsler Test Abnormal"
                  />
                </Card.Body>
              </Card>

              <Button
                href="/ExaminationReport"
                variant="primary"
                className="mt-2"
              >
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
