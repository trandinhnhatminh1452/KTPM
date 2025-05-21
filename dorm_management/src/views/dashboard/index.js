import React from "react";
import "./dashboard.scss";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="welcome">Welcome to Dashboard</div>
      <div className="dashboard-content">
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p>1,234</p>
          </div>
          <div className="stat-card">
            <h3>Total Rooms</h3>
            <p>100</p>
          </div>
          <div className="stat-card">
            <h3>Available Rooms</h3>
            <p>25</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>$50,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
