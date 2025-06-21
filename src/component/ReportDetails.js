import MultiImageInput from "react-multiple-image-input";
import {
  Container,
  Tabs,
  Tab,
  Form,
  Row,
  Col,
  Card,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  validateEyeHistory,
  validateMedicalHistory,
  validateRightEyeSection,
} from "../Validations/reportValidation";

import { ReportDetails_Hook } from "../Hook/ReportDetails_Hook";

const ReportDetails = () => {
  const [
    patient,
    activeTab,
    handleOuterTabSelect,
    innerTab,
    handleInnerTabSelect,
    allMedicalDiseases,
    historyData,
    updateMedicalData,
    newMedicalDisease,
    handleAddMedicalDisease,
    setInnerTab,
    eyeDiseases,
    newEyeDisease,
    setActiveTab,
    rightVisusCC,
    rightPreviousValue,
    rightSince,
    Rightimages,
    setRightImages,
    crop,
    rightImageCaptureDate,
    rightSphere,
    rightCylinder,
    rightAxis,
    rightIntraocularPressure,
    rightCornealThickness,
    rightChamberAngle,
    rightAmslerTestAbnormal,
    rightEyeData,
    leftVisusCC,
    leftPreviousValue,
    leftSince,
    Leftimages,
    setLeftImages,
    leftImageCaptureDate,
    leftSphere,
    leftCylinder,
    leftAxis,
    leftIntraocularPressure,
    leftCornealThickness,
    leftChamberAngle,
    leftAmslerTestAbnormal,
    HandelSendingData,
    ispress,
    loading,
    handleAddEyeDisease,
    onChangeMedicalDisease,
    onChangeLeftAmslerTestAbnormal,
    onChangeLeftAxis,
    onChangeLeftChamberAngle,
    onChangeLeftCylinder,
    onChangeLeftVisusCC,
    onChangeLeftSphere,
    onChangeLeftSince,
    onChangeLeftPreviousValue,
    onChangeLeftIntraocularPressure,
    onChangeEyeDisease,
    onChangeRightIntraocularPressure,
    onChangeLeftCornealThickness,
    onChangeLeftImageCaptureDate,
    onChangeRightAmslerTestAbnormal,
    onChangeRightChamberAngle,
    onChangeRightCornealThickness,
    onChangeRightAxis,
    onChangeRightCylinder,
    onChangeRightSphere,
    onChangeRightImageCaptureDate,
    onChangeRightSince,
    onChangeRightPreviousValue,
    onChangeRightVisusCC,
    updateEyeData,
  ] = ReportDetails_Hook();

  return (
    <Container className="mt-5 mb-5">
      <h2 className="text-center mb-4 fw-bold button-color">
        Create Report for Patient
      </h2>
      {patient && (
        <Card className="mb-4">
          <Card.Body>
            <h5 className="text-center mb-4">Patient Information</h5>

            <div className="patient-data-container">
              <div className="patient-info-block">
                <span className="patient-label">Name</span>
                <span className="patient-data">
                  {patient?.data?.firstname} {patient?.data?.lastname}
                </span>
              </div>

              <div className="patient-info-block">
                <span className="patient-label">Salutation</span>
                <span className="patient-data">
                  {patient?.data?.salutation}
                </span>
              </div>

              <div className="patient-info-block">
                <span className="patient-label">Date of Birth</span>
                <span className="patient-data">
                  {new Date(patient?.data?.dateOfBirth).toLocaleDateString(
                    "de-DE"
                  )}
                </span>
              </div>

              <div className="patient-info-block">
                <span className="patient-label">Ethnicity</span>
                <span className="patient-data">{patient?.data?.ethnicity}</span>
              </div>

              <div className="patient-info-block">
                <span className="patient-label">Patient ID</span>
                <span className="patient-data">{patient?.data?._id}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={handleOuterTabSelect}
        className="mb-3"
      >
        <Tab eventKey="history" title="History">
          <Tabs
            activeKey={innerTab}
            onSelect={handleInnerTabSelect}
            className="mb-3"
          >
            <Tab eventKey="medical" title="Medical">
              <Form>
                {allMedicalDiseases.map((disease, index) => {
                  const existing =
                    historyData.medical.find((item) => item.name === disease) ||
                    {};
                  return (
                    <Row key={index} className="mb-2 align-items-center">
                      <Col md={4}>
                        <Form.Label>{disease}</Form.Label>
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label="Yes"
                          checked={existing.hasCondition || false}
                          onChange={(e) =>
                            updateMedicalData(
                              disease,
                              "hasCondition",
                              e.target.checked
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label="Self"
                          checked={existing.appliesTo === "Self"}
                          onChange={(e) =>
                            updateMedicalData(
                              disease,
                              "appliesTo",
                              e.target.checked ? "Self" : null
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label="In Family"
                          checked={existing.appliesTo === "In Family"}
                          onChange={(e) =>
                            updateMedicalData(
                              disease,
                              "appliesTo",
                              e.target.checked ? "In Family" : null
                            )
                          }
                        />
                      </Col>
                    </Row>
                  );
                })}
                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Control
                      placeholder="Add new medical disease"
                      value={newMedicalDisease}
                      onChange={onChangeMedicalDisease}
                    />
                  </Col>
                  <Col>
                    <Button onClick={handleAddMedicalDisease}>
                      Add Disease
                    </Button>
                  </Col>
                </Row>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => {
                    const isValid = validateMedicalHistory(historyData);
                    if (isValid) {
                      setInnerTab("eye");
                    }
                  }}
                >
                  Next
                </Button>
              </Form>
            </Tab>

            <Tab eventKey="eye" title="Eye">
              <Form>
                {eyeDiseases.map((disease, index) => {
                  const existing =
                    historyData.eye.find((item) => item.name === disease) || {};
                  return (
                    <Row key={index} className="mb-2 align-items-center">
                      <Col md={4}>
                        <Form.Label>{disease}</Form.Label>
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label="Yes"
                          checked={existing.hasCondition || false}
                          onChange={(e) =>
                            updateEyeData(
                              disease,
                              "hasCondition",
                              e.target.checked
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label="Self"
                          checked={existing.appliesTo === "Self"}
                          onChange={(e) =>
                            updateEyeData(
                              disease,
                              "appliesTo",
                              e.target.checked ? "Self" : null
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          label="In Family"
                          checked={existing.appliesTo === "In Family"}
                          onChange={(e) =>
                            updateEyeData(
                              disease,
                              "appliesTo",
                              e.target.checked ? "In Family" : null
                            )
                          }
                        />
                      </Col>
                    </Row>
                  );
                })}

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Control
                      placeholder="Add new eye disease"
                      value={newEyeDisease}
                      onChange={onChangeEyeDisease}
                    />
                  </Col>
                  <Col>
                    <Button onClick={handleAddEyeDisease}>Add Disease</Button>
                  </Col>
                </Row>
              </Form>

              <Button
                className="mt-4"
                variant="primary"
                onClick={() => {
                  const isValid = validateEyeHistory(historyData);
                  if (isValid) {
                    setActiveTab("exam");
                    setInnerTab("rightEye");
                  }
                }}
              >
                Next
              </Button>
            </Tab>
          </Tabs>
        </Tab>

        <Tab eventKey="exam" title="Eye Examination">
          <Tabs
            activeKey={innerTab}
            onSelect={handleInnerTabSelect}
            className="mb-3"
          >
            {/* Right Eye Card */}
            <Tab eventKey="rightEye" title="Right Eye">
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
                        <Form.Select
                          value={rightVisusCC}
                          onChange={onChangeRightVisusCC}
                        >
                          <option value="">Select Visus</option>
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
                        <Form.Select
                          value={rightPreviousValue}
                          onChange={onChangeRightPreviousValue}
                        >
                          <option value="">Select Visus</option>
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
                        <Form.Control
                          type="date"
                          value={rightSince}
                          onChange={onChangeRightSince}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-form pb-2 pt-2">
                    {" "}
                    Upload Images (Right Eye)
                  </div>

                  <MultiImageInput
                    className="multi-image-input__image"
                    images={Rightimages}
                    setImages={setRightImages}
                    theme={"light"}
                    max={8}
                    cropConfig={{ crop, ruleOfThirds: true }}
                  />
                  <Form.Text className="text-muted">
                    Please upload high-quality images. Blurry images may affect
                    diagnosis.
                  </Form.Text>
                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Image Capture Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={rightImageCaptureDate}
                          onChange={onChangeRightImageCaptureDate}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Label>Sphere</Form.Label>
                      <Form.Control
                        placeholder="(+/- 0.0 - 25.0)"
                        type="number"
                        step="0.25"
                        min="-25.0"
                        max="25.0"
                        value={rightSphere}
                        onChange={onChangeRightSphere}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Cylinder</Form.Label>
                      <Form.Control
                        placeholder="(+/-)"
                        type="number"
                        step="0.25"
                        value={rightCylinder}
                        onChange={onChangeRightCylinder}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Axis</Form.Label>
                      <Form.Control
                        placeholder="Axis"
                        type="number"
                        min="0"
                        max="180"
                        value={rightAxis}
                        onChange={onChangeRightAxis}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      <Form.Label>Intraocular Pressure (mmHg)</Form.Label>
                      <Form.Select
                        value={rightIntraocularPressure}
                        onChange={onChangeRightIntraocularPressure}
                      >
                        <option value="">Select</option>
                        {[...Array(91)].map((_, i) => (
                          <option key={i}>{i}</option>
                        ))}
                        <option>Not Measurable</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Label>Corneal Thickness</Form.Label>
                      <Form.Control
                        type="number"
                        value={rightCornealThickness}
                        onChange={onChangeRightCornealThickness}
                      />
                    </Col>
                    <Col>
                      <Form.Label>Anterior Chamber Angle</Form.Label>
                      <Form.Select
                        value={rightChamberAngle}
                        onChange={onChangeRightChamberAngle}
                      >
                        <option value="">Select an option</option>
                        <option value="Narrow">Narrow</option>
                        <option value="Within Normal Limits">
                          Within Normal Limits
                        </option>
                        <option value="wide">Wide</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <Form.Check
                    className="mt-2"
                    type="checkbox"
                    label="Amsler Test Abnormal"
                    checked={rightAmslerTestAbnormal}
                    onChange={onChangeRightAmslerTestAbnormal}
                  />
                  <Button
                    variant="primary"
                    className="mt-4"
                    onClick={() => {
                      const isValid = validateRightEyeSection(rightEyeData);
                      if (!isValid) return;
                      setInnerTab("leftEye");
                    }}
                  >
                    Next
                  </Button>
                </Card.Body>
              </Card>
            </Tab>
            {/* Left Eye Card */}
            <Tab eventKey="leftEye" title="Left Eye">
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
                        <Form.Select
                          value={leftVisusCC}
                          onChange={onChangeLeftVisusCC}
                        >
                          <option value="">Select Visus</option>
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
                        <Form.Select
                          value={leftPreviousValue}
                          onChange={onChangeLeftPreviousValue}
                        >
                          <option value="">Select Visus</option>
                          <option>2.0 (20/10)</option>
                          <option>1.6 (20/12)</option>
                          <option>1.26 (20/16)</option>
                          <option>1.0 (20/20)</option>
                          <option>0.8 (20/25)</option>
                          <option>0.63 (20/30)</option>
                          <option>0.5 (20/40)</option>
                          <option>0.4 (20/50)</option>
                          <option>0.32 (20/60)</option>
                          <option>0.25 (80)</option>
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
                        <Form.Control
                          type="date"
                          value={leftSince}
                          onChange={onChangeLeftSince}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-form pb-2 pt-2">
                    {" "}
                    Upload Images (Left Eye)
                  </div>

                  <MultiImageInput
                    images={Leftimages}
                    setImages={setLeftImages}
                    theme={"light"}
                    max={8}
                    cropConfig={{ crop, ruleOfThirds: true }}
                  />
                  <Form.Text className="text-muted">
                    Please upload high-quality images. Blurry images may affect
                    diagnosis.
                  </Form.Text>
                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Image Capture Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={leftImageCaptureDate}
                          onChange={onChangeLeftImageCaptureDate}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <Form.Label>Sphere</Form.Label>
                      <Form.Control
                        placeholder="(+/- 0.0 - 25.0)"
                        type="number"
                        step="0.25"
                        min="-25.0"
                        max="25.0"
                        value={leftSphere}
                        onChange={onChangeLeftSphere}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Cylinder</Form.Label>
                      <Form.Control
                        placeholder="(+/-)"
                        type="number"
                        step="0.25"
                        value={leftCylinder}
                        onChange={onChangeLeftCylinder}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Axis</Form.Label>
                      <Form.Control
                        placeholder="Axis"
                        type="number"
                        min="0"
                        max="180"
                        value={leftAxis}
                        onChange={onChangeLeftAxis}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      <Form.Label>Intraocular Pressure (mmHg)</Form.Label>
                      <Form.Select
                        value={leftIntraocularPressure}
                        onChange={onChangeLeftIntraocularPressure}
                      >
                        <option value="">Select</option>
                        {[...Array(91)].map((_, i) => (
                          <option key={i}>{i}</option>
                        ))}
                        <option>Not Measurable</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Label>Corneal Thickness</Form.Label>
                      <Form.Control
                        type="number"
                        value={leftCornealThickness}
                        onChange={onChangeLeftCornealThickness}
                      />
                    </Col>
                    <Col>
                      <Form.Label>Anterior Chamber Angle</Form.Label>
                      <Form.Select
                        value={leftChamberAngle}
                        onChange={onChangeLeftChamberAngle}
                      >
                        <option value="">Select an option</option>
                        <option value="Narrow">Narrow</option>
                        <option value="Within Normal Limits">
                          Within Normal Limits
                        </option>
                        <option value="wide">Wide</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <Form.Check
                    className="mt-2"
                    type="checkbox"
                    label="Amsler Test Abnormal"
                    checked={leftAmslerTestAbnormal}
                    onChange={onChangeLeftAmslerTestAbnormal}
                  />
                </Card.Body>
              </Card>
              <Button
                variant="primary"
                className="mt-2"
                onClick={HandelSendingData}
              >
                Save Data
              </Button>
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>
      {ispress ? (
        loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <h4> done </h4>
        )
      ) : null}
    </Container>
  );
};

export default ReportDetails;
