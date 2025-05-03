import React, { Component } from "react";
import "./dorm-detail.scss";

class DormDetail extends Component {
  constructor(props) {
    super(props);
    const { dorm } = props;
    this.state = {
      dorm: { ...dorm },
      isEditing: false,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      dorm: {
        ...prevState.dorm,
        [name]: value,
      },
    }));
  };

  handleSave = () => {
    const { dorm } = this.state;
    // Logic to save the updated dorm details (e.g., API call)
    console.log("Dorm updated:", dorm);
    this.setState({ isEditing: false });
  };

  handleCancel = () => {
    const { dorm } = this.props;
    this.setState({ dorm: { ...dorm }, isEditing: false });
  };

  handleEdit = () => {
    this.setState({ isEditing: true });
  };

  render() {
    const { dorm, isEditing } = this.state;
    const { onClose } = this.props;

    if (!dorm) {
      return <div>No dorm data available.</div>;
    }

    const { name, status } = dorm;
    const displayStatus =
      typeof status === "number"
        ? status === 1
          ? "Active"
          : "Inactive"
        : status;

    return (
      <div
        className="dorm-detail-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dorm-detail-header">
          <h1>Dormitory Details</h1>
        </div>

        <div className="detail-content">
          <div className="dorm-detail-item">
            <h2>Name</h2>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={dorm.name}
                onChange={this.handleChange}
              />
            ) : (
              <p>{name}</p>
            )}
          </div>

          <div className="dorm-detail-item">
            <h2>Status</h2>
            {isEditing ? (
              <select
                name="status"
                value={dorm.status}
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

export default DormDetail;
