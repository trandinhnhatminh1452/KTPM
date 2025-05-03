import React, { Component } from "react";
import axios from "axios";
import Container from "../container/container";
import "./student_list.scss";
import StudentDetail from "../view/student-list/student-detail";

class StudentList extends Component {
  state = {
    students: [],
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000/students")
      .then((response) => {
        this.setState({ students: response.data });
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }

  render() {
    const { students } = this.state;

    const columns = [
      { key: "id", label: "ID" },
      { key: "code", label: "Code" },
      { key: "fullName", label: "Full Name" },
      { key: "department", label: "Department" },
      { key: "course", label: "Course" },
      { key: "gender", label: "Gender" },
      { key: "email", label: "Email" },
      { key: "contact", label: "Contact" },
      { key: "status", label: "Status" },
    ];

    const dataWithFullName = students.map((student) => ({
      ...student,
      fullName: `${student.firstname} ${student.middlename || ""} ${
        student.lastname
      }`.trim(),
      status: student.status === 1 ? "Active" : "Inactive",
    }));

    return (
      <Container
        title="Student List"
        columns={columns}
        data={dataWithFullName}
        DetailComponent={StudentDetail}
      />
    );
  }
}

export default StudentList;
