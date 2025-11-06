import React from "react";
import "./Page.css";

export default function AdvicePage() {
  return (
    <div className="advice-page">
      <div className="container py-5">
        <h1 className="text-center mb-4">Do You Need Medical Advice?</h1>
        <p className="lead text-center mb-5">
          Our team of experienced doctors and medical specialists is always ready
          to listen and support you. Whether you’re exploring symptoms, looking
          for the right specialty, or need guidance through treatment procedures —
          we are here to help you every step of the way.
        </p>
        <div className="advice-section mb-4">
          <h3>Why Choose Our Consultation Service?</h3>
          <ul>
            <li>Highly qualified doctors with years of real-world experience.</li>
            <li>Free, fast, and confidential consultations.</li>
            <li>Personalized advice to help you find the right doctor and appointment.</li>
          </ul>
        </div>
        <div className="advice-section mb-4">
          <h3>Available Consultation Methods</h3>
          <ul>
            <li>In-person consultation at our clinic.</li>
            <li>Consultation via phone or video call.</li>
            <li><p> Get advice via email: <strong>info@MediConnect.health</strong></p></li>
          </ul>
        </div>
        <div className="advice-cta text-center mt-5">
          <h4>Need Advice Now?</h4>
          <p>Contact us today to receive professional support from our experts.</p>
          <a className="btn btn-primary px-4 py-2">Get Consultation Now: +1 (555) 123-4567</a>
        </div>
      </div>
    </div>
  );
}
