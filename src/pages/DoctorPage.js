import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import Barcode from "react-barcode";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import Paginationcomponent from "../component/pagination";
import { Doctorpage_Hook } from "./../Hook/Doctorpage_Hook";
import { useTranslation } from "react-i18next";
const DoctorCard = () => {
  const { t } = useTranslation();
  const [
    patient,
    keyword,
    loading,
    onChangeKeyword,
    doctors,
    pagecount,
    getpage,
    onChangesendPatient,
  ] = Doctorpage_Hook(t);

  return (
    <>
      <Header />
      <NavBar />

      <Container className="mb-5 mt-4">
        <h2 className="text-center mb-4 fw-bold button-color">
          {t("doctorpage.header.title")}
        </h2>
        {patient && (
          <Card className="mb-4">
            <Card.Body>
              <h5 className="text-center mb-4">
                {t("reportForm.patientInfo.title")}
              </h5>
              <div className="patient-data-container">
                <div className="patient-info-block">
                  <span className="patient-label">
                    {t("reportForm.patientInfo.labels.name")}
                  </span>
                  <span className="patient-data">
                    {patient?.data?.firstname || patient?.data?.lastname ? (
                      `${patient?.data?.firstname || ""} ${
                        patient?.data?.lastname || ""
                      }`
                    ) : (
                      <span style={{ color: "red" }}>---</span>
                    )}
                  </span>
                </div>
                <div className="patient-info-block">
                  <span className="patient-label">
                    {t("reportForm.patientInfo.labels.salutation")}
                  </span>
                  <span className="patient-data">
                    {patient?.data?.salutation ? (
                      patient.data.salutation
                    ) : (
                      <span style={{ color: "red" }}>---</span>
                    )}
                  </span>
                </div>
                <div className="patient-info-block">
                  <span className="patient-label">
                    {t("reportForm.patientInfo.labels.dateOfBirth")}
                  </span>
                  <span className="patient-data">
                    {patient?.data?.dateOfBirth ? (
                      new Date(patient.data.dateOfBirth).toLocaleDateString(
                        "de-DE"
                      )
                    ) : (
                      <span style={{ color: "red" }}>---</span>
                    )}
                  </span>
                </div>
                <div className="patient-info-block">
                  <span className="patient-label">
                    {t("reportForm.patientInfo.labels.ethnicity")}
                  </span>
                  <span className="patient-data">
                    {patient?.data?.ethnicity ? (
                      patient.data.ethnicity
                    ) : (
                      <span style={{ color: "red" }}>---</span>
                    )}
                  </span>
                </div>
                <div className="patient-info-block">
                  <span className="patient-label">
                    {t("reportForm.patientInfo.labels.patientId")}
                  </span>
                  <span
                    className="patient-data"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {patient?.data?.patientId ? (
                      <>
                        <div style={{ marginTop: "10px" }}>
                          <Barcode
                            value={patient.data.patientId.toString()}
                            height={50}
                            width={2}
                            fontSize={14}
                          />
                        </div>
                      </>
                    ) : (
                      <span style={{ color: "red" }}>---</span>
                    )}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={t("doctorpage.search.placeholder")}
            value={keyword}
            onChange={onChangeKeyword}
          />
        </InputGroup>
        {loading ? (
          <p className="text-center text-danger fw-bold">
            {t("doctorpage.doctorCard.loading")}
          </p>
        ) : doctors.length > 0 ? (
          <Table striped bordered hover responsive className="shadow-sm">
            <thead>
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">
                  {t("doctorpage.tableHeaders.name")}
                </th>
                <th className="py-2 px-3">
                  {t("doctorpage.tableHeaders.city")}
                </th>
                <th className="py-2 px-3">
                  {t("doctorpage.tableHeaders.state")}
                </th>
                <th className="py-2 px-3">
                  {t("doctorpage.tableHeaders.postalCode")}
                </th>
                <th className="py-2 px-3">
                  {t("doctorpage.tableHeaders.fullAddress")}
                </th>
                <th className="py-2 px-3">
                  {t("doctorpage.tableHeaders.specialty")}
                </th>
                <th className="py-2 px-3">
                  {t("doctorpage.tableHeaders.tools")}
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => (
                <tr key={doctor._id}>
                  <td className="py-2 px-3">
                    <span className="px-2 py-1 rounded">{index + 1}</span>
                  </td>
                  <td className="py-2 px-3">
                    {doctor.firstname} {doctor.lastname}
                  </td>
                  <td className="py-2 px-3">{doctor.city || "N/A"}</td>
                  <td className="py-2 px-3">{doctor.state || "N/A"}</td>
                  <td className="py-2 px-3">{doctor.postalCode || "N/A"}</td>
                  <td className="py-2 px-3">{doctor.fullAddress || "N/A"}</td>
                  <td className="py-2 px-3">{doctor.Specialty || "N/A"}</td>
                  <td className="py-2 px-3">
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={(e) => onChangesendPatient(e, doctor._id)}
                      >
                        <i className="bi bi-person-plus"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-danger fw-bold">
            {t("doctorpage.doctorCard.noDoctorsFound")}
          </p>
        )}
      </Container>
      {pagecount > 1 ? (
        <Paginationcomponent pagecount={pagecount} onpress={getpage} />
      ) : null}

      <Footer />
    </>
  );
};

export default DoctorCard;
