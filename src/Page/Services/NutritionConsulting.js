import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../Page.css";

export default function NutritionConsulting() {
  const [fadeClass, setFadeClass] = useState("fade-in");
  const navigate = useNavigate();

  const smoothNavigate = (path) => {
    setFadeClass("fade-out");
    setTimeout(() => navigate(path), 400);
  };
  const steps = [
    {
      step: "Step 1",
      title: "Book a Consultation",
      desc: "Schedule your nutrition consultation via Email or hotline.",
    },
    {
      step: "Step 2",
      title: "Meet Your Nutritionist",
      desc: "Discuss your health goals, habits, and dietary preferences with our expert.",
    },
    {
      step: "Step 3",
      title: "Get Your Personalized Plan",
      desc: "Receive a detailed meal plan, lifestyle advice, and ongoing support.",
    },
  ];

  return (
    <div className={`service-page ${fadeClass}`} style={{ fontFamily: "Segoe UI, sans-serif" }}>
      <section
        className="service-hero" style={{backgroundImage: "url('/img/nutrition-banner.jpg')",backgroundSize: "cover",backgroundPosition: "center",height: "60vh",display: "flex",alignItems: "center",justifyContent: "center",color: "#fff",position: "relative",textAlign: "center",}}>
        <div style={{position: "absolute",inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.65))",}}></div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 800 }}>
          <h1 className="fw-bold mb-3 display-5">Nutrition Consulting 🥗</h1>
          <p className="fs-5">
            Achieve your health goals with personalized nutrition guidance — for a stronger, healthier you.
          </p>
        </div>
      </section>
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img src="/img/nutrition-consult.jpg" alt="Nutrition Consulting" className="img-fluid rounded-4 shadow-sm" style={{ maxHeight: "420px", objectFit: "cover" }}/>
            </Col>
            <Col md={6}>
              <h2 className="text-primary fw-bold mb-3">Why Choose Nutrition Consulting?</h2>
              <p className="text-muted fs-5">
                MediConnect's **Nutrition Consulting Service** helps you create a balanced and healthy lifestyle
                tailored to your needs. Whether you want to manage weight, improve energy, or support specific
                health conditions — our certified nutritionists are here to help.
              </p>
              <ul className="benefit-list mt-3">
                <li>Personalized meal plans based on your health and goals.</li>
                <li>Expert guidance for weight management and chronic disease prevention.</li>
                <li>Follow-up sessions to track your progress.</li>
                <li>Online and in-person consultation options available.</li>
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
              <Col md={4} key={item.step}>
                <div className="card border-0 shadow-sm h-100 py-4 how-it-works-card">
                  <div className="card-body">
                    <div className="step-icon mb-3"><span>{item.step}</span></div>
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
          <h2 className="fw-bold mb-3">Start Your Nutrition Journey Today!</h2>
          <p className="fs-5 mb-4">
            Take the first step towards a healthier life. Book your nutrition consultation now and
            receive expert guidance from MediConnect's certified professionals.
          </p>
          <p className="fs-5 mb-4">What are you waiting for, pick up the phone and call us at the <strong>Hotline</strong>: +1 (555) 123-4567</p>
        </Container>
      </section>
    </div>
  );
}
