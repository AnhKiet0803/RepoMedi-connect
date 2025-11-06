import React, { useState } from "react";
import { Container, Row, Col, } from "react-bootstrap";
import "../Page.css";

export default function HomeExamination() {
  const [fadeClass, setFadeClass] = useState("fade-in");
  const steps = [
    {
      steps: "Step 1",
      title: "Book an Appointment",
      desc: "Schedule a home visit easily via Email or MediConnect Hotline.",
    },
    {
      steps: "Step 2",
      title: "Doctor Arrives at Your Home",
      desc: "A qualified doctor or nurse will visit your home at the chosen time.",
    },
    {
      steps: "Step 3",
      title: "Diagnosis & Care",
      desc: "Receive thorough examination, treatment, and follow-up — right where you are.",
    },
  ];

  return (
    <div className={`service-page ${fadeClass}`}>
      <section className="service-hero"
        style={{backgroundImage: "url('/img/home-exam-banner.webp')",backgroundSize: "cover",backgroundPosition: "center",height: "60vh",display: "flex",alignItems: "center",justifyContent: "center",color: "#fff",position: "relative",textAlign: "center",}}>
        <div style={{position: "absolute",inset: 0,background: "linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.6))",}}></div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 800 }}>
          <h1 className="fw-bold mb-3 display-5">Home Medical Examination 🏥</h1>
          <p className="fs-5">
            Bringing hospital-quality care right to your doorstep — convenient, safe, and professional.
          </p>
        </div>
      </section>
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img src="/img/home-exam.jpg" alt="Home Examination" className="img-fluid rounded-4 shadow-sm" style={{ maxHeight: "420px", objectFit: "cover" }}/>
            </Col>
            <Col md={6}>
              <h2 className="text-primary fw-bold mb-3">Why Choose Home Examination?</h2>
              <p className="text-muted fs-5">
                Our **home examination service** allows patients to receive professional healthcare without leaving home.
                MediConnect's doctors come directly to you for diagnosis, treatment, and follow-up care — ideal for
                elderly patients, busy professionals, or those with mobility issues.
              </p>
              <ul className="benefit-list mt-3">
                <li>✔ Convenient and time-saving — no travel or waiting.</li>
                <li>✔ Safe and private care in your own environment.</li>
                <li>✔ Professional doctors and nurses on call 24/7.</li>
                <li>✔ Online appointment booking and easy tracking via MediConnect.</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-5">
        <Container className="text-center">
          <h2 className="text-primary fw-bold mb-4">How It Works</h2>
          <Row className="g-4">
            {steps.map((item) => (
              <Col md={4} key={item.steps}>
                <div className="card border-0 shadow-sm h-100 py-4 how-it-works-card">
                  <div className="card-body">
                    <div className="step-icon mb-3"><span>{item.steps}</span></div>
                    <h5 className="fw-bold text-dark">{item.title}</h5>
                    <p className="text-muted mt-2">{item.desc}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <section className="py-5 text-center text-white" style={{background: "linear-gradient(135deg, #007bff, #00b4d8)",}}>
        <Container>
          <h2 className="fw-bold mb-3">Ready to Book Your Home Examination?</h2>
          <p className="fs-5 mb-4">
            Let MediConnect bring high-quality healthcare right to your home. 
            Make an appointment today, please call us <strong>Hotline:</strong> +1 (555) 123-4567
          </p>
        </Container>
      </section>
    </div>
  );
}
