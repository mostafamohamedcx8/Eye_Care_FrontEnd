import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getSpecificDoctor } from "./../Redux/actions/Doctoraction";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import { getAllpatient, SendPatient } from "../Redux/actions/Patientaction";
import Select from "react-select";
import notify from "../Hook/useNotification";

const DoctorDetailes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setloading] = useState(true);
  const [ispress, setispress] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    dispatch(getSpecificDoctor(id));
  }, []);

  useEffect(() => {
    dispatch(getAllpatient(100000000));
  }, []);

  const patients = useSelector((state) => state.allpatient.getpatient);
  const res = useSelector((state) => state.allpatient.sendpatient);
  console.log(res);
  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
    if (!patients || !patients?.data) return;

    const data = patients?.data.find((p) => p._id === id);
    setPatientData(data);
  };

  const patientOptions =
    patients?.data?.map((patient) => ({
      value: patient._id,
      label: patient.name,
    })) || [];

  const doctorData = useSelector((state) => state.alldoctor.specificdoctor);
  console.log(doctorData);

  const doctor = doctorData?.data;

  const sendPatientToDoctor = async (event) => {
    event.preventDefault();
    if (!patientData?._id) {
      console.error("No patient selected.");
      return;
    }

    const dataToSend = {
      patientId: patientData._id,
      doctorId: id,
    };

    console.log("Sending patient data:", dataToSend);
    setloading(true);
    setispress(true);
    await dispatch(SendPatient(dataToSend));
    setloading(false);
  };

  useEffect(() => {
    if (loading === false) {
      if (res?.status === 200) {
        notify("Patient successfully sent to doctor", "success");
        setSelectedPatientId("");
        setPatientData(null);
      } else if (res?.status === 400) {
        notify("This patient is already assigned to this doctor", "error");
      } else notify("there is problem", "error");

      // Reset states after response
      setloading(true);
      setispress(false);
      setTimeout(() => {
        setispress(false);
      }, 1000);
    }
  }, [loading]);

  return (
    <>
      <Header />
      <NavBar />
      <Container className="my-4">
        <Card className="shadow-lg p-3">
          <Row>
            <Col md={4} className="text-center">
              <img
                src={doctor?.imageProfile}
                alt={`${doctor?.firstname} ${doctor?.lastname}`}
                className="img-fluid rounded-circle"
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
            </Col>

            <Col md={8}>
              <h3>
                {doctor?.firstname} {doctor?.lastname}
              </h3>
              <p>
                <strong>Email:</strong> {doctor?.email}
              </p>
              <p>
                <strong>Specialty:</strong> {doctor?.Specialty}
              </p>
              <p>
                <strong>Gender:</strong> {doctor?.gender}
              </p>
              <p>
                <strong>Date of Birth:</strong> {doctor?.dateOfBirth.day}{" "}
                {doctor?.dateOfBirth.month}, {doctor?.dateOfBirth.year}
              </p>
              <p>
                <strong>Address:</strong> {doctor?.fullAddress}, {doctor?.city},{" "}
                {doctor?.state}
              </p>
              <p>
                <strong>Role:</strong> {doctor?.role}
              </p>
            </Col>
            <Col md={6}>
              <Card className="shadow-lg p-3">
                <h5>Select Patient</h5>
                <Form>
                  <Form.Group>
                    <Form.Label>Choose Patient</Form.Label>
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
                          <strong>Name:</strong> {patientData.name}
                        </p>
                        <p>
                          <strong>Gender:</strong> {patientData.gender}
                        </p>
                        <p>
                          <strong>Date of Birth:</strong>{" "}
                          {new Date(patientData.dateOfBirth).toLocaleDateString(
                            "en-GB"
                          )}
                        </p>
                        <p>
                          <strong>Ethnicity:</strong> {patientData.ethnicity}
                        </p>
                        <p>
                          <strong>Patient ID:</strong> {patientData._id}
                        </p>
                        <Button
                          variant="primary"
                          onClick={(e) => sendPatientToDoctor(e)}
                        >
                          Send Patient
                        </Button>
                      </Card.Body>
                    </Card>
                  )}
                </Form>
              </Card>
            </Col>
          </Row>
        </Card>
        {ispress ? (
          loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <h4> done </h4>
          )
        ) : null}
      </Container>
      <Footer />
    </>
  );
};

export default DoctorDetailes;
