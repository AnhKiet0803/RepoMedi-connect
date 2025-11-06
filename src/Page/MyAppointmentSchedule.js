import React, { useContext, useState } from "react";
import { Container, Table, Alert, Button } from "react-bootstrap";
import AppointmentContext from "../Context/AppointmentContext";
import NotificationContext from "../Context/NotificationContext";
import AuthContext from "../Context/Context";
import { useNavigate } from "react-router-dom";
import mockData from "../data/mockData.json";
import "./Page.css";
import AppointmentDetailModal from "../Components/AppointmentDetailModal";


export default function MyAppointments() {
  const { appointments, setAppointments } = useContext(AppointmentContext);
  const { addNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [fadeClass, setFadeClass] = useState("fade-in");
  const [message, setMessage] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const patientsData = mockData.patients;
  //  Hàm mở chi tiết cuộc hẹn
  const handleViewDetails = (appt) => {
    setSelectedAppointment(appt);
    setShowModal(true);
  };

  //  Hàm quay lại trang chủ
  const handleBack = () => {
    setFadeClass("fade-out");
    setTimeout(() => navigate("/"), 400);
  };

  //  Hàm huỷ cuộc hẹn
  const handleCancel = (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    const canceledAppt = appointments.find((a) => a.id === id);

    if (canceledAppt) {
      try {
        addNotification({
          doctorId: canceledAppt.doctorId,
          type: "cancel",
          message: `❌ Appointment canceled by ${user?.fullName || canceledAppt.patientName} at ${canceledAppt.time} on ${canceledAppt.date}.`,
        });
      } catch (err) {
        console.error("❌ Failed to send cancel notification:", err);
      }
    }

    const updatedAppointments = appointments.map((a) =>
      a.id === id ? { ...a, status: "Canceled" } : a
    );
    setAppointments(updatedAppointments);
    setMessage("Appointment canceled successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const myAppointments = appointments || [];

  return (
    <div className={`my-appointments-page ${fadeClass}`}>
      <Container className="mt-5">
        <h3 className="text-primary mb-4">My Appointment Schedule 🩺</h3>
        {message && <Alert variant="success">{message}</Alert>}
        {myAppointments.length === 0 ? (
          <Alert variant="info">You have no booked appointments yet.</Alert>
        ) : (
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Doctor</th>
                <th>Specialty</th>
                <th>Hospital</th>
                <th>Date</th>
                <th>Time</th>
                <th>Patient</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {myAppointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.doctor}</td>
                  <td>{a.specialty}</td>
                  <td>{a.hospital}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>
                    {patientsData.find(
                      (p) =>
                        p.email.toLowerCase() === a.patientEmail?.toLowerCase()
                    )?.fullName ||
                      a.patientName ||
                      "Unknown"}
                  </td>
                  <td className="text-center d-flex gap-2 justify-content-center">
                    <Button variant="outline-info" size="sm" onClick={() => handleViewDetails(a)}>
                      View
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleCancel(a.id)}
                      disabled={a.status === "Canceled"} 
                      style={{ opacity: a.status === "Canceled" ? 0.5 : 1,  cursor: a.status === "Canceled" ? "not-allowed" : "pointer",}}>
                      {a.status === "Canceled" ? "Canceled" : "Cancel"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <div className="text-center mt-4">
          <Button variant="outline-primary" onClick={handleBack}>
            ← Back to Home
          </Button>
        </div>
      </Container>

      {/* Modal chi tiết lịch hẹn */}
      <AppointmentDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
