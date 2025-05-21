import React from "react";
import "./dashboard.scss";
import {
  FaUserGraduate,
  FaFileAlt,
  FaBuilding,
  FaDoorOpen,
} from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import axios from "axios";

class Dashboard extends React.Component {
  state = {
    dorms: 0,
    rooms: 0,
    students: 0,
    // accounts, revenue... nếu cần
  };

  componentDidMount() {
    this.fetchCounts();
  }

  fetchCounts = async () => {
    try {
      const [dormsRes, roomsRes, studentsRes] = await Promise.all([
        axios.get("http://localhost:5000/dashboard/count/dorms"),
        axios.get("http://localhost:5000/dashboard/count/rooms"),
        axios.get("http://localhost:5000/dashboard/count/students"),
      ]);
      this.setState({
        dorms: dormsRes.data.count,
        rooms: roomsRes.data.count,
        students: studentsRes.data.count,
      });
    } catch (err) {
      // Xử lý lỗi nếu cần
      console.error("Error fetching dashboard counts", err);
    }
  };

  render() {
    const { dorms, rooms, students } = this.state;
    return (
      <div className="content-display">
        <div className="welcome">Welcome, Admin!</div>
        <div className="dashboard-cards">
          <div className="card dorms">
            <FaBuilding className="icon" />
            <div className="info">
              <p>Total Dorms</p>
              <h3>{dorms}</h3>
            </div>
          </div>

          <div className="card rooms">
            <FaDoorOpen className="icon" />
            <div className="info">
              <p>Total Rooms</p>
              <h3>{rooms}</h3>
            </div>
          </div>

          <div className="card students">
            <FaUserGraduate className="icon" />
            <div className="info">
              <p>Registered Students</p>
              <h3>{students}</h3>
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
