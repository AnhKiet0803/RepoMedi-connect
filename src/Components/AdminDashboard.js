import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiUsers, FiLayout } from 'react-icons/fi';
import './admin.css';
import initMockData from '../Page/utils/initMockData';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleSwitchToPatient = () => {
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="brand">
          <img src="/logo192.png" alt="CoreUI" className="brand-logo" />
          <span>MediConnect</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-header">MANAGEMENT</div>
            <NavLink to="doctores" className={({ isActive }) => isActive ? 'active' : ''}>
              <FiUsers /> Doctor Manager
            </NavLink>
            <NavLink to="patientes" className={({ isActive }) => isActive ? 'active' : ''}>
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

      <div className="main">
        <header className="topbar">
          <div className="topbar-actions">
            <button className="reset-btn" onClick={() => { localStorage.clear(); initMockData(); window.location.reload(); }}>
              Reset data
            </button>
            <button className="switch-btn" onClick={handleSwitchToPatient}>
              Giao diện bệnh nhân
            </button>
            <span className="notifications">2</span>
            <img src="/logo192.png" alt="Admin" className="avatar" />
            <span>admin</span>
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