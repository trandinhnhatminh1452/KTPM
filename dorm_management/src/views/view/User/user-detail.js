import React, { Component } from "react";
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

  handleSubmit = (e) => {
    e.preventDefault();
    const { user_list } = this.state;
    console.log("Form submitted with user data:", user_list);
    // Call API or callback here if necessary
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

        <div className="detail-content">
          <div className="user-detail-item">
            <label>First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstname"
                value={firstname}
                onChange={this.handleChange}
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
              />
            ) : (
              <p>{password ? "••••••" : ""}</p>
            )}
          </div>

          <div className="user-detail-item">
            <label>Type</label>
            {isEditing ? (
              <input
                type="text"
                name="type"
                value={type}
                onChange={this.handleChange}
              />
            ) : (
              <p>{type}</p>
            )}
          </div>
        </div>

        <div className="action-buttons">
          {isEditing ? (
            <>
              <button className="btn save" onClick={this.handleSubmit}>
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
    );
  }
}

export default UserDetail;
