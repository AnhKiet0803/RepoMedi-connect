import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiUsers, FiLayout } from 'react-icons/fi';
import './admin.css';
import initMockData from '../utils/initMockData';
import DoctorManager from '../Page/admin/DoctorManager';
import PatientManager from '../Page/admin/PatientManager';
import UserManager from '../Page/admin/UserManager';
import ContentManager from '../Page/admin/ContentManager';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleSwitchToPatient = () => {
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <img src="/logo192.png" alt="MediConnect" className="brand-logo" />
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = '/admin'}
          >
            MediConnect
          </span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-header">MANAGEMENT</div>
            <NavLink to="doctors" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUsers /> Doctor Manager
            </NavLink>
            <NavLink to="patients" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUsers /> Patient Manager
            </NavLink>
            <NavLink to="users" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUsers /> User Manager
            </NavLink>
            <NavLink to="content" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiLayout /> Content Manager
            </NavLink>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main">
        <header className="navbar navbar-expand-lg bg-light border-bottom px-3 py-2">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <img src="/logo192.png" alt="Admin" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
              <span className="fw-bold text-primary">Admin</span>
            </div>

            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleSwitchToPatient}
              >
                Switch to Patient View
              </button>

              <span className="badge bg-warning text-dark">2</span>
            </div>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
