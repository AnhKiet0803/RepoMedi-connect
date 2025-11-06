import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const PatientManager = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', gender: '', contact: '' });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('patients') || '[]');
    setPatients(stored);
  }, []);

  const saveToStorage = updated => {
    setPatients(updated);
    localStorage.setItem('patients', JSON.stringify(updated));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      const updated = patients.map(p =>
        p.id === editingId ? { ...p, ...form } : p
      );
      saveToStorage(updated);
      setEditingId(null);
    } else {
      const newPatient = { ...form, id: Date.now() };
      saveToStorage([...patients, newPatient]);
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
    if (window.confirm('Bạn có chắc muốn xóa bệnh nhân này?')) {
      const updated = patients.filter(p => p.id !== id);
      saveToStorage(updated);
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
        <h2 className="mb-0">🧑‍💼 Quản lý Bệnh nhân</h2>
        <Button variant="primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>Thêm bệnh nhân mới
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Họ tên</th>
            <th>Tuổi</th>
            <th>Giới tính</th>
            <th>Liên hệ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={patient.id}>
              <td>{index + 1}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.contact}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(patient)}>
                  <i className="bi bi-pencil me-1"></i>Sửa
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(patient.id)}>
                  <i className="bi bi-trash me-1"></i>Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Sửa thông tin bệnh nhân' : 'Thêm bệnh nhân mới'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ tên bệnh nhân"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tuổi</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập tuổi"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <Form.Select
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
                required
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thông tin liên hệ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại hoặc email"
                value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingId ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PatientManager;