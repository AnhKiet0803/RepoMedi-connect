import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import BookingDoctorSection from "../Components/BookingDoctorSection";
import Banner from "../Components/Banner";
import SpecialtySection from "../Components/SpecialtySection"; 
import "../index.css";
import "./Page.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [fadeClass, setFadeClass] = useState("fade-in");

  const smoothNavigate = (path) => {
    setFadeClass("fade-out");
    setTimeout(() => navigate(path), 400);
  };
  const specialties = [
    { id: 1, name: "Orthopedics" },
    { id: 2, name: "Neurology" },
    { id: 3, name: "Gastroenterology" },
    { id: 4, name: "Cardiology" },
    { id: 5, name: "ENT (Ear, Nose, Throat)" },
    { id: 6, name: "Spine Care" },
  ];

  const serviceTypes = [
    { id: 1, name: "Home examination" },
    { id: 2, name: "Nutritional consulting" },
  ];

  return (
    <div className={`home-page ${fadeClass}`} style={{ fontFamily: "Segoe UI, sans-serif" }}>
      {/* --- Banner --- */}
      <Banner />
      {/* --- Khám Chuyên Khoa --- */}
      <SpecialtySection />
      {/* --- Đặt Lịch Bác Sĩ --- */}
      <section className="doctor-booking-section">
        <BookingDoctorSection />
      </section>
      {/* --- Hero Banner --- */}
      <section aria-label="Hero Banner" style={{backgroundImage: "url('/img/banner.jpg')",backgroundSize: "cover",backgroundPosition: "center center",height: "70vh",display: "flex",alignItems: "center",justifyContent: "center",position: "relative",overflow: "hidden",}}>
        <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.55))",}}></div>
        <div style={{position: "relative",zIndex: 2,textAlign: "center",color: "#fff",backgroundColor: "rgba(255,255,255,0.08)",backdropFilter: "blur(4px)",padding: "40px 50px",borderRadius: "14px",boxShadow: "0 8px 24px rgba(0,0,0,0.3)",maxWidth: 900,}}>
          <h1 className="fw-bold mb-3 display-5">Welcome to <span className="text-info">MediConnect</span></h1>
          <p className="fs-5 mb-4">Comprehensive healthcare — Connecting doctors and patients easily</p>
          <button onClick={() => smoothNavigate("/doctors")} className="btn btn-light btn-lg px-4 fw-semibold shadow-sm">Schedule now</button>
        </div>
      </section>
      {/* --- About MediConnect --- */}
      <section style={{ padding: "80px 0" }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <img src="/img/about-banner.jpg" alt="About MediConnect" className="img-fluid rounded-4 shadow-sm" style={{width: "100%", maxHeight: "420px", objectFit: "cover", borderRadius: "14px",}}/>
            </Col>
            <Col md={6}>
              <h2 className="text-primary fw-bold mb-3">About MediConnect</h2>
              <p className="text-muted fs-5">
                MediConnect is a digital healthcare platform that makes it easy for
                patients to book appointments, visit online, and access high-quality
                healthcare services. We aim for a convenient, safe, and modern
                healthcare experience.
              </p>
              <div className="mt-3">
                <button onClick={() => smoothNavigate("/about")} className="btn btn-outline-primary me-3 px-4 fw-semibold">Learn more</button>
                <button onClick={() => smoothNavigate("/contact")} className="btn btn-primary px-4 fw-semibold">Contact now</button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* --- Medical Services --- */}
      <section style={{ backgroundColor: "#f9fbff", padding: "60px 0" }}>
        <Container>
          <h2 className="text-primary fw-bold text-center mb-4">Medical Services</h2>
          <Row className="g-4">
            <Col md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <h4 className="text-primary mb-3">Our medical department</h4>
                  <ul className="list-unstyled">
                    {specialties.map((s) => (
                      <li key={s.id} className="py-2 px-3 rounded hover-service" style={{ cursor: "pointer" }} onClick={() => smoothNavigate(`/specialty/${s.id}`)}>{s.name}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <h4 className="text-primary mb-3">Our medical services</h4>
                  <ul className="list-unstyled"> 
                    {serviceTypes.map((item) => ( 
                      <li key={item.id} className="py-2 px-3 rounded hover-service" style={{ cursor: "pointer" }} onClick={() => smoothNavigate(`/service/${item.id}`)}>{item.name}</li> 
                    ))} 
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
