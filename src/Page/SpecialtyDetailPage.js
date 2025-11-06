// src/Page/SpecialtyDetailPage.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import mockData from "../data/mockData.json";
import "../index.css";

const specialties = [
  { id: 1, name: "Orthopedics" },
  { id: 2, name: "Neurology" },
  { id: 3, name: "Gastroenterology" },
  { id: 4, name: "Cardiology" },
  { id: 5, name: "ENT (Ear, Nose, Throat)" },
  { id: 6, name: "Spine Care" },
];

export default function SpecialtyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const doctors = mockData.doctors || [];

  // tìm chuyên khoa theo ID
  const specialty = specialties.find((s) => s.id === parseInt(id));
  if (!specialty) return <h2 className="text-center mt-5">Specialty not found</h2>;

  // lọc danh sách bác sĩ theo chuyên khoa
  const doctorsBySpecialty = doctors.filter(
    (doc) => doc.specialty.toLowerCase() === specialty.name.toLowerCase()
  );

  return (
    <div className="container py-4">
      <button className="btn btn-outline-primary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2 className="text-primary fw-bold mb-4 text-center">{specialty.name} Doctors</h2>

      {doctorsBySpecialty.length === 0 ? (
        <p className="text-center text-muted">No doctors found for this specialty.</p>
      ) : (
        <div className="row g-4">
          {doctorsBySpecialty.map((doctor) => (
            <div key={doctor.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                className="card h-100 shadow-sm border-0 doctor-card"
                onClick={() => navigate(`/doctor/${doctor.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={doctor.image.replace("..", process.env.PUBLIC_URL)}
                  alt={doctor.name}
                  className="card-img-top"
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-primary mb-1">{doctor.name}</h5>
                  <p className="text-muted mb-1">{doctor.specialty}</p>
                  <p className="small text-secondary">{doctor.hospital}</p>
                </div>
                <div className="card-footer bg-white border-0 text-center pb-3">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/doctor/${doctor.id}`);
                    }}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
