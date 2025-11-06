import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import mockData from "../data/mockData.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Page.css";
export default function SpecialtyDoctors() {
    const { id } = useParams();
    const navigate = useNavigate();
    const doctors = (mockData.doctors || []).filter((d) => String(d.specialtyId) === String(id));
    const specialtyName = doctors[0]?.specialty || "Specialty";

    return (
        <div className="specialty-doctors-page fade-in">
            <div className="container my-5">
                <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>
                <h3 className="text-primary fw-bold mb-4 text-center">{specialtyName} Department</h3>
                {doctors.length === 0 ? (
                    <p className="text-center text-muted">No doctors available in this department.</p>
                ) : (
                    <div className="row g-4">
                        {doctors.map((doctor) => (
                            <div key={doctor.id} className="col-md-3">
                                <div className="card shadow-sm h-100" style={{ cursor: "pointer" }} onClick={() => navigate(`/doctor/${doctor.id}`)}>
                                    <img src={doctor.image} alt={doctor.name} className="card-img-top" />
                                    <div className="card-body text-center">
                                    <h5 className="text-primary">{doctor.name}</h5>
                                    <p className="text-muted small mb-1">{doctor.specialty}</p>
                                    <p className="small">{doctor.hospital}</p>
                                    <button className="btn btn-primary btn-sm mt-2" onClick={(e) => {e.stopPropagation();navigate(`/doctor/${doctor.id}`);}}>
                                        Book Appointment
                                    </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
