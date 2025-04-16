import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Image, Card, Button, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// بيانات فحص وهمية
const dummyData = [
  {
    id: 1,
    imageUrl: "https://via.placeholder.com/600x400?text=Eye+Image+1",
    date: "2025-04-10",
    age: 34,
    gender: "Male",
    position: "Right Eye - Top View",
    symptoms: "Redness, Blurry Vision",
    otherDiseases: "Diabetes",
  },
  {
    id: 2,
    imageUrl:
      "https://webeye.ophth.uiowa.edu/eyeforum/atlas/pages/normal-fundus-child/normal-child-fundus.jpg",
    date: "2025-04-11",
    age: 28,
    gender: "Female",
    position: "Left Eye - Side View",
    symptoms: "Dryness, Irritation",
    otherDiseases: "None",
  },
];

// الأمراض والتشخيص
const diseases = [
  { name: "Diabetic Retinopathy", probability: "75%" },
  { name: "Drusense", probability: "60%" },
  { name: "Increase Cup Disk", probability: "45%" },
];

const ExaminationDetails = () => {
  const { id } = useParams();
  const exam = dummyData[1]; // يمكنك تغييره لاحقاً حسب id
  const reportRef = useRef(); // مرجع الكارت كله

  // تنزيل التقرير كـ PDF
  const handleDownload = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("examination-report.pdf");
    });
  };

  if (!exam) {
    return (
      <Container className="my-5 text-center">
        <h4 className="text-danger">Examination not found.</h4>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Examination Details</h2>

      {/* الكارت بالكامل داخل ref */}
      <div ref={reportRef}>
        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex flex-column flex-md-row">
              {/* البيانات النصية */}
              <div className="me-md-4">
                <p>
                  <strong>Date:</strong> {exam.date}
                </p>
                <p>
                  <strong>Age:</strong> {exam.age}
                </p>
                <p>
                  <strong>Gender:</strong> {exam.gender}
                </p>
                <p>
                  <strong>Image Position:</strong> {exam.position}
                </p>
                <p>
                  <strong>Symptoms:</strong> {exam.symptoms}
                </p>
                <p>
                  <strong>Other Diseases:</strong> {exam.otherDiseases}
                </p>
              </div>

              {/* الصورة */}
              <div className="image-wrapper mb-3 mb-md-0 ms-auto">
                <Image
                  src={exam.imageUrl}
                  alt="Eye photo"
                  className="exam-image"
                  fluid
                />
              </div>
            </div>

            {/* جدول الأمراض */}
            <h4 className="mt-4">Diagnosis Summary</h4>
            <Table striped bordered hover className="mt-3 text-center">
              <thead>
                <tr>
                  <th>Disease</th>
                  <th>Probability (%)</th>
                </tr>
              </thead>
              <tbody>
                {diseases.map((d, index) => (
                  <tr key={index}>
                    <td>{d.name}</td>
                    <td>{d.probability}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="text-center mt-4">
              <Button className="welcome-button" href="/Examination">
                ⬅ Back to Another Examination
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* زر تحميل التقرير */}
      <div className="text-center mt-4">
        <Button variant="success" onClick={handleDownload}>
          ⬇ Download Report
        </Button>
      </div>
    </Container>
  );
};

export default ExaminationDetails;
