import React, { useState } from "react";
import "./App.scss";
import Dashboard from "./dashboard/dashboard";
import StudentList from "./main/student_list";
import Accounts from "./main/accounts";
import Monthly_report from "./reports/monthly_report";
import Dorm_list from "./master_list/dorm_list";
import List_of_room from "./master_list/list_of_room";
import User_list from "./maintenance/user_list";
import Setting from "./maintenance/setting";

import {
  FaUserGraduate,
  FaFileAlt,
  FaBuilding,
  FaDoorOpen,
  FaUsersCog,
  FaCog,
  FaBars,
} from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { AiFillDashboard } from "react-icons/ai";

function App() {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <StudentList />;
      case "accounts":
        return <Accounts />;
      case "monthly_report":
        return <Monthly_report />;
      case "dorm_list":
        return <Dorm_list />;
      case "room_list":
        return <List_of_room />;
      case "user_list":
        return <User_list />;
      case "setting":
        return <Setting />;
      default:
        return <div>Welcome!</div>;
    }
  };
  return (
    <div className="App">
      <div className="dms">
        <h1 className="dms-header">DMS</h1>
        <div className="dashboard" onClick={() => setSelectedMenu("dashboard")}>
          <AiFillDashboard className="icon" /> Dashboard
        </div>

        <div className="main">
          <h3>Main</h3>
          <ul>
            <li onClick={() => setSelectedMenu("students")}>
              <FaUserGraduate className="icon" /> Student List
            </li>
            <li onClick={() => setSelectedMenu("accounts")}>
              <MdAccountCircle className="icon" /> Accounts
            </li>
          </ul>
        </div>

        <div className="reports">
          <h3>Reports</h3>
          <ul>
            <li onClick={() => setSelectedMenu("monthly_report")}>
              <FaFileAlt className="icon" /> Monthly Collection Report
            </li>
          </ul>
        </div>

        <div className="master-list">
          <h3>Master List</h3>
          <ul>
            <li onClick={() => setSelectedMenu("dorm_list")}>
              <FaBuilding className="icon" /> Dorm List
            </li>
            <li onClick={() => setSelectedMenu("room_list")}>
              <FaDoorOpen className="icon" /> List of rooms
            </li>
          </ul>
        </div>

        <div className="maintenance">
          <h3>Maintenance</h3>
          <ul>
            <li onClick={() => setSelectedMenu("user_list")}>
              <FaUsersCog className="icon" /> User List
            </li>
            <li onClick={() => setSelectedMenu("setting")}>
              <FaCog className="icon" /> Setting
            </li>
          </ul>
        </div>
      </div>

      <div className="header">
        <div className="header-right">
          <FaBars className="icon" />
          <span>Dormitory Management</span>
        </div>
        <div className="header-left">
          <span>Account</span>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}

export default App;
