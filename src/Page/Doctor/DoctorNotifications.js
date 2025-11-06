import React, { useContext, useState } from "react";
import { Card, Button, Badge, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import NotificationContext from "../../Context/NotificationContext";
import AuthContext from "../../Context/Context";
import AppointmentContext from "../../Context/AppointmentContext";

export default function DoctorNotifications() {
  console.log("👨‍⚕️ DoctorNotifications loaded");

  const { getDoctorNotifications, markAsRead } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const { appointments } = useContext(AppointmentContext);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const doctorId = user?.doctorId;
  const notifications = getDoctorNotifications(doctorId) || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🔍 Lấy thông tin chi tiết cuộc hẹn tương ứng với notification
  const handleViewDetail = (notification) => {
    const appt = appointments.find(
      (a) => a.id === notification.appointmentId || a.date === notification.date
    );
    setSelectedAppointment(appt || null);
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">
          Notifications{" "}
          {unreadCount > 0 && <Badge bg="danger">{unreadCount}</Badge>}
        </h2>
        <Button as={Link} to="/doctor/dashboard" variant="secondary">
          ← Back to Dashboard
        </Button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-muted">No notifications yet.</p>
      ) : (
        notifications.map((n) => (
          <Card
            key={n.id}
            className={`mb-3 shadow-sm ${n.read ? "bg-light" : "border-primary"}`}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title>
                    {n.type === "booking" && "📅 New schedule"}
                    {n.type === "reschedule" && "🔄 Reschedule"}
                    {n.type === "cancel" && "❌ Cancel appointment"}
                  </Card.Title>
                  <Card.Text>{n.message}</Card.Text>
                  <small className="text-muted">
                    {new Date(n.date).toLocaleString()}
                  </small>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                  {!n.read && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => markAsRead(n.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}

      {/* 🔹 Modal hiển thị thông tin chi tiết */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment ? (
            <Table bordered hover responsive>
              <tbody>
                <tr>
                  <th>Doctor</th>
                  <td>{selectedAppointment.doctor}</td>
                </tr>
                <tr>
                  <th>Specialty</th>
                  <td>{selectedAppointment.specialty}</td>
                </tr>
                <tr>
                  <th>Hospital</th>
                  <td>{selectedAppointment.hospital}</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>{selectedAppointment.date}</td>
                </tr>
                <tr>
                  <th>Time</th>
                  <td>{selectedAppointment.time}</td>
                </tr>
                <tr>
                  <th>Patient</th>
                  <td>{selectedAppointment.patientName}</td>
                </tr>
                <tr>
                  <th>Patient Email</th>
                  <td>{selectedAppointment.patientEmail}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{selectedAppointment.status}</td>
                </tr>
                <tr>
                  <th>Reason</th>
                  <td>{selectedAppointment.reason}</td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <p className="text-muted text-center">
              No appointment details found for this notification.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
