import React, { useState } from "react";
import "./student-detail.scss";
import axios from "axios";

const StudentDetail = ({ student, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: student.firstName || "",
    middleName: student.middleName || "",
    lastName: student.lastName || "",
    code: student.code || "",
    department: student.department || "",
    course: student.course || "",
    status: student.status || 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/students/${student.id}`,
        formData
      );
      onUpdate(response.data);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="student-detail">
      <div className="detail-content">
        <h2>Student Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Student Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDetail;
