import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    cities: 0
  });

  useEffect(() => {
    // Lấy dữ liệu từ localStorage (đã được khởi tạo từ mockData.json)
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
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-number">{stats.patients}</div>
          <div className="stat-label">Bệnh nhân</div>
          <div className="stat-chart"></div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-number">{stats.doctors}</div>
          <div className="stat-label">Bác sĩ</div>
          <div className="stat-chart"></div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-number">{stats.appointments}</div>
          <div className="stat-label">Lịch khám</div>
          <div className="stat-chart"></div>
        </div>
      </div>
      
      <div className="traffic-card">
        <div className="card-header">
          <h3>Thống kê truy cập</h3>
          <div className="period-selector">
            <button className="active">Ngày</button>
            <button>Tháng</button>
            <button>Năm</button>
          </div>
        </div>
        <div className="traffic-chart">
          <div className="chart-placeholder"></div>
        </div>
        <div className="traffic-stats">
          <div className="stat">
            <div className="label">{`${stats.patients} Bệnh nhân (${Math.round((stats.patients / (stats.patients + stats.doctors)) * 100)}%)`}</div>
            <div className="bar green" style={{ width: `${(stats.patients / (stats.patients + stats.doctors)) * 100}%` }}></div>
          </div>
          <div className="stat">
            <div className="label">{`${stats.appointments} Lượt khám (${Math.round((stats.appointments / (stats.appointments + stats.patients)) * 100)}%)`}</div>
            <div className="bar blue" style={{ width: `${(stats.appointments / (stats.appointments + stats.patients)) * 100}%` }}></div>
          </div>
          <div className="stat">
            <div className="label">{`${stats.doctors} Bác sĩ (${Math.round((stats.doctors / (stats.patients + stats.doctors)) * 100)}%)`}</div>
            <div className="bar yellow" style={{ width: `${(stats.doctors / (stats.patients + stats.doctors)) * 100}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="social-grid">
        <div className="social-card facebook">
          <div className="numbers">{stats.patients}<span>Bệnh nhân</span></div>
          <div className="chart"></div>
        </div>
        <div className="social-card twitter">
          <div className="numbers">{stats.doctors}<span>Bác sĩ</span></div>
          <div className="chart"></div>
        </div>
        <div className="social-card linkedin">
          <div className="numbers">{stats.appointments}<span>Cuộc hẹn</span></div>
          <div className="chart"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;