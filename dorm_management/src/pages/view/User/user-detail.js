import React, { Component } from "react";
import axios from "axios";
import "./UserDetail.scss";

class UserDetail extends Component {
  constructor(props) {
    super(props);
    const { item } = props;
    this.state = {
      user_list: { ...item },
      isEditing: false,
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      user_list: {
        ...prevState.user_list,
        [name]: value,
      },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { user_list } = this.state;
    const { onClose, onUpdate } = this.props;

    // Validate required fields
    if (
      !user_list.firstname ||
      !user_list.lastname ||
      !user_list.username ||
      !user_list.type
    ) {
      alert(
        "Please fill in all required fields (First Name, Last Name, Username, and Type)"
      );
      return;
    }

    try {
      // Only include password in update if it was changed
      const updateData = {
        ...user_list,
        password: user_list.password || undefined, // Remove password if empty
      };

      console.log("Sending update request:", updateData);

      const response = await axios.put(
        `http://localhost:5000/users/${user_list.id}`,
        updateData
      );

      console.log("Update response:", response.data);

      // Call onUpdate callback if provided to refresh the user list
      if (onUpdate) {
        onUpdate(response.data);
      }

      this.setState({ isEditing: false });
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage =
        error.response?.data ||
        error.message ||
        "Failed to update user. Please try again.";
      alert(`Error: ${errorMessage}`);
    }
  };

  handleEdit = () => {
    this.setState({ isEditing: true });
  };

  handleCancel = () => {
    const { item } = this.props;
    this.setState({ user_list: { ...item }, isEditing: false });
  };

  render() {
    const { user_list, isEditing } = this.state;
    const { onClose } = this.props;

    if (!user_list) {
      return <div>No user data available.</div>;
    }

    const { firstname, middlename, lastname, username, password, type } =
      user_list;

    return (
      <div className="user-profile">
        <div className="user-profile-header">
          <h1>User Profile</h1>
        </div>

        <form onSubmit={this.handleSubmit}>
          <div className="detail-content">
            <div className="user-detail-item">
              <label>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstname"
                  value={firstname}
                  onChange={this.handleChange}
                  required
                />
              ) : (
                <p>{firstname}</p>
              )}
            </div>

            <div className="user-detail-item">
              <label>Middle Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="middlename"
                  value={middlename}
                  onChange={this.handleChange}
                />
              ) : (
                <p>{middlename}</p>
              )}
            </div>

            <div className="user-detail-item">
              <label>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastname"
                  value={lastname}
                  onChange={this.handleChange}
                  required
                />
              ) : (
                <p>{lastname}</p>
              )}
            </div>

            <div className="user-detail-item">
              <label>Username</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                  required
                />
              ) : (
                <p>{username}</p>
              )}
            </div>

            <div className="user-detail-item">
              <label>Password</label>
              {isEditing ? (
                <input
                  type="password"
                  name="password"
                  value={password || ""}
                  onChange={this.handleChange}
                  autoComplete="new-password"
                />
              ) : (
                <p>{password ? "••••••" : ""}</p>
              )}
            </div>

            <div className="user-detail-item">
              <label>Type</label>
              {isEditing ? (
                <select
                  name="type"
                  value={type}
                  onChange={this.handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="1">Admin</option>
                  <option value="2">Staff</option>
                </select>
              ) : (
                <p>{type === "1" ? "Admin" : type === "2" ? "Staff" : type}</p>
              )}
            </div>
          </div>

          <div className="action-buttons">
            {isEditing ? (
              <>
                <button type="submit" className="btn save">
                  💾 Save
                </button>
                <button
                  type="button"
                  className="btn cancel"
                  onClick={this.handleCancel}
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn edit"
                onClick={this.handleEdit}
              >
                ✏️ Edit
              </button>
            )}
            <button type="button" className="btn close" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default UserDetail;
