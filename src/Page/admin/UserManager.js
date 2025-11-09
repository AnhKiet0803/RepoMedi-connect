// src/admin/UserManager.js
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
    email_verified_at: '',
    active: true
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterActive, setFilterActive] = useState('all');

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  }, []);

  const saveToUsersStorage = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const saveToPatientsStorage = (newPatient) => {
    const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    const updatedPatients = [...storedPatients, newPatient];
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updated = users.map(u =>
        u.id === editingId ? { ...u, ...form, updated_at: new Date().toISOString() } : u
      );
      saveToUsersStorage(updated);
    } else {
      const newUser = {
        ...form,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const updatedUsers = [...users, newUser];
      saveToUsersStorage(updatedUsers);

      if (newUser.role === 'patient') {
        const newPatient = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          gender: newUser.gender || '',
          dob: newUser.dob || '',
          created_at: newUser.created_at,
          updated_at: newUser.updated_at
        };
        saveToPatientsStorage(newPatient);
      }
    }

    setForm({
      name: '',
      email: '',
      password: '',
      role: '',
      phone: '',
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
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updated = users.filter(u => u.id !== id);
      saveToUsersStorage(updated);
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
      email_verified_at: '',
      active: true
    });
    setEditingId(null);
  };

  const filteredUsers = users.filter(u => {
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchActive =
      filterActive === 'all' ||
      (filterActive === 'active' && u.active) ||
      (filterActive === 'inactive' && !u.active);
    return matchRole && matchActive;
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">👥 User Account Management</h2>
        <Button variant="primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>Add New User
        </Button>
      </div>

      <div className="d-flex gap-3 mb-3">
        <Form.Select
          style={{ width: '200px' }}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
        </Form.Select>

        <Form.Select
          style={{ width: '200px' }}
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Form.Select>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, idx) => (
            <tr key={u.id}>
              <td>{idx + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.phone || '-'}</td>
              <td>
                <Badge bg={u.active ? 'success' : 'danger'}>
                  {u.active ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(u)}>
                  <i className="bi bi-pencil me-1"></i>Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>
                  <i className="bi bi-trash me-1"></i>Delete
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
          <Modal.Title>{editingId ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required={!editingId}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                required
              >
                <option value="">-- Select role --</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Active status</Form.Label>
              <Form.Select
                value={form.active ? 'true' : 'false'}
                onChange={e => setForm({ ...form, active: e.target.value === 'true' })}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit">{editingId ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManager;
