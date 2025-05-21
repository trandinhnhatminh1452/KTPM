import React, { Component } from "react";
import "./dorm_list.scss";
import axios from "axios";
import Container from "../container/container";
import DormDetail from "../view/dorm/dorm-detail";

class DormList extends Component {
  state = {
    dorm_list: [],
    error: null,
  };

  componentDidMount() {
    this.fetchDorms();
  }

  fetchDorms = () => {
    axios
      .get("http://localhost:5000/dorms")
      .then((response) => {
        this.setState({ dorm_list: response.data });
      })
      .catch((error) => {
        console.error("Error fetching dorm_list:", error);
        this.setState({ error: error.message });
      });
  };

  handleUpdate = async (updatedDorm) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/dorms/${updatedDorm.id}`,
        {
          name: updatedDorm.name,
          status: parseInt(updatedDorm.status),
        }
      );

      if (response.status === 200) {
        // Refresh the list after successful update
        this.fetchDorms();
      } else {
        throw new Error("Failed to update dorm");
      }
    } catch (error) {
      console.error("Error updating dorm:", error);
      alert("Failed to update dorm. Please try again.");
    }
  };

  handleCreate = async (newDorm) => {
    try {
      const response = await axios.post("http://localhost:5000/dorms", {
        ...newDorm,
        status: parseInt(newDorm.status),
      });

      if (response.status === 201) {
        // Refresh the list after successful creation
        this.fetchDorms();
      } else {
        throw new Error("Failed to create dorm");
      }
    } catch (error) {
      console.error("Error creating dorm:", error);
      alert("Failed to create dorm. Please try again.");
    }
  };

  render() {
    const { dorm_list, error } = this.state;

    const columns = [
      { key: "id", label: "ID", width: "10%" },
      { key: "name", label: "Dorm's name", width: "30%" },
      { key: "date_created", label: "Date Created", width: "30%" },
      { key: "status", label: "Status", width: "20%" },
    ];

    const formattedData = dorm_list
      .sort((a, b) => a.id - b.id)
      .map((dorm) => ({
        ...dorm,
        date_created: new Date(dorm.date_created).toLocaleString(),
        status: dorm.status === 1 ? "Active" : "Inactive",
      }));

    if (error) return <div>Error: {error}</div>;

    return (
      <Container
        title="danh sách ký túc xá"
        columns={columns}
        data={formattedData}
        DetailComponent={DormDetail}
        detailPropKey="dorm"
        onUpdate={this.handleUpdate}
        onCreate={this.handleCreate}
        onRefresh={this.fetchDorms}
      />
    );
  }
}

export default DormList;
