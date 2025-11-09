import React, { useContext, useState } from "react";
import {
  Button, Card, ButtonGroup, ListGroup, Form,
  Badge, Modal, Dropdown, DropdownButton,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppointmentContext from "../../Context/AppointmentContext";

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const { appointments, updateAppointmentStatus } = useContext(AppointmentContext);

  const [view, setView] = useState("day");
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [statusFilter, setStatusFilter] = useState("All");

  const groupedAppointments = appointments.reduce((acc, appt) => {
    if (!acc[appt.date]) acc[appt.date] = [];
    acc[appt.date].push(appt);
    return acc;
  }, {});

  const getFilteredAppointments = () => {
    if (view === "day") {
      return [{ date: selectedDate, list: groupedAppointments[selectedDate] || [] }];
    }
    return Object.keys(groupedAppointments).map((d) => ({
      date: d,
      list: groupedAppointments[d],
    }));
  };

  const filteredAppointments = getFilteredAppointments();

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Examined":
        return <Badge bg="success">{status}</Badge>;
      case "Canceled":
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status || "Haven't examined yet"}</Badge>;
    }
  };

  const handleViewDetails = (appt) => {
    setSelectedAppointment(appt);
    setShowModal(true);
  };

  const filterAppointmentsByStatus = (list) => {
    if (statusFilter === "All") return list;
    return list.filter((appt) => {
      if (!appt.status) return statusFilter === "Haven't examined yet";
      const status = appt.status.trim().toLowerCase();
      return status === statusFilter.toLowerCase();
    });
  };

  const handleStatusChange = (appt, newStatus) => {
    if (newStatus === "Examined") {
      const confirmChange = window.confirm(
        `Are you sure you want to mark this appointment as "Examined"?`
      );
      if (!confirmChange) return;
      updateAppointmentStatus(appt.id, "Examined");
      setStatusFilter("Examined");
      try {
        localStorage.setItem("appointment_version", Date.now().toString());
        window.dispatchEvent(new CustomEvent("appointments_updated"));
        window.dispatchEvent(new Event("storage"));
      } catch {}
    }
  };

  const renderStatusDropdown = (appt) => {
    const currentStatus = appt.status || "Haven't examined yet";

    if (currentStatus === "Haven't examined yet") {
      return (
        <Form.Select
          size="sm"
          style={{ width: "180px" }}
          value={currentStatus}
          onChange={(e) => handleStatusChange(appt, e.target.value)}
        >
          <option>Haven't examined yet</option>
          <option>Examined</option>
        </Form.Select>
      );
    }

    return (
      <Form.Select size="sm" style={{ width: "180px" }} value={currentStatus} disabled>
        <option>Haven't examined yet</option>
        <option>Examined</option>
        <option>Canceled</option>
      </Form.Select>
    );
  };

  return (
    <div className="container mt-5">
      <Card className="p-4 shadow-sm">
        <Card.Title className="text-center text-primary mb-4 fs-3">
          Manage Examination Schedule
        </Card.Title>

        <div className="text-center mb-3">
          <ButtonGroup>
            <Button
              variant={view === "day" ? "primary" : "outline-primary"}
              onClick={() => setView("day")}
            >Day</Button>
            <Button
              variant={view === "week" ? "primary" : "outline-primary"}
              onClick={() => setView("week")}
            >Week</Button>
            <Button
              variant={view === "month" ? "primary" : "outline-primary"}
              onClick={() => setView("month")}
            >Month</Button>
          </ButtonGroup>
        </div>

        <Form.Group className="mb-4 text-center">
          <Form.Label className="fw-semibold">Select date</Form.Label>
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ maxWidth: "250px", margin: "0 auto" }}
          />
        </Form.Group>

        <div className="text-center mb-4">
          <DropdownButton id="status-filter-dropdown" title={statusFilter} variant="primary">
            <Dropdown.Item onClick={() => setStatusFilter("All")}>All Appointments</Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter("Haven't examined yet")}>
              Haven't examined yet
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter("Examined")}>Examined</Dropdown.Item>
            <Dropdown.Item onClick={() => setStatusFilter("Canceled")}>Canceled</Dropdown.Item>
          </DropdownButton>
        </div>

        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((day, i) => (
            <div key={i} className="mb-3">
              <h6 className="fw-bold text-primary">{day.date}</h6>
              {day.list.length > 0 ? (
                <ListGroup>
                  {filterAppointmentsByStatus(day.list).map((appt, idx) => (
                    <ListGroup.Item
                      key={idx}
                      className="d-flex justify-content-between align-items-center p-3 shadow-sm rounded"
                      style={{
                        opacity: appt.status === "Canceled" ? 0.6 : 1,
                        backgroundColor: appt.status === "Canceled" ? "#f8d7da" : "white",
                      }}
                    >
                      <div className="d-flex flex-column align-items-start gap-2">
                        {renderStatusDropdown(appt)}
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewDetails(appt)}
                        >
                          View Details
                        </Button>
                      </div>

                      <div className="text-end">
                        <div className="fw-semibold">{appt.patientName}</div>
                        <div className="text-muted small">⏰ {appt.time}</div>
                        <div className="mt-1">{renderStatusBadge(appt.status)}</div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted ms-3">No appointments available.</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No appointments for selected date.</p>
        )}

        <div className="text-center mt-4">
          <Button variant="secondary" onClick={() => navigate("/doctor/dashboard")}>
            ⬅ Back to Doctor Dashboard
          </Button>
        </div>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment ? (
            <>
              <p><strong>Patient:</strong> {selectedAppointment.patientName}</p>
              <p><strong>Date:</strong> {selectedAppointment.date}</p>
              <p><strong>Time:</strong> {selectedAppointment.time}</p>
              <p><strong>Status:</strong> {renderStatusBadge(selectedAppointment.status)}</p>
            </>
          ) : (
            <p>No data available.</p>
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
