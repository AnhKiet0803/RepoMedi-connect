import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Row, Col } from 'react-bootstrap';
import mockData from '../../data/mockData.json';

const PatientManager = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', gender: '', contact: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [filters, setFilters] = useState({ gender: '', keyword: '' });

  useEffect(() => {
    const loadedPatients = mockData.patients.map(p => ({
      id: p.id,
      name: p.fullName,
      age: new Date().getFullYear() - new Date(p.dob).getFullYear(),
      gender: p.gender === 'male' ? 'Male' : 'Female',
      contact: p.email || p.phone
    }));
    setPatients(loadedPatients);
    setFilteredPatients(loadedPatients);
    setAppointments(mockData.appointments || []);
  }, []);

  const applyFilters = () => {
    let result = [...patients];
    if (filters.gender) {
      result = result.filter(p => p.gender === filters.gender);
    }
    if (filters.keyword) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }
    setFilteredPatients(result);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, patients]);

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      const updated = patients.map(p =>
        p.id === editingId ? { ...p, ...form } : p
      );
      setPatients(updated);
      setEditingId(null);
    } else {
      const newPatient = { ...form, id: Date.now() };
      setPatients([...patients, newPatient]);
    }
    setForm({ name: '', age: '', gender: '', contact: '' });
    setShowModal(false);
  };

  const handleEdit = p => {
    setForm({ name: p.name, age: p.age, gender: p.gender, contact: p.contact });
    setEditingId(p.id);
    setShowModal(true);
  };

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      const updated = patients.filter(p => p.id !== id);
      setPatients(updated);
    }
  };

  const handleAdd = () => {
    setForm({ name: '', age: '', gender: '', contact: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({ name: '', age: '', gender: '', contact: '' });
    setEditingId(null);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">🧑‍💼 Patient Management</h2>
        <Button variant="primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>Add New Patient
        </Button>
      </div>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Select
            value={filters.gender}
            onChange={e => setFilters({ ...filters, gender: e.target.value })}
          >
            <option value="">-- Filter by Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Select>
        </Col>
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={filters.keyword}
            onChange={e => setFilters({ ...filters, keyword: e.target.value })}
          />
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient, index) => (
            <tr key={patient.id}>
              <td>{index + 1}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.contact}</td>
              <td>
                <Button variant="info" size="sm" className="me-2" onClick={() => setShowDetail(patient)}>
                  <i className="bi bi-eye me-1"></i>Details
                </Button>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(patient)}>
                  <i className="bi bi-pencil me-1"></i>Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(patient.id)}>
                  <i className="bi bi-trash me-1"></i>Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Detail Modal */}
      <Modal show={!!showDetail} onHide={() => setShowDetail(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showDetail && (
            <>
              <p><strong>Full Name:</strong> {showDetail.name}</p>
              <p><strong>Age:</strong> {showDetail.age}</p>
              <p><strong>Gender:</strong> {showDetail.gender}</p>
              <p><strong>Contact:</strong> {showDetail.contact}</p>

              <hr />
              <h5>📅 Appointments</h5>
              {appointments.filter(a => a.patient_id === showDetail.id).length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Symptoms</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments
                      .filter(a => a.patient_id === showDetail.id)
                      .map(a => (
                        <tr key={a.id}>
                          <td>{a.slot_date || a.created_at?.split('T')[0]}</td>
                          <td>{a.start_time || 'N/A'}</td>
                          <td>{a.symptoms}</td>
                          <td>{a.notes}</td>
                          <td>{a.status}</td>
                          <td>
                            {a.meeting_link ? (
                              <a href={a.meeting_link} target="_blank" rel="noopener noreferrer">
                                Join
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientManager;
