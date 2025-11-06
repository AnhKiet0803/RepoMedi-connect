import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    cities: 0
  });

  useEffect(() => {
    // Load data from localStorage (initialized from mockData.json)
    const patients = JSON.parse(localStorage.getItem('patients') || '[]').length;
    const doctors = JSON.parse(localStorage.getItem('doctors') || '[]').length;
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]').length;
    const cities = JSON.parse(localStorage.getItem('cities') || '[]').length;

    setStats({
      patients,
      doctors,
      appointments,
      cities
    });
  }, []);

  return (
    <div className="dashboard">
      {/* Top summary cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-number">{stats.patients}</div>
          <div className="stat-label">Patients</div>
          <div className="stat-chart"></div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-number">{stats.doctors}</div>
          <div className="stat-label">Doctors</div>
          <div className="stat-chart"></div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-number">{stats.appointments}</div>
          <div className="stat-label">Appointments</div>
          <div className="stat-chart"></div>
        </div>
        <div className="stat-card red">
          <div className="stat-number">{stats.cities}</div>
          <div className="stat-label">Cities</div>
          <div className="stat-chart"></div>
        </div>
      </div>

      {/* Traffic statistics */}
      <div className="traffic-card">
        <div className="card-header">
          <h3>Traffic Statistics</h3>
          <div className="period-selector">
            <button className="active">Day</button>
            <button>Month</button>
            <button>Year</button>
          </div>
        </div>
        <div className="traffic-chart">
          <div className="chart-placeholder"></div>
        </div>
        <div className="traffic-stats">
          <div className="stat">
            <div className="label">{`${stats.patients} Patients (${Math.round((stats.patients / (stats.patients + stats.doctors || 1)) * 100)}%)`}</div>
            <div className="bar green" style={{ width: `${(stats.patients / (stats.patients + stats.doctors || 1)) * 100}%` }}></div>
          </div>
          <div className="stat">
            <div className="label">{`${stats.appointments} Appointments (${Math.round((stats.appointments / (stats.appointments + stats.patients || 1)) * 100)}%)`}</div>
            <div className="bar blue" style={{ width: `${(stats.appointments / (stats.appointments + stats.patients || 1)) * 100}%` }}></div>
          </div>
          <div className="stat">
            <div className="label">{`${stats.doctors} Doctors (${Math.round((stats.doctors / (stats.patients + stats.doctors || 1)) * 100)}%)`}</div>
            <div className="bar yellow" style={{ width: `${(stats.doctors / (stats.patients + stats.doctors || 1)) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Social summary cards */}
      <div className="social-grid">
        <div className="social-card facebook">
          <div className="numbers">{stats.patients}<span>Patients</span></div>
          <div className="chart"></div>
        </div>
        <div className="social-card twitter">
          <div className="numbers">{stats.doctors}<span>Doctors</span></div>
          <div className="chart"></div>
        </div>
        <div className="social-card linkedin">
          <div className="numbers">{stats.appointments}<span>Appointments</span></div>
          <div className="chart"></div>
        </div>
        <div className="social-card youtube">
          <div className="numbers">{stats.cities}<span>Cities</span></div>
          <div className="chart"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
