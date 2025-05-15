import React, { useState, useEffect } from "react";
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
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getAllpatient } from "../Redux/actions/Patientaction";
import notify from "../Hook/useNotification";
import { CreateReport } from "../Redux/actions/Reportaction";
import { useNavigate } from "react-router-dom";

import {
  validateEyeExamination,
  validateEyeHistory,
  validateMedicalHistory,
  validateImageFiles,
} from "../Validations/reportValidation";

const ReportDetails = () => {
  const Navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patient");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [innerTab, setInnerTab] = useState("medical");
  const [Rightimages, setRightImages] = useState([]);
  const [Leftimages, setLeftImages] = useState([]);

  const [rightVisusCC, setRightVisusCC] = useState("");
  const [rightPreviousValue, setRightPreviousValue] = useState("");
  const [rightSince, setRightSince] = useState("");
  const [rightSphere, setRightSphere] = useState("");
  const [rightCylinder, setRightCylinder] = useState("");
  const [rightAxis, setRightAxis] = useState("");
  const [rightIntraocularPressure, setRightIntraocularPressure] = useState("");
  const [rightCornealThickness, setRightCornealThickness] = useState("");
  const [rightChamberAngle, setRightChamberAngle] = useState("");
  const [rightAmslerTestAbnormal, setRightAmslerTestAbnormal] = useState(false);

  // Left Eye States
  const [leftVisusCC, setLeftVisusCC] = useState("");
  const [leftPreviousValue, setLeftPreviousValue] = useState("");
  const [leftSince, setLeftSince] = useState("");
  const [leftSphere, setLeftSphere] = useState("");
  const [leftCylinder, setLeftCylinder] = useState("");
  const [leftAxis, setLeftAxis] = useState("");
  const [leftIntraocularPressure, setLeftIntraocularPressure] = useState("");
  const [leftCornealThickness, setLeftCornealThickness] = useState("");
  const [leftChamberAngle, setLeftChamberAngle] = useState("");
  const [leftAmslerTestAbnormal, setLeftAmslerTestAbnormal] = useState(false);
  const [historyData, setHistoryData] = useState({
    medical: [
      // هيتم ملء الداتا هنا بناءً على التشيك بوكس
    ],
    eye: [],
  });
  const [newMedicalDisease, setNewMedicalDisease] = useState("");
  const [newEyeDisease, setNewEyeDisease] = useState("");
  const [loading, setloading] = useState(true);
  const [ispress, setispress] = useState(false);
  const Report = useSelector((state) => state.allreport.Report);

  const defaultDiseases = [
    "Diabetes M.",
    "Hypertension",
    "Rheumatic diseases",
    "Thyroid",
    "Tumours",
    "Genetic",
  ];

  // دمج الأمراض الأصلية مع اللي اتضافت بواسطة المستخدم
  const allMedicalDiseases = [
    ...defaultDiseases,
    ...historyData.medical
      .map((d) => d.name)
      .filter((name) => !defaultDiseases.includes(name)),
  ];
  const [eyeDiseases, setEyeDiseases] = useState([
    "Cataract",
    "Glaucoma",
    "Age-related macular degeneration",
  ]);

  const crop = {
    unit: "%",
    aspect: 4 / 3,
    width: "100",
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllpatient(100000000));
  }, []);

  const patients = useSelector((state) => state.allpatient.getpatient);

  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
    if (!patients || !patients.data) return;

    const data = patients.data.find((p) => p._id === id);
    setPatientData(data);
  };

  console.log(selectedPatientId);

  const patientOptions =
    patients?.data?.map((patient) => ({
      value: patient._id,
      label: patient.name,
    })) || [];

  const updateMedicalData = (diseaseName, field, value) => {
    setHistoryData((prev) => {
      const updated = prev.medical.filter((item) => item.name !== diseaseName);
      const existing = prev.medical.find(
        (item) => item.name === diseaseName
      ) || {
        name: diseaseName,
        hasCondition: false,
        appliesTo: null,
      };

      const newItem = {
        ...existing,
        [field]: value,
      };

      return {
        ...prev,
        medical: [...updated, newItem],
      };
    });
  };

  const updateEyeData = (disease, field, value) => {
    setHistoryData((prev) => {
      const existingIndex = prev.eye.findIndex((item) => item.name === disease);
      const updatedEye = [...prev.eye];

      if (existingIndex >= 0) {
        updatedEye[existingIndex] = {
          ...updatedEye[existingIndex],
          [field]: value,
        };
      } else {
        updatedEye.push({
          name: disease,
          hasCondition: field === "hasCondition" ? value : false,
          appliesTo: field === "appliesTo" ? value : null,
        });
      }

      return {
        ...prev,
        eye: updatedEye,
      };
    });
  };

  const handleAddEyeDisease = () => {
    const trimmed = newEyeDisease.trim();
    if (trimmed && !eyeDiseases.includes(trimmed)) {
      setEyeDiseases((prev) => [...prev, trimmed]);

      // أضف إلى historyData.eye
      setHistoryData((prev) => {
        const exists = prev.eye.find(
          (item) => item.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (!exists) {
          return {
            ...prev,
            eye: [
              ...prev.eye,
              {
                name: trimmed,
                hasCondition: false,
                appliesTo: null,
              },
            ],
          };
        }
        return prev;
      });

      setNewEyeDisease("");
    }
  };

  const handleAddMedicalDisease = () => {
    const trimmed = newMedicalDisease.trim();
    if (!trimmed) return;

    const exists = historyData.medical.find(
      (d) => d.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists) {
      setHistoryData((prev) => ({
        ...prev,
        medical: [
          ...prev.medical,
          {
            name: trimmed,
            hasCondition: false,
            appliesTo: null,
          },
        ],
      }));
    }

    setNewMedicalDisease(""); // تفريغ الحقل بعد الإضافة
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const resetFormFields = () => {
    setActiveTab("patient");
    setSelectedPatientId("");
    setInnerTab("medical");
    setRightImages([]);
    setLeftImages([]);

    setRightVisusCC("");
    setRightPreviousValue("");
    setRightSince("");
    setRightSphere("");
    setRightCylinder("");
    setRightAxis("");
    setRightIntraocularPressure("");
    setRightCornealThickness("");
    setRightChamberAngle("");
    setRightAmslerTestAbnormal(false);

    setLeftVisusCC("");
    setLeftPreviousValue("");
    setLeftSince("");
    setLeftSphere("");
    setLeftCylinder("");
    setLeftAxis("");
    setLeftIntraocularPressure("");
    setLeftCornealThickness("");
    setLeftChamberAngle("");
    setLeftAmslerTestAbnormal(false);
    setPatientData(null);

    setHistoryData({
      medical: [],
      eye: [],
    });
  };

  const HandelSendingData = async (e) => {
    e.preventDefault();
    const ItemRightImages = Array.from(
      Array(Object.keys(Rightimages).length).keys()
    ).map((item, index) =>
      dataURLtoFile(Rightimages[index], Math.random() + ".png")
    );

    const ItemLeftImages = Array.from(
      Array(Object.keys(Leftimages).length).keys()
    ).map((item, index) =>
      dataURLtoFile(Leftimages[index], Math.random() + ".png")
    );

    // التحقق من أن كل الملفات صور
    if (!validateImageFiles(ItemRightImages)) {
      notify("Some right eye images are not valid image files.", "error");
      return;
    }
    if (!validateImageFiles(ItemLeftImages)) {
      notify("Some left eye images are not valid image files.", "error");
      return;
    }
    // تجهيز البيانات للـ validation
    const history = historyData;
    const eyeExamination = {
      rightEye: {
        visusCC: rightVisusCC,
        previousValue: rightPreviousValue,
        since: rightSince,
        sphere: rightSphere,
        cylinder: rightCylinder,
        intraocularPressure: rightIntraocularPressure,
        cornealThickness: rightCornealThickness,
        chamberAngle: rightChamberAngle,
      },
      leftEye: {
        visusCC: leftVisusCC,
        previousValue: leftPreviousValue,
        since: leftSince,
        sphere: leftSphere,
        cylinder: leftCylinder,
        intraocularPressure: leftIntraocularPressure,
        cornealThickness: leftCornealThickness,
        chamberAngle: leftChamberAngle,
      },
    };

    // التحقق من صحة البيانات
    const isValid = validateEyeExamination({
      history,
      eyeExamination,
    });
    if (!isValid) return;

    const formData = new FormData();

    formData.append("patient", selectedPatientId);
    formData.append("optician", "68176bdabcbaa13a575f28ea");
    formData.append("eyeExamination.rightEye.visusCC", rightVisusCC);
    formData.append(
      "eyeExamination.rightEye.previousValue",
      rightPreviousValue
    );
    formData.append("eyeExamination.rightEye.since", rightSince);
    formData.append("eyeExamination.rightEye.sphere", rightSphere);
    formData.append("eyeExamination.rightEye.cylinder", rightCylinder);
    formData.append("eyeExamination.rightEye.axis", rightAxis);
    formData.append(
      "eyeExamination.rightEye.intraocularPressure",
      rightIntraocularPressure
    );
    formData.append(
      "eyeExamination.rightEye.cornealThickness",
      rightCornealThickness
    );
    formData.append("eyeExamination.rightEye.chamberAngle", rightChamberAngle);
    formData.append(
      "eyeExamination.rightEye.amslerTestAbnormal",
      rightAmslerTestAbnormal
    );

    formData.append("eyeExamination.leftEye.visusCC", leftVisusCC);
    formData.append("eyeExamination.leftEye.previousValue", leftPreviousValue);
    formData.append("eyeExamination.leftEye.since", leftSince);
    formData.append("eyeExamination.leftEye.sphere", leftSphere);
    formData.append("eyeExamination.leftEye.cylinder", leftCylinder);
    formData.append("eyeExamination.leftEye.axis", leftAxis);
    formData.append(
      "eyeExamination.leftEye.intraocularPressure",
      leftIntraocularPressure
    );
    formData.append(
      "eyeExamination.leftEye.cornealThickness",
      leftCornealThickness
    );
    formData.append("eyeExamination.leftEye.chamberAngle", leftChamberAngle);
    formData.append(
      "eyeExamination.leftEye.amslerTestAbnormal",
      leftAmslerTestAbnormal
    );
    formData.append("modelResults.disease1.name", "Diabetic Retinopathy");
    formData.append("modelResults.disease1.percentage", "20");
    formData.append("modelResults.disease2.name", "Diabetic Retinopathy");
    formData.append("modelResults.disease2.percentage", "20");
    formData.append("modelResults.disease3.name", "Diabetic Retinopathy");
    formData.append("modelResults.disease3.percentage", "20");
    // Append medical history

    historyData.medical.forEach((condition, index) => {
      formData.append(`history[medical][${index}][name]`, condition.name);
      formData.append(
        `history[medical][${index}][hasCondition]`,
        condition.hasCondition
      );
      formData.append(
        `history[medical][${index}][appliesTo]`,
        condition.appliesTo
      );
    });

    // Append eye history
    historyData.eye.forEach((condition, index) => {
      formData.append(`history[eye][${index}][name]`, condition.name);
      formData.append(
        `history[eye][${index}][hasCondition]`,
        condition.hasCondition
      );
      formData.append(`history[eye][${index}][appliesTo]`, condition.appliesTo);
    });

    ItemRightImages.map((item) => formData.append("rightEyeImages", item));
    ItemLeftImages.map((item) => formData.append("leftEyeImages", item));

    // طباعة البيانات لتفقدها
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    setloading(true);
    setispress(true);
    const res = await dispatch(CreateReport(formData));

    console.log("Response:", res);
    setloading(false);
  };

  useEffect(() => {
    if (loading === false && Report) {
      setispress(false);
      if (Report?.status === 201) {
        Navigate(`/ExaminationReport/${Report?.data?.data?._id}`);
        // resetFormFields();
        notify("done", "success");
      } else {
        notify(Report?.data?.message || "there is problem", "error");
      }

      // Reset loading بعد شوية علشان الزر يرجع لحالته الطبيعية
      setTimeout(() => {
        setloading(true);
      }, 1500);
    }
  }, [loading, Report]);
  return (
    <Container className="mt-5 mb-5">
      <h2 className="text-center mb-4 fw-bold button-color">
        Create Report for Patient
      </h2>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          if (k !== "patient" && !patientData) {
            notify("Please select a patient first!", "error");
            return;
          }
          setActiveTab(k);
        }}
        className="mb-3"
      >
        <Tab eventKey="patient" title="Patient Info">
          <Form>
            <Form.Group>
              <Form.Label>Select Patient</Form.Label>
              <Select
                options={patientOptions}
                value={
                  patientOptions.find(
                    (option) => option.value === selectedPatientId
                  ) || null
                }
                onChange={(selectedOption) =>
                  handleSelectPatient(selectedOption?.value)
                }
                placeholder="Search patient..."
                isSearchable
              />
            </Form.Group>

            {patientData && (
              <Card className="mt-3">
                <Card.Body>
                  <h5>Patient Information</h5>
                  <p>
                    <strong>Name:</strong>{" "}
                    <span className="patient-data">{patientData.name}</span>
                  </p>
                  <p>
                    <strong>Gender:</strong>{" "}
                    <span className="patient-data">{patientData.gender}</span>
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    <span className="patient-data">
                      {new Date(patientData.dateOfBirth).toLocaleDateString(
                        "en-GB"
                      )}
                    </span>
                  </p>
                  <p>
                    <strong>Ethnicity:</strong>{" "}
                    <span className="patient-data">
                      {patientData.ethnicity}
                    </span>
                  </p>
                  <p>
                    <strong>Patient ID:</strong>{" "}
                    <span className="patient-data">{patientData._id}</span>
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (!patientData) {
                        notify("Please select a patient first!", "error");
                        return;
                      }
                      setActiveTab("history");
                    }}
                  >
                    Next
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Form>
        </Tab>
        <Tab eventKey="history" title="History">
          <Tabs
            activeKey={innerTab}
            onSelect={(k) => setInnerTab(k)}
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
                      onChange={(e) => setNewMedicalDisease(e.target.value)}
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
                      onChange={(e) => setNewEyeDisease(e.target.value)}
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
                  }
                }}
              >
                Next
              </Button>
            </Tab>
          </Tabs>
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
                        Visus (CC) <span className="text-muted">(Decimal)</span>
                      </Form.Label>
                      <Form.Select
                        value={rightVisusCC}
                        onChange={(e) => setRightVisusCC(e.target.value)}
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
                        onChange={(e) => setRightPreviousValue(e.target.value)}
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
                        onChange={(e) => setRightSince(e.target.value)}
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
                    <Form.Label>Sphere</Form.Label>
                    <Form.Control
                      placeholder="(+/- 0.0 - 25.0)"
                      type="number"
                      step="0.25"
                      min="-25.0"
                      max="25.0"
                      value={rightSphere}
                      onChange={(e) => setRightSphere(e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Cylinder</Form.Label>
                    <Form.Control
                      placeholder="(+/-)"
                      type="number"
                      step="0.25"
                      value={rightCylinder}
                      onChange={(e) => setRightCylinder(e.target.value)}
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
                      onChange={(e) => setRightAxis(e.target.value)}
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <Form.Label>Intraocular Pressure (mmHg)</Form.Label>
                    <Form.Select
                      value={rightIntraocularPressure}
                      onChange={(e) =>
                        setRightIntraocularPressure(e.target.value)
                      }
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
                      value={rightChamberAngle}
                      onChange={(e) => setRightChamberAngle(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Chamber Angle</Form.Label>
                    <Form.Control
                      type="number"
                      value={rightCornealThickness}
                      onChange={(e) => setRightCornealThickness(e.target.value)}
                    />
                  </Col>
                </Row>

                <Form.Check
                  className="mt-2"
                  type="checkbox"
                  label="Amsler Test Abnormal"
                  checked={rightAmslerTestAbnormal}
                  onChange={(e) => setRightAmslerTestAbnormal(e.target.checked)}
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
                        Visus (CC) <span className="text-muted">(Decimal)</span>
                      </Form.Label>
                      <Form.Select
                        value={leftVisusCC}
                        onChange={(e) => setLeftVisusCC(e.target.value)}
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
                        onChange={(e) => setLeftPreviousValue(e.target.value)}
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
                        onChange={(e) => setLeftSince(e.target.value)}
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
                    <Form.Label>Sphere</Form.Label>
                    <Form.Control
                      placeholder="(+/- 0.0 - 25.0)"
                      type="number"
                      step="0.25"
                      min="-25.0"
                      max="25.0"
                      value={leftSphere}
                      onChange={(e) => setLeftSphere(e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Cylinder</Form.Label>
                    <Form.Control
                      placeholder="(+/-)"
                      type="number"
                      step="0.25"
                      value={leftCylinder}
                      onChange={(e) => setLeftCylinder(e.target.value)}
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
                      onChange={(e) => setLeftAxis(e.target.value)}
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <Form.Label>Intraocular Pressure (mmHg)</Form.Label>
                    <Form.Select
                      value={leftIntraocularPressure}
                      onChange={(e) =>
                        setLeftIntraocularPressure(e.target.value)
                      }
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
                      value={leftChamberAngle}
                      onChange={(e) => setLeftChamberAngle(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Chamber Angle</Form.Label>
                    <Form.Control
                      type="number"
                      value={leftCornealThickness}
                      onChange={(e) => setLeftCornealThickness(e.target.value)}
                    />
                  </Col>
                </Row>

                <Form.Check
                  className="mt-2"
                  type="checkbox"
                  label="Amsler Test Abnormal"
                  checked={leftAmslerTestAbnormal}
                  onChange={(e) => setLeftAmslerTestAbnormal(e.target.checked)}
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
          </Form>
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
