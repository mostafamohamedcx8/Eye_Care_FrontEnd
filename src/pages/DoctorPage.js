import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import Paginationcomponent from "../component/pagination";
import { Doctorpage_Hook } from "./../Hook/Doctorpage_Hook";
const DoctorCard = () => {
  const [
    patient,
    keyword,
    loading,
    onChangeKeyword,
    doctors,
    pagecount,
    getpage,
    onChangesendPatient,
  ] = Doctorpage_Hook();

  return (
    <>
      <Header />
      <NavBar />

      <Container className="mb-5 mt-4">
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
                  <span className="patient-data">
                    {patient?.data?.ethnicity}
                  </span>
                </div>

                <div className="patient-info-block">
                  <span className="patient-label">Patient ID</span>
                  <span className="patient-data">{patient?.data?._id}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search by name,State,City,Postal Code Or Specialty ..."
            value={keyword}
            onChange={onChangeKeyword}
          />
        </InputGroup>
        <Row>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <Col key={index} md={3} className="mb-4">
                <Card className="shadow rounded-3 h-100 d-flex flex-column">
                  <Card.Img
                    variant="top"
                    src={doctor.imageProfile}
                    alt={`${doctor.firstname} ${doctor.lastname}`}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>
                      {doctor.firstname} {doctor.lastname}
                    </Card.Title>
                    <Card.Text className="flex-grow-1">
                      <strong>City:</strong> {doctor.city} <br />
                      <strong>State:</strong> {doctor.state} <br />
                      <strong>Postal Code:</strong> {doctor.postalCode} <br />
                      <strong>Full Address:</strong> {doctor.fullAddress} <br />
                      <strong>Specialty:</strong> {doctor.Specialty}
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="w-100 mt-auto"
                      onClick={(e) => onChangesendPatient(e, doctor._id)}
                    >
                      Send Patient
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No doctors found.</p>
          )}
        </Row>
      </Container>
      {pagecount > 1 ? (
        <Paginationcomponent pagecount={pagecount} onpress={getpage} />
      ) : null}

      <Footer />
    </>
  );
};

export default DoctorCard;
