import React, { Component } from "react";
import axios from "axios";
import "./student-detail.scss";

class StudentDetail extends Component {
  constructor(props) {
    super(props);
    const { fullName } = props.item;

    // Tách fullName thành firstName, middleName, lastName nếu chưa có
    const [firstName, middleName = "", lastName] = fullName.split(" ");

    this.state = {
      student: {
        ...props.item,
        firstName,
        middleName,
        lastName,
      },
      isEditing: false, // Trạng thái khi nào đang sửa
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      student: {
        ...prevState.student,
        [name]: value, // Cập nhật giá trị của trường đang thay đổi
      },
    }));
  };

  handleSave = () => {
    const { student } = this.state;

    // Ghép lại firstName, middleName và lastName thành fullName
    const fullName =
      `${student.firstName} ${student.middleName} ${student.lastName}`.trim();

    // Cập nhật lại fullName trước khi gửi request
    const updatedStudent = {
      ...student,
      fullName, // Đảm bảo fullName được cập nhật
    };

    console.log("Saving student:", updatedStudent);

    // Gửi PUT request để cập nhật thông tin sinh viên trong cơ sở dữ liệu
    axios
      .put(
        `http://localhost:5000/students/${updatedStudent.code}`,
        updatedStudent
      )
      .then((response) => {
        console.log("Student details updated:", response.data);
        this.setState({ isEditing: false });
      })
      .catch((error) => {
        console.error("Error updating student:", error);
      });
  };

  handleEdit = () => {
    this.setState({ isEditing: true });
  };

  handleCancel = () => {
    this.setState({ isEditing: false });
  };

  render() {
    const { student, isEditing } = this.state;
    const { onClose } = this.props;

    if (!student) {
      return <div>No student data available.</div>;
    }

    return (
      <div className="detail-container">
        {/* Header */}
        <div className="detail-header">
          <h1>Student Details</h1>
          <div className="status-badge">
            <span
              className={`status-dot ${
                student.status === "Active" ? "active" : "inactive"
              }`}
            />
            <span>{student.status}</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="detail-form">
          {/* School Details */}
          <div className="detail-section">
            <h2>School Details</h2>
            <div className="info-group">
              <div className="info-item">
                <span className="label">School ID/Code</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="code"
                    value={student.code}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.code}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Department</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={student.department}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.department}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Course</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="course"
                    value={student.course}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.course}</span>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="detail-section">
            <h2>Personal Information</h2>
            <div className="info-group">
              {isEditing ? (
                <>
                  <div className="info-item">
                    <span className="label">First Name</span>
                    <input
                      type="text"
                      name="firstName"
                      value={student.firstName}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="info-item">
                    <span className="label">Middle Name</span>
                    <input
                      type="text"
                      name="middleName"
                      value={student.middleName}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="info-item">
                    <span className="label">Last Name</span>
                    <input
                      type="text"
                      name="lastName"
                      value={student.lastName}
                      onChange={this.handleChange}
                    />
                  </div>
                </>
              ) : (
                <div className="info-item">
                  <span className="label">Name</span>
                  <span className="value">{student.fullName}</span>
                </div>
              )}
              <div className="info-item">
                <span className="label">Gender</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="gender"
                    value={student.gender}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.gender}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Contact #</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="contact"
                    value={student.contact}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.contact}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Email</span>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={student.email}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.email}</span>
                )}
              </div>
              <div className="info-item full-width">
                <span className="label">Address</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={student.address}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.address}</span>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Details */}
          <div className="detail-section">
            <h2>Emergency Details</h2>
            <div className="info-group">
              <div className="info-item">
                <span className="label">Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergency_name"
                    value={student.emergency_name}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.emergency_name}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Contact #</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergency_contact"
                    value={student.emergency_contact}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.emergency_contact}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Relation</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergency_relation"
                    value={student.emergency_relation}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.emergency_relation}</span>
                )}
              </div>
              <div className="info-item full-width">
                <span className="label">Address</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergency_address"
                    value={student.emergency_address}
                    onChange={this.handleChange}
                  />
                ) : (
                  <span className="value">{student.emergency_address}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            {isEditing ? (
              <>
                <button className="btn save" onClick={this.handleSave}>
                  💾 Save
                </button>
                <button className="btn cancel" onClick={this.handleCancel}>
                  ❌ Cancel
                </button>
              </>
            ) : (
              <button className="btn edit" onClick={this.handleEdit}>
                ✏️ Edit
              </button>
            )}
            <button className="btn close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default StudentDetail;
