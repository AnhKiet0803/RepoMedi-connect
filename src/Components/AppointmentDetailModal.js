import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

export default function AppointmentDetailModal({ show, onHide, appointment }) {
  if (!appointment) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Appointment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered>
          <tbody>
            <tr>
              <th>Doctor</th>
              <td>{appointment.doctor}</td>
            </tr>
            <tr>
              <th>Specialty</th>
              <td>{appointment.specialty}</td>
            </tr>
            <tr>
              <th>Hospital</th>
              <td>{appointment.hospital}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{appointment.date}</td>
            </tr>
            <tr>
              <th>Time</th>
              <td>{appointment.time}</td>
            </tr>
            <tr>
              <th>Patient</th>
              <td>{appointment.patientName}</td>
            </tr>
            <tr>
              <th>Notes</th>
              <td>{appointment.notes || "No additional notes"}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
