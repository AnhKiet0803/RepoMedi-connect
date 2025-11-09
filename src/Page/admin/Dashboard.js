import React, { useState, useEffect } from "react";
import mockData from "../../data/mockData.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
  });

  useEffect(() => {
    // Load directly from mockData.json
    const patients = mockData.patients?.length || 0;
    const doctors = mockData.doctors?.length || 0;
    const appointments = mockData.appointments?.length || 0;

    setStats({
      patients,
      doctors,
      appointments,
    });
  }, []);

  const trafficData = [
    { name: "Patients", value: stats.patients },
    { name: "Doctors", value: stats.doctors },
    { name: "Appointments", value: stats.appointments },
  ];

  return (
    <div className="dashboard p-4">
      {/* Summary Cards */}
      <div className="stats-grid d-flex flex-wrap gap-3 mb-4">
        <div className="stat-card bg-primary text-white flex-fill p-4 rounded shadow-sm text-center">
          <h2>{stats.patients}</h2>
          <p className="mb-0">Patients</p>
        </div>
        <div className="stat-card bg-info text-white flex-fill p-4 rounded shadow-sm text-center">
          <h2>{stats.doctors}</h2>
          <p className="mb-0">Doctors</p>
        </div>
        <div className="stat-card bg-warning text-white flex-fill p-4 rounded shadow-sm text-center">
          <h2>{stats.appointments}</h2>
          <p className="mb-0">Appointments</p>
        </div>
      </div>

      {/* Traffic Statistics */}
      <div className="traffic-card bg-white rounded shadow-sm p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">📊 Traffic Statistics</h3>
          <div className="btn-group">
            <button className="btn btn-outline-secondary btn-sm active">
              Day
            </button>
            <button className="btn btn-outline-secondary btn-sm">Month</button>
            <button className="btn btn-outline-secondary btn-sm">Year</button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={trafficData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 14 }} />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#0d6efd"
              barSize={60}
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Social Summary Cards */}
      <div className="social-grid d-flex flex-wrap gap-3">
        <div className="social-card bg-primary text-white flex-fill p-4 rounded text-center">
          <h4>Patients</h4>
          <h2>{stats.patients}</h2>
        </div>
        <div className="social-card bg-info text-white flex-fill p-4 rounded text-center">
          <h4>Doctors</h4>
          <h2>{stats.doctors}</h2>
        </div>
        <div className="social-card bg-warning text-white flex-fill p-4 rounded text-center">
          <h4>Appointments</h4>
          <h2>{stats.appointments}</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
