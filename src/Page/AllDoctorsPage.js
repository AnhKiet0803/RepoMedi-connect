import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import mockData from "../data/mockData.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import "./Page.css";
export default function AllDoctorsPage() {
  const navigate = useNavigate();
  const specialties = [
    { id: 0, name: "All" },
    { id: 1, name: "Orthopedics" },
    { id: 2, name: "Neurology" },
    { id: 3, name: "Gastroenterology" },
    { id: 4, name: "Cardiology" },
    { id: 5, name: "ENT (Ear, Nose, Throat)" },
    { id: 6, name: "Spine Care" },
  ];
  const doctorsData = mockData.doctors;
  //lưu chuyên khoa được chọn
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  // Lọc bác sĩ theo chuyên khoa
  const filteredDoctors =
    selectedSpecialty === "All"
      ? doctorsData
      : doctorsData.filter((d) => d.specialty === selectedSpecialty);

  return (
    <div className="all-doctors-page fade-in">
    <div className="container my-5">
      <h2 className="text-center fw-bold text-primary mb-4"> Our Certified Medical Specialists</h2>
      <p className="text-center text-muted mb-4">Browse our team of experienced physicians and book your consultation.</p>
      <div className="text-center mb-4">
        <label htmlFor="specialty" className="me-2 fw-semibold">Filter by Specialty:</label>
        <select id="specialty" className="form-select d-inline-block w-auto" value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
          {specialties.map((spec) => (<option key={spec.id} value={spec.name}>{spec.name}</option>))}
        </select>
      </div>
      <div className="row g-4">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm border-0">
              <img src={doctor.image} className="card-img-top" alt={doctor.name} style={{ height: "220px", objectFit: "cover", borderTopLeftRadius: "8px", borderTopRightRadius: "8px",}}/>
              <div className="card-body text-center">
                <h5 className="card-title mb-1 text-dark">{doctor.name}</h5>
                <p className="text-muted mb-1">{doctor.specialty}</p>
                <p className="small text-secondary">{doctor.hospital}</p>
              </div>
              <div className="card-footer bg-white border-0 text-center pb-3">
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/doctor/${doctor.id}`)}>
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredDoctors.length === 0 && (
          <p className="text-center text-muted mt-4">No doctors found for this specialty.</p>
        )}
      </div>
    </div>
    </div>
  );
}
