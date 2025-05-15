import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";

const ExaminationHistory = () => {
  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Your Examination History</h2>

      <Row>
        return (
        <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Img
              variant="top"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title>Examination Number</Card.Title>
              <Card.Text>
                <br />
              </Card.Text>
              <Button href="/Details" variant="primary" className="w-100">
                View Details
              </Button>
            </Card.Body>
          </Card>
        </Col>
        );
      </Row>
    </Container>
  );
};

export default ExaminationHistory;
