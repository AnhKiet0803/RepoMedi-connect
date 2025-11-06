import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Badge } from 'react-bootstrap';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    avatar: '',
    email_verified_at: '',
    active: true
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  }, []);

  const saveToUsersStorage = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const saveToPatientsStorage = (newPatient) => {
    // load existing patients
    const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    // add new patient
    const updatedPatients = [...storedPatients, newPatient];
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // edit existing user
      const updated = users.map(u =>
        u.id === editingId ? { ...u, ...form, updated_at: new Date().toISOString() } : u
      );
      saveToUsersStorage(updated);
    } else {
      // add new user
      const newUser = {
        ...form,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const updatedUsers = [...users, newUser];
      saveToUsersStorage(updatedUsers);

      // nếu role là patient thì thêm vào bảng patients
      if (newUser.role === 'patient') {
        // bạn có thể định nghĩa patient object phù hợp
        const newPatient = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          gender: newUser.gender || '',        // nếu bạn có gender trong form
          dob: newUser.dob || '',              // nếu bạn có dob trong form
          created_at: newUser.created_at,
          updated_at: newUser.updated_at
        };
        saveToPatientsStorage(newPatient);
      }
    }

    // reset form
    setForm({
      name: '',
      email: '',
      password: '',
      role: '',
      phone: '',
      avatar: '',
      email_verified_at: '',
      active: true
    });
    setShowModal(false);
    setEditingId(null);
  };

  const handleEdit = (u) => {
    setForm({ ...u });
    setEditingId(u.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      const updated = users.filter(u => u.id !== id);
      saveToUsersStorage(updated);
      // **Optional**: nếu user bị xóa và role là patient, cũng nên xóa khỏi patients
      const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
      const updatedPatients = storedPatients.filter(p => p.id !== id);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    }
  };

  const toggleActive = (id) => {
    const updated = users.map(u =>
      u.id === id ? { ...u, active: !u.active, updated_at: new Date().toISOString() } : u
    );
    saveToUsersStorage(updated);
  };

  const handleAdd = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      role: '',
      phone: '',
      avatar: '',
      email_verified_at: '',
      active: true
    });
    setEditingId(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({
      name: '',
      email: '',
      password: '',
      role: '',
      phone: '',
      avatar: '',
      email_verified_at: '',
      active: true
    });
    setEditingId(null);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">👥 Quản lý Tài khoản người dùng</h2>
        <Button variant="primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>Thêm người dùng mới
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Điện thoại</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u.id}>
              <td>{idx + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.phone || '-'}</td>
              <td>
                <Badge bg={u.active ? 'success' : 'danger'}>
                  {u.active ? 'Hoạt động' : 'Ngưng hoạt động'}
                </Badge>
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(u)}>
                  <i className="bi bi-pencil me-1"></i>Sửa
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>
                  <i className="bi bi-trash me-1"></i>Xóa
                </Button>
                <Button variant="info" size="sm" onClick={() => toggleActive(u.id)}>
                  <i className="bi bi-toggle-on me-1"></i>Toggle
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Sửa người dùng' : 'Thêm người dùng mới'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Họ & tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required={!editingId}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                required
              >
                <option value="">-- Chọn vai trò --</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Avatar (URL)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập đường dẫn avatar"
                value={form.avatar}
                onChange={e => setForm({ ...form, avatar: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái hoạt động</Form.Label>
              <Form.Select
                value={form.active ? 'true' : 'false'}
                onChange={e => setForm({ ...form, active: e.target.value === 'true' })}
              >
                <option value="true">Hoạt động</option>
                <option value="false">Ngưng hoạt động</option>
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

export default UserManager;