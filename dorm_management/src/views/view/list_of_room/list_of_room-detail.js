import React, { Component } from "react";
import "./room-detail.scss";

class RoomDetail extends Component {
  constructor(props) {
    super(props);
    const { room_list } = props;
    this.state = {
      room_list: { ...room_list },
      isEditing: false,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      room_list: {
        ...prevState.room_list,
        [name]: value,
      },
    }));
  };

  handleSave = () => {
    const { room_list } = this.state;
    // Logic to save the updated room details (e.g., API call)
    console.log("Room updated:", room_list);
    this.setState({ isEditing: false });
  };

  handleCancel = () => {
    const { room_list } = this.props;
    this.setState({ room_list: { ...room_list }, isEditing: false });
  };

  handleEdit = () => {
    this.setState({ isEditing: true });
  };

  render() {
    const { room_list, isEditing } = this.state;
    const { onClose } = this.props;

    if (!room_list) {
      return <div>No room data available.</div>;
    }

    const { dorm, room, slot, available, price, status } = room_list;
    const displayStatus =
      typeof status === "number"
        ? status === 1
          ? "Active"
          : "Inactive"
        : status;

    return (
      <div
        className="room-detail-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="room-detail-header">
          <h1>Room Details</h1>
        </div>

        <div className="detail-content">
          <div className="room-detail-item">
            <h2>Dorm</h2>
            {isEditing ? (
              <input
                type="text"
                name="dorm"
                value={room_list.dorm}
                onChange={this.handleChange}
              />
            ) : (
              <p>{dorm}</p>
            )}
          </div>

          <div className="room-detail-item">
            <h2>Room</h2>
            {isEditing ? (
              <input
                type="text"
                name="room"
                value={room_list.room}
                onChange={this.handleChange}
              />
            ) : (
              <p>{room}</p>
            )}
          </div>

          <div className="room-detail-item">
            <h2>Beds</h2>
            {isEditing ? (
              <input
                type="number"
                name="slot"
                value={room_list.slot}
                onChange={this.handleChange}
              />
            ) : (
              <p>{slot}</p>
            )}
          </div>

          <div className="room-detail-item">
            <h2>Available</h2>
            {isEditing ? (
              <input
                type="number"
                name="available"
                value={room_list.available}
                onChange={this.handleChange}
              />
            ) : (
              <p>{available}</p>
            )}
          </div>

          <div className="room-detail-item">
            <h2>Price</h2>
            {isEditing ? (
              <input
                type="number"
                name="price"
                value={room_list.price}
                onChange={this.handleChange}
              />
            ) : (
              <p>{price}</p>
            )}
          </div>

          <div className="room-detail-item">
            <h2>Status</h2>
            {isEditing ? (
              <select
                name="status"
                value={room_list.status}
                onChange={this.handleChange}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            ) : (
              <div className={`status-badge ${displayStatus.toLowerCase()}`}>
                <span className="status-dot" />
                <span>{displayStatus}</span>
              </div>
            )}
          </div>

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

export default RoomDetail;
