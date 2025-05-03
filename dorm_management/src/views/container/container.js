import React, { Component } from "react";
import "./container.scss";

class Container extends Component {
  state = {
    searchQuery: "",
    entriesToShow: 10,
    currentPage: 1,
    isEditing: false,
    isCreating: false,
    selectedItem: null,
    newItem: { name: "", description: "" }, // State cho item mới
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value, currentPage: 1 });
  };

  handleEntriesChange = (e) => {
    this.setState({ entriesToShow: parseInt(e.target.value), currentPage: 1 });
  };

  handlePageChange = (direction) => {
    this.setState((prevState) => {
      let newPage = prevState.currentPage;
      if (direction === "next") {
        newPage++;
      } else if (direction === "prev" && newPage > 1) {
        newPage--;
      }
      return { currentPage: newPage };
    });
  };

  filterData = () => {
    const { data = [], columns } = this.props;
    const { searchQuery } = this.state;

    if (!searchQuery.trim()) return data;

    const lowerSearch = searchQuery.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const value = item[col.key];
        return value && value.toString().toLowerCase().includes(lowerSearch);
      })
    );
  };

  handleActionChange = (action, item, e) => {
    if (action === "view") {
      this.setState({ isEditing: true, selectedItem: item });
    } else if (action === "delete") {
      const confirmDelete = window.confirm("Are you sure you want to delete?");
      if (confirmDelete) {
        alert(`Deleted: ${item.id || "item"}`);
      }
    }
    e.target.value = "";
  };

  handleCloseEdit = () => {
    this.setState({ isEditing: false, selectedItem: null });
  };

  handleCreate = () => {
    this.setState({ isCreating: true, newItem: { name: "", description: "" } });
  };

  handleCloseCreate = () => {
    this.setState({ isCreating: false });
  };

  handleCreateChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newItem: { ...prevState.newItem, [name]: value },
    }));
  };

  handleSaveNewItem = () => {
    const { newItem } = this.state;
    // Giả sử bạn gửi dữ liệu này tới backend để lưu
    alert(`New item created: ${newItem.name}, ${newItem.description}`);
    this.setState({
      isCreating: false,
      newItem: { name: "", description: "" },
    });
  };

  render() {
    const { title, columns, DetailComponent: Detail } = this.props;
    const {
      searchQuery,
      entriesToShow,
      currentPage,
      isEditing,
      isCreating,
      selectedItem,
      newItem,
    } = this.state;

    const filteredData = this.filterData();
    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesToShow) || 1;
    const dataToDisplay = filteredData.slice(
      (currentPage - 1) * entriesToShow,
      currentPage * entriesToShow
    );

    if (isEditing && Detail) {
      const { detailPropKey = "item" } = this.props;

      const detailProps = {
        [detailPropKey]: selectedItem,
        onClose: this.handleCloseEdit,
      };

      return (
        <div className="detail-page">
          <Detail {...detailProps} />
        </div>
      );
    }

    return (
      <div className="container">
        {/* Header */}
        <div className="container-header">
          <h2>{title}</h2>
          <div className="create" onClick={this.handleCreate}>
            Create
          </div>
        </div>

        {/* Form tạo mới */}
        {isCreating && (
          <div className="create-form">
            <h3>Create New Item</h3>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={this.handleCreateChange}
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={newItem.description}
                onChange={this.handleCreateChange}
              />
            </div>
            <div>
              <button onClick={this.handleSaveNewItem}>Save</button>
              <button onClick={this.handleCloseCreate}>Close</button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="controls">
          <div className="entries-control">
            Show{" "}
            <select value={entriesToShow} onChange={this.handleEntriesChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>{" "}
            entries
          </div>

          <div className="search-control">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={this.handleSearchChange}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table">
          <div className="list-table">
            <table>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={col.width ? { width: col.width } : {}}
                    >
                      {col.label}
                    </th>
                  ))}
                  <th style={{ width: "10%" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataToDisplay.length > 0 ? (
                  dataToDisplay.map((item, idx) => (
                    <tr key={idx}>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          style={col.width ? { width: col.width } : {}}
                        >
                          {item[col.key] ?? "-"}
                        </td>
                      ))}
                      <td>
                        <select
                          onChange={(e) =>
                            this.handleActionChange(e.target.value, item, e)
                          }
                        >
                          <option value="">Select</option>
                          <option value="view">View</option>
                          <option value="delete">Delete</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1}>No data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => this.handlePageChange("prev")}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => this.handlePageChange("next")}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default Container;
