import React, { Component } from "react";
import "./dorm_list.scss";
import axios from "axios";
import Container from "../container/container";
import DormDetail from "../view/dorm/dorm-detail";

class DormList extends Component {
  state = {
    dorm_list: [], // State should be 'dorm_list'
    error: null,
  };

  componentDidMount() {
    axios
      .get("http://localhost:5000/dorms")
      .then((response) => {
        this.setState({ dorm_list: response.data });
      })
      .catch((error) => {
        console.error("Error fetching dorm_list:", error);
        this.setState({ error: error.message });
      });
  }

  render() {
    const { dorm_list, error } = this.state;

    const columns = [
      { key: "id", label: "ID", width: "10%" },
      { key: "name", label: "Dorm's name", width: "30%" },
      { key: "date_created", label: "Date Created", width: "30%" },
      { key: "status", label: "Status", width: "20%" },
    ];

    const formattedData = dorm_list.map((dorm) => ({
      ...dorm,
      date_created: new Date(dorm.date_created).toLocaleString(),
      status: dorm.status === 1 ? "Active" : "Inactive",
    }));

    if (error) return <div>Error: {error}</div>;

    return (
      <Container
        title="Dormitory List"
        columns={columns}
        data={formattedData}
        DetailComponent={DormDetail}
        detailPropKey="dorm"
        onCreate={this.handleCreate}
      />
    );
  }
}

export default DormList;
