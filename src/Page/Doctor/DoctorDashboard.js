import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4">Doctor Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <Card className="shadow-sm text-center flex-fill h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title>Manage Profile</Card.Title>
              <Card.Text>Update your specialty, degrees, and contact info.</Card.Text>
              <Button as={Link} to="/doctor/profile" variant="primary" className="w-100 mt-3">Go to Profile</Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm text-center flex-fill h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title>Appointment Schedule</Card.Title>
              <Card.Text>View or manage your schedule by day, week, or month.</Card.Text>
              <Button as={Link} to="/doctor/appointments" variant="primary" className="w-100 mt-3">Manage Schedule</Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm text-center flex-fill h-100">
            <Card.Body className="d-flex flex-column justify-content-between">
              <Card.Title>Notifications</Card.Title>
              <Card.Text>Get updates on booking, rescheduling, or cancellations.</Card.Text>
              <Button as={Link} to="/doctor/notifications" variant="primary" className="w-100 mt-3">View Notifications</Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
