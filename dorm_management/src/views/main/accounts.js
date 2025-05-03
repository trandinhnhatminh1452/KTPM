import React, { Component } from "react";
import "./accounts.scss";
import axios from "axios";
import Container from "../container/container";
import AccountDetail from "../view/account/account-detail";

class Accounts extends Component {
  state = {
    accounts: [],
    error: null,
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000/accounts") // API trả về: id, code, firstname, middlename, lastname, dorm, room, status, date_created
      .then((response) => {
        this.setState({ accounts: response.data });
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
        this.setState({ error: error.message });
      });
  }

  render() {
    const { accounts, error } = this.state;

    const columns = [
      { key: "id", label: "ID" },
      { key: "code", label: "Code" },
      { key: "name", label: "Name" },
      { key: "dorm", label: "Dorm" },
      { key: "room", label: "Room" },
      { key: "status", label: "Status" },
      { key: "date_created", label: "Date Created" },
    ];

    const formattedData = accounts.map((acc) => ({
      ...acc,
      name: `${acc.firstname} ${acc.middlename || ""} ${acc.lastname}`.trim(),
      status: acc.status === "Active" ? "Active" : "Inactive",

      date_created: new Date(acc.date_created).toLocaleString(),
    }));

    if (error) return <div>Error: {error}</div>;

    return (
      <Container
        title="Account List"
        columns={columns}
        data={formattedData}
        DetailComponent={AccountDetail}
      />
    );
  }
}

export default Accounts;
