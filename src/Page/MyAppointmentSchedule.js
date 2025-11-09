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

  const handleViewDetails = (appt) => {
    setSelectedAppointment(appt);
    setShowModal(true);
  };

  const handleBack = () => {
    setFadeClass("fade-out");
    setTimeout(() => navigate("/"), 400);
  };

  // Huỷ cuộc hẹn và mở lại slot
  const handleCancel = (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmCancel) return;

    const canceledAppt = appointments.find((a) => a.id === id);
    if (!canceledAppt) return;

    try {
      // Thông báo cho bác sĩ
      addNotification({
        doctorId: canceledAppt.doctorId,
        type: "cancel",
        message: `❌ Appointment canceled by ${
          user?.fullName || canceledAppt.patientName
        } at ${canceledAppt.time} on ${canceledAppt.date}.`,
        appointmentId: canceledAppt.id,
        appointmentDate: canceledAppt.date,
        appointmentTime: canceledAppt.time,
      });
    } catch (err) {
      console.error("❌ Failed to send cancel notification:", err);
    }

    // Cập nhật trạng thái trong context
    const updatedAppointments = (appointments || []).map((a) =>
      a.id === id ? { ...a, status: "Canceled" } : a
    );
    setAppointments(updatedAppointments);

    // Đồng bộ localStorage (để tab/trang khác thấy ngay)
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("appointments_")) {
          const list = JSON.parse(localStorage.getItem(key) || "[]");
          const newList = list.map((appt) =>
            appt.id === id ? { ...appt, status: "Canceled" } : appt
          );
          localStorage.setItem(key, JSON.stringify(newList));
        }
      });
    } catch (err) {
      console.error("❌ Failed to persist canceled appointment:", err);
    }

    // Mở lại slot
    try {
      const storedSlots =
        JSON.parse(localStorage.getItem("appointment_slots")) || [];
      const updatedSlots = storedSlots.map((slot) =>
        `${slot.doctor_id}_${slot.slot_date}_${slot.start_time}` ===
        canceledAppt.slot_id
          ? { ...slot, is_available: true }
          : slot
      );
      localStorage.setItem("appointment_slots", JSON.stringify(updatedSlots));
    } catch (err) {
      console.error("❌ Failed to update slot:", err);
    }

    // Bắn event đồng bộ realtime
    localStorage.setItem("appointment_version", Date.now().toString());
    window.dispatchEvent(new CustomEvent("appointments_updated"));
    window.dispatchEvent(new Event("storage"));

    setMessage("Appointment canceled successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  let myAppointments = appointments || [];
  if (user?.role === "patient") {
    myAppointments = myAppointments.filter(
      (a) => a.patientEmail?.toLowerCase() === user.email?.toLowerCase()
    );
  }

  const canCancel = (status) => status === "Haven't examined yet";

  // render Status với màu
  const renderStatusText = (status) => {
    const s = status || "Haven't examined yet";
    if (s === "Examined") return <span className="text-success fw-semibold">Examined</span>;
    if (s === "Canceled") return <span className="text-danger fw-semibold">Canceled</span>;
    return <span className="text-secondary">Haven't examined yet</span>;
  };

  // chọn màu cho nút trạng thái ở cột Action khi không thể hủy
  const statusButtonVariant = (status) => {
    if (status === "Examined") return "outline-success";
    if (status === "Canceled") return "outline-danger";
    return "outline-secondary";
  };

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
                <th>Status</th>
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
                    )?.fullName || a.patientName || "Unknown"}
                  </td>
                  <td>{renderStatusText(a.status)}</td>
                  <td className="text-center d-flex gap-2 justify-content-center">
                    <Button variant="outline-info" size="sm" onClick={() => handleViewDetails(a)}>
                      View
                    </Button>

                    {canCancel(a.status) ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleCancel(a.id)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        variant={statusButtonVariant(a.status)}
                        size="sm"
                        disabled
                      >
                        {a.status || "Locked"}
                      </Button>
                    )}
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
      <AppointmentDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
