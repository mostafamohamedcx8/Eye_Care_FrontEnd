import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  getPatientWithReport,
  deleteMyReport,
} from "./../Redux/actions/Reportaction";
import { useParams, useNavigate } from "react-router-dom";
import notify from "../Hook/useNotification";
import { useTranslation } from "react-i18next";
const ReportsList = () => {
  const { t } = useTranslation();
  const [isNavigating, setIsNavigating] = useState(false);
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getPatientWithReport(id));
  }, []);

  useEffect(() => {
    if (loading === false) {
      if (res === "") {
        notify(t("reports.success_message"), "success");
        setTimeout(() => {
          window.location.reload(false);
        }, 1000);
      } else {
        notify(t("reports.error_message"), "error");
      }
    }
  }, [loading]);

  const handleClose = () => {
    setShow(false);
    setDeleteId(null);
  };
  const handleShow = (reportid) => {
    setDeleteId(reportid);
    setShow(true);
  };

  const ReportData = useSelector(
    (state) => state.allreport.getpatientwithreport
  );
  const res = useSelector((state) => state.allreport.deletemyreport);

  const Report = ReportData?.data || [];
  console.log(Report?.reports);

  const handleDeleteConfirmed = async () => {
    setLoading(true);
    await dispatch(deleteMyReport(deleteId));
    setLoading(false);
    handleClose();
  };

  const handleViewDetails = (reportId) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(`/ExaminationReport/${reportId}`);
      setIsNavigating(false);
    }, 1000);
  };
  if (!ReportData?.data) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>{t("reports.loading")}</p>
      </div>
    );
  }

  // بيانات وهمية للتجريب
  return (
    <>
      <Header />
      <NavBar />
      <Container className="my-4">
        <h2 className="text-center mb-4 fw-bold button-color">
          {t("reports.title")}
        </h2>

        {Report?.reports?.length === 0 ? (
          <p className="text-center text-danger fw-bold">
            {t("reports.no_reports")}
          </p>
        ) : (
          <Table striped bordered hover responsive className="shadow-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>{t("reports.tableHeaders.report_date")}</th>
                <th>{t("reports.tableHeaders.right_eye_visus")}</th>
                <th>{t("reports.tableHeaders.left_eye_visus")}</th>
                <th>{t("reports.tableHeaders.image_quality")}</th>
                <th>{t("reports.tableHeaders.tools")}</th>
              </tr>
            </thead>
            <tbody>
              {Report?.reports?.map((report, index) => {
                const rightEyePredictions = report?.modelResults?.rightEye
                  ? JSON.parse(report.modelResults.rightEye)
                  : null;
                const leftEyePredictions = report?.modelResults?.leftEye
                  ? JSON.parse(report.modelResults.leftEye)
                  : null;

                const predictionsToShow =
                  rightEyePredictions || leftEyePredictions;
                const predictionLabel = rightEyePredictions
                  ? "Right Eye"
                  : leftEyePredictions
                  ? "Left Eye"
                  : null;

                return (
                  <tr key={report._id}>
                    <td>{index + 1}</td>
                    <td className="py-2 px-3">
                      {new Date(report?.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      {report?.eyeExamination?.rightEye?.visusCC || "---"}
                    </td>
                    <td className="py-2 px-3">
                      {report?.eyeExamination?.leftEye?.visusCC || "----"}
                    </td>
                    <td className="py-2 px-3">
                      {predictionsToShow ? (
                        <>
                          {predictionsToShow.image_quality && (
                            <div className="text-warning">
                              {predictionsToShow.image_quality.status} (
                              {predictionsToShow.image_quality.confidence ??
                                "----"}
                              %)
                            </div>
                          )}
                          {Object.entries(predictionsToShow)
                            .filter(
                              ([key, value]) =>
                                key !== "image_quality" &&
                                key !== "eye_side" &&
                                value.status === "Detected"
                            )
                            .map(([diseaseName, details]) => (
                              <div key={diseaseName}>
                                {t("reports.disease_detected", {
                                  disease: diseaseName,
                                  confidence: details.confidence ?? "N/A",
                                })}
                              </div>
                            ))}
                          {Object.entries(predictionsToShow).filter(
                            ([key, value]) =>
                              key !== "image_quality" &&
                              key !== "eye_side" &&
                              value.status === "Detected"
                          ).length === 0 && (
                            <div>{t("reports.no_diseases")}</div>
                          )}
                        </>
                      ) : (
                        <div>{t("reports.no_prediction")}</div>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <div className="d-flex align-items-center">
                        {userFromStorage?.role !== "doctor" && (
                          <button
                            className="btn btn-sm btn-outline-danger me-2"
                            onClick={() => handleShow(report?._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleViewDetails(report._id)}
                          disabled={isNavigating}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

        {isNavigating ? <Spinner animation="border" variant="primary" /> : null}
      </Container>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("reports.modal_title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("reports.modal_body")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t("reports.modal_cancel")}
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            {t("reports.modal_delete")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </>
  );
};

export default ReportsList;
