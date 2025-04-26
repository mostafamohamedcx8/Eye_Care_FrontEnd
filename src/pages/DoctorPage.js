import React, { useState } from "react";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import Header from "../component/Header";
import NavBarProfile from "../component/NavBarProfile";
import Footer from "../component/Footer";

const DoctorCard = () => {
  const [search, setSearch] = useState("");

  const doctors = [
    {
      name: "Dr. Sarah Ahmed",
      city: "Cairo",
      state: "Cairo Governorate",
      specialty: "Ophthalmologist",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Dr. Ali Hassan",
      city: "Alexandria",
      state: "Alexandria Governorate",
      specialty: "Retina Specialist",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      name: "Dr. Lina Mansour",
      city: "Giza",
      state: "Giza Governorate",
      specialty: "Pediatric Ophthalmologist",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      name: "Dr. Lina Mansour",
      city: "Giza",
      state: "Giza Governorate",
      specialty: "Pediatric Ophthalmologist",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
  ];

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.name} ${doctor.city} ${doctor.state}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <NavBarProfile />

      <Container className="mt-5 mb-4">
        <Form>
          <Form.Control
            type="text"
            placeholder="Search by name, city, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form>
      </Container>

      <Container className="mb-5">
        <Row>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, index) => (
              <Col key={index} md={3} className="mb-4">
                <Card className="shadow rounded-3 h-100 d-flex flex-column">
                  <Card.Img
                    variant="top"
                    src={doctor.image}
                    alt={doctor.name}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{doctor.name}</Card.Title>
                    <Card.Text className="flex-grow-1">
                      <strong>City:</strong> {doctor.city} <br />
                      <strong>State:</strong> {doctor.state} <br />
                      <strong>Specialty:</strong> {doctor.specialty}
                    </Card.Text>
                    <Button variant="primary" className="w-100 mt-auto">
                      View Profile
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

      <Footer />
    </>
  );
};

export default DoctorCard;
