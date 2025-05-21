import React, { Component } from "react";
import "./list_of_room.scss";
import axios from "axios";
import Container from "../container/container";
import RoomDetail from "../view/list_of_room/list_of_room-detail";

class ListOfRoom extends Component {
  state = {
    list_of_room: [],
    error: null,
  };

  componentDidMount() {
    this.fetchRooms();
  }

  fetchRooms = () => {
    axios
      .get("http://localhost:5000/rooms") // API trả về: id, code, firstname, middlename, lastname, list_of_room, room, status, date_created
      .then((response) => {
        this.setState({ list_of_room: response.data });
      })
      .catch((error) => {
        console.error("Error fetching list_of_room:", error);
        this.setState({ error: error.message });
      });
  };

  handleUpdate = async (updatedRoom) => {
    try {
      console.log("Updating room with data:", updatedRoom);

      const response = await axios.put(
        `http://localhost:5000/rooms/${updatedRoom.room_id}`,
        {
          dorm: updatedRoom.dorm,
          room: updatedRoom.room,
          slot: parseInt(updatedRoom.slot),
          price: parseFloat(updatedRoom.price),
          status: parseInt(updatedRoom.status),
        }
      );

      console.log("Update response:", response);

      if (response.status === 200) {
        this.fetchRooms();
      } else {
        throw new Error(`Failed to update room: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating room:", error.response || error);
      alert(
        `Failed to update room: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  render() {
    const { list_of_room, error } = this.state;

    const columns = [
      { key: "room_id", label: "Room ID", width: "10%" },
      { key: "dorm", label: "Dorm", width: "20%" },
      { key: "room", label: "Room", width: "15%" },
      { key: "slot", label: "Slots", width: "10%" },
      { key: "available", label: "Available", width: "10%" },
      { key: "price", label: "Price", width: "10%" },
      { key: "date_created", label: "Date Created", width: "15%" },
      { key: "status", label: "Status", width: "10%" },
    ];

    const formattedData = list_of_room.map((room) => ({
      ...room,
      date_created: new Date(room.date_created).toLocaleString(),
      status: room.status === 1 ? "Active" : "Inactive",
    }));

    if (error) return <div>Error: {error}</div>;

    return (
      <Container
        title="danh sách phòng"
        columns={columns}
        data={formattedData}
        DetailComponent={RoomDetail}
        detailPropKey="room_list"
        onUpdate={this.handleUpdate}
        onCreate={this.handleCreate}
        onRefresh={this.fetchRooms}
      />
    );
  }
}

export default ListOfRoom;
