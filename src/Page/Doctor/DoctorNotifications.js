import React, { useContext, useMemo, useState } from "react";
import { Card, Button, Badge, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import NotificationContext from "../../Context/NotificationContext";
import AuthContext from "../../Context/Context";
import AppointmentContext from "../../Context/AppointmentContext";
import mockData from "../../data/mockData.json";

export default function DoctorNotifications() {
  const { getDoctorNotifications, markAsRead } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const { appointments } = useContext(AppointmentContext);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Suy ra doctorId nếu user không có
  const doctorId = useMemo(() => {
    if (user?.doctorId) return user.doctorId;

    if (user?.role === "doctor") {
      const byEmail = mockData.doctors.find(
        (d) =>
          d.email &&
          user.email &&
          d.email.toLowerCase() === user.email.toLowerCase()
      );
      if (byEmail) return byEmail.id;

      const uName =
        (user.fullName || user.name || "").trim().toLowerCase() || null;
      if (uName) {
        const byName = mockData.doctors.find(
          (d) => d.name && d.name.trim().toLowerCase() === uName
        );
        if (byName) return byName.id;
      }
    }
    return null;
  }, [user]);

  const notifications = useMemo(() => {
    if (!doctorId) return [];
    return getDoctorNotifications(doctorId) || [];
  }, [doctorId, getDoctorNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // 🔍 Lấy thông tin chi tiết cuộc hẹn tương ứng với notification
  const handleViewDetail = (n) => {
    const appt =
      appointments.find((a) => a.id === n.appointmentId) ||
      appointments.find(
        (a) => a.date === n.appointmentDate && a.time === n.appointmentTime
      ) ||
      null;

    setSelectedAppointment(appt);
    setShowModal(true);
  };

  // Nếu vẫn không suy ra được doctorId → hướng dẫn ngắn cách fix ở AuthContext
  if (!doctorId) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger mb-2">Thiếu <code>doctorId</code> trên người dùng hiện tại.</h4>
        <p className="text-muted">
          Hãy gán <code>user.doctorId</code> khi đăng nhập, hoặc đảm bảo email/tên của bác sĩ
          khớp với dữ liệu trong <code>mockData.doctors</code> để hệ thống tự suy ra.
        </p>
        <Button as={Link} to="/doctor/dashboard" variant="secondary">
          ← Về Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">
          Notifications {unreadCount > 0 && <Badge bg="danger">{unreadCount}</Badge>}
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
                  <Card.Title className="mb-1">
                    {n.type === "booking" && "📅 New schedule"}
                    {n.type === "reschedule" && "🔄 Reschedule"}
                    {n.type === "cancel" && "❌ Cancel appointment"}
                  </Card.Title>
                  <Card.Text className="mb-1">{n.message}</Card.Text>
                  <small className="text-muted">
                    {n.date ? new Date(n.date).toLocaleString() : ""}
                  </small>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleViewDetail(n)}
                    >
                      View Appointment
                    </Button>
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
              </div>
            </Card.Body>
          </Card>
        ))
      )}

      {/* 🔹 Modal hiển thị thông tin chi tiết */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
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
