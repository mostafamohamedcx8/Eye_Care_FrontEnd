import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import Header from "../component/Header";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllDoctor, getAllDOCTORPage } from "../Redux/actions/Doctoraction";
import Paginationcomponent from "../component/pagination";
import { useNavigate } from "react-router-dom";
const DoctorCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllDoctor(3));
  }, []);

  const doctorData = useSelector((state) => state.alldoctor.doctor);
  const loading = useSelector((state) => state.alldoctor.loading);

  console.log(doctorData); // Add optional chaining for safety
  console.log(loading);
  let pagecount = 0;
  if (doctorData?.paginationresults?.numberOfPages) {
    pagecount = doctorData.paginationresults.numberOfPages;
  }

  const getpage = (page) => {
    dispatch(getAllDOCTORPage(page));
  };

  const doctors = doctorData?.data || [];

  return (
    <>
      <Header />
      <NavBar />

      <Container className="mb-5 mt-4">
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
                      <strong>Specialty:</strong> {doctor.Specialty}
                    </Card.Text>
                    <Button
                      variant="primary"
                      className="w-100 mt-auto"
                      onClick={() => {
                        setTimeout(() => {
                          navigate(`/DoctorDetailes/${doctor._id}`);
                        }, 1000); // تأخير لمدة ثانية (1000 مللي ثانية)
                      }}
                    >
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
      {pagecount > 1 ? (
        <Paginationcomponent pagecount={pagecount} onpress={getpage} />
      ) : null}

      <Footer />
    </>
  );
};

export default DoctorCard;
