import React from "react";
import { ListGroup, Button, Container } from "react-bootstrap";

const patientsData = [
  {
    name: "Ahmed Hassan",
    gender: "Male",
    ethnicity: "Arab",
    examDate: "18/4/2025",
    birthDate: "1990-05-14",
    ID: "4534352253",
  },
  {
    name: "Fatma Ali",
    gender: "Female",
    ethnicity: "Arab",
    examDate: "19/4/2025",
    birthDate: "1988-11-22",
    ID: "4534344553",
  },
  {
    name: "Omar Youssef",
    gender: "Male",
    ethnicity: "Arab",
    examDate: "17/4/2025",
    birthDate: "1992-03-09",
    ID: "4534125456",
  },
];

const PatientList = () => {
  return (
    <Container>
      <ListGroup>
        {patientsData.map((patient, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-start"
          >
            <div>
              <div>
                <strong>{patient.name}</strong>
              </div>
              <div>
                <small>
                  Gender: {patient.gender} | Ethnicity: {patient.ethnicity}
                </small>
              </div>
              <div>
                <small>
                  DOB: {patient.birthDate} | ExamDate: {patient.examDate}
                </small>
              </div>
              <div>
                <small>patient ID: {patient.ID}</small>
              </div>
            </div>
            <Button size="sm" variant="primary">
              View Report
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default PatientList;
