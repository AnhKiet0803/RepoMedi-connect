import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import mockData from "../data/mockData.json";
import "../index.css";

function BookingDoctorSection() {
  const navigate = useNavigate();
    const doctorsData = mockData.doctors;
  const limitedDoctors = doctorsData.slice(0,8);
  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold text-primary">Book a Doctor Appointment</h2>
          <p className="text-muted">Choose a doctor and schedule your appointment quickly.</p>
        </div>
        <button className="btn btn-outline-primary" onClick={() => navigate("/doctors")}>See More →</button>
      </div>
      <div className="doctor-scroll d-flex overflow-auto pb-3">
        {limitedDoctors.map((doctor) => (
          <div key={doctor.id} className="card doctor-card me-3 flex-shrink-0" style={{ width: "18rem", cursor: "pointer" }} onClick={() => navigate(`/doctor/${doctor.id}`)}>
            <img src={doctor.image} className="card-img-top" alt={doctor.name} />
            <div className="card-body text-center">
              <h5 className="card-title mb-1">{doctor.name}</h5>
              <p className="text-muted mb-1">{doctor.specialty}</p>
              <p className="small">{doctor.hospital}</p>
              <button className="btn btn-primary btn-sm mt-2">Make an Appointment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BookingDoctorSection;
