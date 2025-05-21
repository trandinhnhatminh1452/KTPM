import React from "react";
import "./account-list.scss";
import Container from "../../container/container";

const Accounts = () => {
  const columns = [
    { key: "id", label: "ID", width: "10%" },
    { key: "username", label: "Username", width: "20%" },
    { key: "email", label: "Email", width: "30%" },
    { key: "role", label: "Role", width: "20%" },
    { key: "status", label: "Status", width: "20%" },
  ];

  const data = [
    {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      role: "Administrator",
      status: "Active",
    },
    {
      id: 2,
      username: "user1",
      email: "user1@example.com",
      role: "User",
      status: "Active",
    },
  ];

  return <Container title="Account List" columns={columns} data={data} />;
};

export default Accounts;
