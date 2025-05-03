import React from "react";
import "./dashboard.scss";
import {
  FaUserGraduate,
  FaFileAlt,
  FaBuilding,
  FaDoorOpen,
} from "react-icons/fa";

import { MdAccountCircle } from "react-icons/md";

class Dashboard extends React.Component {
  render() {
    return (
      <div className="content-display">
        <div className="welcome">Welcome, Admin!</div>
        <div className="dashboard-cards">
          <div className="card dorms">
            <FaBuilding className="icon" />
            <div className="info">
              <p>Total Dorms</p>
              <h3>4</h3>
            </div>
          </div>

          <div className="card rooms">
            <FaDoorOpen className="icon" />
            <div className="info">
              <p>Total Rooms</p>
              <h3>6</h3>
            </div>
          </div>

          <div className="card students">
            <FaUserGraduate className="icon" />
            <div className="info">
              <p>Registered Students</p>
              <h3>2</h3>
            </div>
          </div>

          <div className="card accounts">
            <MdAccountCircle className="icon" />
            <div className="info">
              <p>Total Active Accounts</p>
              <h3>1</h3>
            </div>
          </div>

          <div className="card revenue">
            <FaFileAlt className="icon" />
            <div className="info">
              <p>This Month Total Collection</p>
              <h3>8,500.00</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
