import React from "react";
import "./Page.css"; 

export default function DoctorsIntro() {
    return (
        <div className="doctors-intro-page">
            <div className="container py-5">
                <h1 className="text-center mb-4">Meet Our Medical Team</h1>
                <p className="lead text-center mb-5">
                    Our team of doctors consists of top professionals in various specialties,
                    dedicated, experienced, and continuously improving to deliver the highest quality
                    healthcare services to every patient.
                </p>
                <div className="mb-4">
                <h3>Vision & Mission</h3>
                    <p>
                        We believe that health is the most valuable asset of every individual.
                        With a team of highly qualified doctors, we are committed to providing
                        safe, effective, and compassionate medical care, ensuring the satisfaction
                        and peace of mind of our patients.
                    </p>
                </div>
                <div className="mb-4">
                <h3>Core Values</h3>
                    <ul>
                        <li>Professionalism - Dedication - Responsibility</li>
                        <li>Patient-centered care in every action</li>
                        <li>Continuous learning and innovation</li>
                    </ul>
                </div>
                <div>
                <h3>Our Distinguished Doctors</h3>
                    <p>
                        Each of our doctors is highly skilled, with years of experience in both
                        clinical practice and research. They are not only healers but also
                        compassionate companions throughout your healthcare journey.
                    </p>
                </div>
            </div>
        </div>
    );
}
