import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Modal,
  Button,
} from "react-bootstrap";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import Paginationcomponent from "../component/pagination";
import { Allpatient_Hook } from "../Hook/Allpatient_Hook";
import { useNavigate } from "react-router-dom";

const PatientTableUI = () => {
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
  ] = Allpatient_Hook();

  return (
    <>
      <Header />
      <NavBar />
      <Container className="mt-5">
        <h2 className="text-center mb-4 fw-bold button-color">
          Active Patients
        </h2>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              placeholder="Search by name..."
              value={keyword}
              onChange={onChangeKeyword}
            />
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>AI Report Count</th>
              <th>Feedback Count</th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {Loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
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
                    {patient.salutation}.{patient.firstname} {patient.lastname}
                  </td>
                  <td>
                    {new Date(patient.dateOfBirth).toLocaleDateString("de-DE")}
                  </td>
                  <td>{patient.report?.length || 0}</td>
                  <td>
                    {(() => {
                      const feedbacks =
                        patient.report?.flatMap(
                          (r) => r.doctorFeedbacks || []
                        ) || [];
                      const readCount = feedbacks.filter(
                        (f) => f.readed === true
                      ).length;
                      const unreadCount = feedbacks.filter(
                        (f) => f.readed !== true
                      ).length;

                      return (
                        <div className="d-flex align-items-center gap-2">
                          <span title="Seen Feedbacks">
                            <i className="bi bi-eye-fill text-success"></i>{" "}
                            {readCount}
                          </span>
                          <span title="Unseen Feedbacks">
                            <i className="bi bi-eye-slash-fill text-secondary"></i>{" "}
                            {unreadCount}
                          </span>
                        </div>
                      );
                    })()}
                  </td>
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
                      className="btn btn-sm btn-outline-secondary"
                      onClick={(e) => handleToggleArchive(patient._id, e)}
                      disabled={archiveLoading[patient._id]}
                    >
                      <i className="bi bi-archive"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No patients found.
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
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this patient?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default PatientTableUI;
