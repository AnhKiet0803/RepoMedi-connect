// src/admin/DoctorManager.js
import React, { useState } from 'react';
import { Modal, Button, Form, Table, Badge } from 'react-bootstrap';
import mockData from '../../data/mockData.json';

const DoctorManager = () => {
  // ====== LOAD DATA ======
  const [doctors, setDoctors] = useState(mockData.doctors || []);
  const [specialties] = useState(mockData.specialties || []);
  const [users] = useState(mockData.users || []);
  const [appointments] = useState(mockData.appointments || []);

  // ====== FILTER STATES ======
  const [filterText, setFilterText] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // ====== FORM STATES ======
  const [form, setForm] = useState({
    user_id: '',
    specialty_id: '',
    license_number: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ====== DETAIL MODAL ======
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailDoctor, setDetailDoctor] = useState(null);

  // ====== VALIDATE FUNCTION ======
  const validateForm = () => {
    const newErrors = {};

    if (!form.user_id) newErrors.user_id = 'Please select a doctor user.';
    if (!form.specialty_id) newErrors.specialty_id = 'Please select a specialty.';
    if (!form.license_number.trim())
      newErrors.license_number = 'License number is required.';
    else if (form.license_number.length < 5)
      newErrors.license_number = 'License number must be at least 5 characters.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====== CRUD HANDLERS ======
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return; // ⛔ validate trước khi submit

    if (editingId) {
      // Update existing doctor
      const updated = doctors.map(d =>
        d.id === editingId ? { ...d, ...form } : d
      );
      setDoctors(updated);
    } else {
      // Add new doctor
      const newDoctor = { ...form, id: Date.now() };
      setDoctors([...doctors, newDoctor]);
    }

    // Reset
    setForm({ user_id: '', specialty_id: '', license_number: '', status: 'active' });
    setErrors({});
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (doctor) => {
    setForm({
      user_id: doctor.user_id || '',
      specialty_id: doctor.specialty_id || '',
      license_number: doctor.license_number || '',
      status: doctor.status || 'active'
    });
    setEditingId(doctor.id);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const handleAdd = () => {
    setForm({ user_id: '', specialty_id: '', license_number: '', status: 'active' });
    setErrors({});
    setEditingId(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setForm({ user_id: '', specialty_id: '', license_number: '', status: 'active' });
    setErrors({});
    setEditingId(null);
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    const updated = doctors.map(d =>
      d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
    );
    setDoctors(updated);
  };

  // ====== DETAIL MODAL ======
  const handleShowDetail = (doctor) => {
    setDetailDoctor(doctor);
    setShowDetailModal(true);
  };

  const handleDetailClose = () => {
    setDetailDoctor(null);
    setShowDetailModal(false);
  };

  // ====== HELPERS ======
  const getUserName = (userId) => {
    const u = users.find(u => u.id === Number(userId));
    return u ? u.name : 'Unknown';
  };

  const getSpecialtyName = (specId) => {
    const sp = specialties.find(s => s.id === Number(specId));
    return sp ? sp.name : 'Unknown';
  };

  const doctorUsers = users.filter(u => u.role === 'doctor');

  // ====== FILTER LOGIC ======
  const filteredDoctors = doctors.filter(d => {
    const doctorName = d.user_id
      ? (users.find(u => u.id === Number(d.user_id))?.name || '')
      : (d.name || '');

    const specialtyName = d.specialty || getSpecialtyName(d.specialty_id) || '';
    const doctorStatus = d.status || '';

    const matchesText =
      !filterText ||
      doctorName.toLowerCase().includes(filterText.toLowerCase()) ||
      specialtyName.toLowerCase().includes(filterText.toLowerCase());

    const matchesSpec =
      !filterSpecialty ||
      specialtyName.toLowerCase().trim() === filterSpecialty.toLowerCase().trim();

    const matchesStatus =
      !filterStatus ||
      doctorStatus.toLowerCase().trim() === filterStatus.toLowerCase().trim();

    return matchesText && matchesSpec && matchesStatus;
  });

  // ====== RENDER ======
  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">🩺 Doctor Management</h2>
        <Button variant="primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>Add New Doctor
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <Form.Control
          type="text"
          placeholder="Search by doctor name or specialty..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          style={{ maxWidth: '230px' }}
        />
        <Form.Select
          value={filterSpecialty}
          onChange={e => setFilterSpecialty(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">-- All Specialties --</option>
          {specialties.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </Form.Select>
        <Form.Select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">-- All Statuses --</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Form.Select>
      </div>

      {/* Doctor Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Doctor Name</th>
            <th>Specialty</th>
            <th>License Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor, idx) => (
              <tr key={doctor.id}>
                <td>{idx + 1}</td>
                <td>{doctor.user_id ? getUserName(doctor.user_id) : (doctor.name || '—')}</td>
                <td>{doctor.specialty_id ? getSpecialtyName(doctor.specialty_id) : (doctor.specialty || '—')}</td>
                <td>{doctor.license_number || '—'}</td>
                <td>
                  <Badge bg={doctor.status === 'active' ? 'success' : 'danger'}>
                    {doctor.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>{' '}
                  <Button variant="link" size="sm" onClick={() => toggleStatus(doctor.id)}>
                    (Toggle)
                  </Button>
                </td>
                <td>
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleShowDetail(doctor)}>
                    <i className="bi bi-eye me-1"></i>Details
                  </Button>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(doctor)}>
                    <i className="bi bi-pencil me-1"></i>Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(doctor.id)}>
                    <i className="bi bi-trash me-1"></i>Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-muted">No doctors found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal Add/Edit */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Doctor' : 'Add New Doctor'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Doctor (User)</Form.Label>
              <Form.Select
                value={form.user_id}
                onChange={e => setForm({ ...form, user_id: e.target.value })}
                isInvalid={!!errors.user_id}
              >
                <option value="">-- Select Doctor User --</option>
                {doctorUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.user_id}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specialty</Form.Label>
              <Form.Select
                value={form.specialty_id}
                onChange={e => setForm({ ...form, specialty_id: e.target.value })}
                isInvalid={!!errors.specialty_id}
              >
                <option value="">-- Select Specialty --</option>
                {specialties.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.specialty_id}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>License Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter license number"
                value={form.license_number}
                onChange={e => setForm({ ...form, license_number: e.target.value })}
                isInvalid={!!errors.license_number}
              />
              <Form.Control.Feedback type="invalid">{errors.license_number}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingId ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Details */}
      <Modal show={showDetailModal} onHide={handleDetailClose}>
        <Modal.Header closeButton>
          <Modal.Title>Doctor Details</Modal.Title>
        </Modal.Header>
        {detailDoctor && (
          <Modal.Body>
            <p><strong>Name:</strong> {detailDoctor.user_id ? getUserName(detailDoctor.user_id) : detailDoctor.name}</p>
            <p><strong>Specialty:</strong> {detailDoctor.specialty_id ? getSpecialtyName(detailDoctor.specialty_id) : detailDoctor.specialty}</p>
            <p><strong>License Number:</strong> {detailDoctor.license_number}</p>
            <p><strong>Status:</strong> {detailDoctor.status === 'active' ? 'Active' : 'Inactive'}</p>

            <h5>Appointments</h5>
            <ul>
              {appointments
                .filter(a => a.doctor_id === detailDoctor.id)
                .map(a => (
                  <li key={a.id}>
                    Slot: {a.slot_id} – Patient: {a.patient_id}
                  </li>
                ))}
            </ul>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDetailClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorManager;
