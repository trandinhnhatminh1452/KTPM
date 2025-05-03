import React, { Component } from "react";
import "./user_list.scss";
import axios from "axios";
import Container from "../container/container";
import UserDetail from "../view/User/user-detail";

class User extends Component {
  state = {
    user: [],
    error: null,
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000/users")
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        this.setState({ error: error.message });
      });
  }

  render() {
    const { user, error } = this.state;

    const columns = [
      { key: "id", label: "ID" },
      { key: "username", label: "User Name" },
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "date_updated", label: "Date Updated" },
    ];

    const formattedData = user.map((user) => ({
      ...user,
      name: `${user.firstname} ${user.middlename || ""} ${
        user.lastname
      }`.trim(),
      date_updated: new Date(user.date_updated).toLocaleString(),
      type: user.type === 1 ? "Admin" : user.type === 2 ? "Staff" : "Unknown",
    }));

    if (error) return <div>Error: {error}</div>;

    return (
      <Container
        title="User List"
        columns={columns}
        data={formattedData}
        DetailComponent={UserDetail}
      />
    );
  }
}

export default User;
