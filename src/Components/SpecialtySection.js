import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "./Component.css";
const specialties = [
  { id: 1, name: "Orthopedics", icon: "https://cdn.bookingcare.vn/fo/w128/2023/12/26/101627-co-xuong-khop.png" },
  { id: 2, name: "Neurology", icon: "https://cdn.bookingcare.vn/fo/2023/12/26/101739-than-kinh.png" },
  { id: 3, name: "Gastroenterology", icon: "https://cdn.bookingcare.vn/fo/2023/12/26/101713-tieu-hoa.png" },
  { id: 4, name: "Cardiology", icon: "https://cdn.bookingcare.vn/fo/2023/12/26/101713-tim-mach.png" },
  { id: 5, name: "ENT (Ear, Nose, Throat)", icon: "https://cdn.bookingcare.vn/fo/2023/12/26/101713-tai-mui-hong.png" },
  { id: 6, name: "Spine Care", icon: "https://cdn.bookingcare.vn/fo/2023/12/26/101627-cot-song.png" },
];

export default function SpecialtySection() {
  const navigate = useNavigate();
  return (
    <div className="specialty-section container my-5">
      <h2 className="fw-bold text-primary mb-4">Specialized Medical Departments</h2>
      <div className="row g-4">
        {specialties.map((s) => (
          <div key={s.id} className="col-6 col-md-4 col-lg-2 text-center">
            <div className="specialty-card h-100" style={{ cursor: "pointer" }} onClick={() => navigate(`/specialty/${s.id}`)}>
              <img src={s.icon} alt={s.name} />
              <h6>{s.name}</h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
