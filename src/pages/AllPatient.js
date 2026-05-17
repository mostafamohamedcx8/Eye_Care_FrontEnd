import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Barcode from "react-barcode";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import Paginationcomponent from "../component/pagination";
import { Allpatient_Hook } from "../Hook/Allpatient_Hook";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PatientTableUI = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [
    keyword,
    Loading,
    AllPatient,
    userFromStorage,
    handleShow,
    handleView,
    handleToggleArchive,
    archiveLoading,
    pagecount,
    getpage,
    show,
    handleClose,
    handleDeleteConfirmed,
    onChangeKeyword,
  ] = Allpatient_Hook(t);

  return (
    <>
      <Header />
      <NavBar />
      <Container className="mt-5">
        <h2 className="text-center mb-4 fw-bold button-color">
          {t("patientTable.title")}
        </h2>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              placeholder={t("patientTable.searchPlaceholder")}
              value={keyword}
              onChange={onChangeKeyword}
            />
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>{t("patientTable.tableHeaders.number")}</th>
              <th>{t("patientTable.tableHeaders.name")}</th>
              <th>{t("patientTable.tableHeaders.dateOfBirth")}</th>
              <th>{t("patientTable.tableHeaders.aiReportCount")}</th>
              <th>{t("patientTable.tableHeaders.tools")}</th>
            </tr>
          </thead>
          <tbody>
            {Loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  {t("patientTable.loading")}
                </td>
              </tr>
            ) : AllPatient.length > 0 ? (
              AllPatient.map((patient, index) => (
                <tr key={index}>
                  <td>
                    {(() => {
                      const lastReport =
                        patient.report?.[patient.report.length - 1];
                      const modelResults = lastReport?.modelResults;
                      let riskColor = "";

                      if (modelResults?.leftEye || modelResults?.rightEye) {
                        const left = modelResults.leftEye
                          ? JSON.parse(modelResults.leftEye)
                          : null;
                        const right = modelResults.rightEye
                          ? JSON.parse(modelResults.rightEye)
                          : null;

                        const confidences = [];

                        const extractConfidences = (eyeData) => {
                          if (!eyeData) return;
                          for (const key in eyeData) {
                            const conf = eyeData[key]?.confidence;
                            if (conf !== null && typeof conf === "number") {
                              confidences.push(conf);
                            }
                          }
                        };

                        extractConfidences(left);
                        extractConfidences(right);

                        const maxConfidence = Math.max(...confidences, 0);

                        if (maxConfidence > 80) {
                          riskColor = "bg-danger text-white";
                        } else if (maxConfidence >= 60) {
                          riskColor = "bg-warning text-dark";
                        } else {
                          riskColor = "bg-success text-white";
                        }
                      }

                      return (
                        <span className={`px-2 py-1 rounded ${riskColor}`}>
                          {index + 1}
                        </span>
                      );
                    })()}
                  </td>
                  <td>
                    {patient.salutation ||
                    patient.firstName ||
                    patient.lastName ? (
                      <>
                        {patient.salutation ? (
                          patient.salutation
                        ) : (
                          <span style={{ color: "red" }}>---</span>
                        )}
                        .
                        {patient.firstName ? (
                          patient.firstName
                        ) : (
                          <span style={{ color: "red" }}>---</span>
                        )}{" "}
                        {patient.lastName ? (
                          patient.lastName
                        ) : (
                          <span style={{ color: "red" }}>---</span>
                        )}
                      </>
                    ) : (
                      <span style={{ color: "red" }}>---</span>
                    )}
                  </td>

                  <td>
                    {patient.dateOfBirth ? (
                      new Date(patient.dateOfBirth).toLocaleDateString("de-DE")
                    ) : (
                      <span style={{ color: "red" }}>---</span>
                    )}
                  </td>
                  <td>{patient.reportsCount || 0}</td>
                  <td>
                    {userFromStorage?.role !== "doctor" && (
                      <button
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => handleShow(patient._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleView(patient._id)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success me-2 "
                      onClick={() => navigate(`/Examination/${patient._id}`)}
                    >
                      <i className="bi bi-journal-plus"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2 "
                      onClick={(e) => handleToggleArchive(patient._id, e)}
                      disabled={archiveLoading[patient._id]}
                    >
                      <i className="bi bi-archive"></i>
                    </button>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-barcode-${patient._id}`}>
                          <Barcode
                            value={patient.patientId?.toString() || "---"}
                            height={40}
                            width={2}
                            fontSize={12}
                          />
                        </Tooltip>
                      }
                    >
                      <button className="btn btn-sm btn-outline-dark">
                        <i className="bi bi-upc"></i>
                      </button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  {t("patientTable.noPatients")}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {pagecount > 1 && (
          <Paginationcomponent pagecount={pagecount} onpress={getpage} />
        )}
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{t("patientTable.modal.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("patientTable.modal.body")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("patientTable.modal.cancel")}
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            {t("patientTable.modal.delete")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default PatientTableUI;
