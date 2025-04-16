import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAllEXAMINATION } from "../Redux/actions/Examinationaction";
import { useEffect } from "react";

const ExaminationHistory = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEXAMINATION());
  }, []);

  const Exam = useSelector((state) => state.allExamination.examination);
  const loading = useSelector((state) => state.allExamination.loading);

  console.log(Exam.data);
  console.log(loading);

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Your Examination History</h2>

      <Row>
        {Exam.data
          ? Exam.data.map((item, index) => {
              return (
                <Col md={6} lg={4} className="mb-4" key={index}>
                  <Card>
                    <Card.Img
                      src={item.image}
                      variant="top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>Examination Number: {index + 1}</Card.Title>
                      <Card.Text>
                        <strong>Date:</strong>{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                        <br />
                        <strong>Symptoms:</strong> {item.symptoms.join(", ")}
                      </Card.Text>
                      <Button
                        href="/Details"
                        variant="primary"
                        className="w-100"
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          : null}
      </Row>
    </Container>
  );
};

export default ExaminationHistory;
