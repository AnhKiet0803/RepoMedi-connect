import React, { useState } from 'react';
import { Modal, Button, Form, Table, Badge } from 'react-bootstrap';
import mockData from '../../data/mockData.json';

const DoctorManager = () => {
  // Lấy dữ liệu từ mockData
  const [doctors, setDoctors] = useState(mockData.doctors || []);
  const [specialties] = useState(mockData.specialties || []);
  const [users] = useState(mockData.users || []);

  // Form state
  const [form, setForm] = useState({
    user_id: '',
    specialty_id: '',
    license_number: '',
    status: 'active'
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updated = doctors.map(d => 
        d.id === editingId ? { ...d, ...form } : d
      );
      setDoctors(updated);
    } else {
      const newDoctor = { ...form, id: Date.now() };
      setDoctors([...doctors, newDoctor]);
    }
    setForm({ user_id: '', specialty_id: '', license_number: '', status: 'active' });
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
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bác sĩ này?')) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const handleAdd = () => {
    setForm({ user_id: '', specialty_id: '', license_number: '', status: 'active' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setForm({ user_id: '', specialty_id: '', license_number: '', status: 'active' });
    setEditingId(null);
    setShowModal(false);
  };

  const getUserName = (userId) => {
    const u = users.find(u => u.id === Number(userId));
    return u ? u.name : 'Không xác định';
  };

  const getSpecialtyName = (specId) => {
    const sp = specialties.find(s => s.id === Number(specId));
    return sp ? sp.name : 'Không xác định';
  };

  // Lọc user có role doctor nếu bạn muốn dropdown chọn
  const doctorUsers = users.filter(u => u.role === 'doctor');

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">👨‍⚕️ Quản lý Bác sĩ</h2>
        <Button variant="primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>Thêm bác sĩ mới
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên bác sĩ</th>
            <th>Chuyên khoa</th>
            <th>Số giấy phép</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor, idx) => (
            <tr key={doctor.id}>
              <td>{idx + 1}</td>
              <td>{ doctor.user_id ? getUserName(doctor.user_id) : (doctor.name || '—') }</td>
              <td>{ doctor.specialty_id ? getSpecialtyName(doctor.specialty_id) : (doctor.specialty || '—') }</td>
              <td>{doctor.license_number || '—'}</td>
              <td>
                <Badge bg={ (doctor.status && doctor.status.toLowerCase() === 'active') ? 'success' : 'danger' }>
                  { (doctor.status && doctor.status.toLowerCase() === 'active') ? 'Hoạt động' : 'Ngưng hoạt động' }
                </Badge>
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(doctor)}>
                  <i className="bi bi-pencil me-1"></i>Sửa
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(doctor.id)}>
                  <i className="bi bi-trash me-1"></i>Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Sửa thông tin bác sĩ' : 'Thêm bác sĩ mới'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Bác sĩ (User)</Form.Label>
              <Form.Select
                value={form.user_id}
                onChange={e => setForm({ ...form, user_id: e.target.value })}
                required
              >
                <option value="">-- Chọn bác sĩ (user) --</option>
                {doctorUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chuyên khoa</Form.Label>
              <Form.Select
                value={form.specialty_id}
                onChange={e => setForm({ ...form, specialty_id: e.target.value })}
                required
              >
                <option value="">-- Chọn chuyên khoa --</option>
                {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số giấy phép hành nghề</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số giấy phép"
                value={form.license_number}
                onChange={e => setForm({ ...form, license_number: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                required
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngưng hoạt động</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Hủy</Button>
            <Button variant="primary" type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorManager;