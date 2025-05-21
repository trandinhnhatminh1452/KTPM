import React, { Component } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "./account-detail.scss";

class AccountDetail extends Component {
  constructor(props) {
    super(props);
    const { item } = props;
    this.state = {
      account: { ...item },
      isEditing: false,
      dorms: [],
      rooms: [],
      filteredRooms: [],
      showPaymentHistory: false,
      showAddPayment: false,
      payments: [],
      allPayments: [], // để search không bị mất dữ liệu gốc
      newPayment: {
        amount: "",
        month: "",
        note: "",
      },
    };
  }

  async componentDidMount() {
    // Lấy danh sách dorms và rooms để dùng cho dropdown
    const [dormsRes, roomsRes] = await Promise.all([
      axios.get("http://localhost:5000/dorms"),
      axios.get("http://localhost:5000/rooms"),
    ]);
    this.setState({
      dorms: dormsRes.data,
      rooms: roomsRes.data,
    });
  }

  fetchPayments = async () => {
    const { account } = this.state;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/payment/history/${account.id}`
      );
      this.setState({
        payments: res.data,
        allPayments: res.data,
        showPaymentHistory: true,
      });
    } catch (err) {
      alert("Không lấy được lịch sử thanh toán");
    }
  };

  openAddPayment = () => {
    this.setState({ showAddPayment: true });
  };

  closeModal = () => {
    this.setState({ showPaymentHistory: false, showAddPayment: false });
  };

  handlePaymentChange = (e) => {
    const { name, value } = e.target;
    this.setState((prev) => ({
      newPayment: { ...prev.newPayment, [name]: value },
    }));
  };

  handleAddPayment = async () => {
    const { account, newPayment } = this.state;
    try {
      await axios.post(`http://localhost:5000/payments`, {
        account_id: account.id,
        amount: newPayment.amount,
        month: newPayment.month,
        note: newPayment.note,
      });
      alert("Thêm thanh toán thành công!");
      this.setState({
        showAddPayment: false,
        newPayment: { amount: "", month: "", note: "" },
      });
      this.fetchPayments();
    } catch (err) {
      alert("Thêm thanh toán thất bại");
    }
  };

  formatMonth(dateStr) {
    if (!dateStr) return "";
    // Nếu month_of là dạng "2022-05" hoặc "May, 2022" thì chỉ cần trả về luôn
    if (/\d{4}-\d{2}/.test(dateStr)) {
      const [year, month] = dateStr.split("-");
      return new Date(year, month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
    }
    return dateStr;
  }

  handleSearchPayment = (e) => {
    const value = e.target.value.toLowerCase();
    const { allPayments } = this.state;
    const filtered = allPayments.filter(
      (p) =>
        p.amount?.toString().includes(value) ||
        this.formatMonth(p.month_of).toLowerCase().includes(value) ||
        (p.note || "").toLowerCase().includes(value)
    );
    this.setState({ payments: filtered });
  };

  handleChangeDormInfo = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => {
      let updated = { ...prevState.account, [name]: value };
      // Nếu đổi dorm thì reset room
      let filteredRooms = prevState.rooms.filter(
        (room) =>
          room.dorm === (name === "dorm" ? value : prevState.account.dorm)
      );
      if (name === "dorm") {
        updated.room = filteredRooms.length > 0 ? filteredRooms[0].room : "";
      }
      return {
        account: updated,
        filteredRooms,
      };
    });
  };

  handleEdit = () => {
    // Khi edit, lọc room theo dorm hiện tại
    const { rooms, account } = this.state;
    const filteredRooms = rooms.filter((room) => room.dorm === account.dorm);
    this.setState({ isEditing: true, filteredRooms });
  };

  handleCancel = () => {
    const { item } = this.props;
    const { rooms } = this.state;
    const filteredRooms = rooms.filter((room) => room.dorm === item.dorm);
    this.setState({
      account: { ...item },
      isEditing: false,
      filteredRooms,
    });
  };

  handleSave = async () => {
    const { account } = this.state;
    const { onUpdate, onClose } = this.props;
    try {
      const response = await axios.put(
        `http://localhost:5000/accounts/${account.id}`,
        account
      );
      if (onUpdate) {
        onUpdate(response.data);
      }
      this.setState({ isEditing: false });
      if (onClose) onClose();
    } catch (error) {
      alert(
        "Cập nhật thất bại: " + (error.response?.data?.error || error.message)
      );
    }
  };

  render() {
    const {
      account,
      isEditing,
      dorms,
      filteredRooms,
      showPaymentHistory,
      showAddPayment,
      payments,
      newPayment,
    } = this.state;
    const { onClose } = this.props;

    const columns = [
      {
        name: "#",
        selector: (row, idx) => idx + 1,
        width: "60px",
        sortable: false,
      },
      {
        name: "DateTime Added",
        selector: (row) =>
          new Date(row.date_created).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        sortable: true,
      },
      {
        name: "Month of",
        selector: (row) => this.formatMonth(row.month_of),
        sortable: true,
      },
      {
        name: "Amount",
        selector: (row) =>
          Number(row.amount)?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        sortable: true,
        right: true,
      },
      {
        name: "Action",
        cell: () => (
          <select disabled defaultValue="Action">
            <option>Action</option>
          </select>
        ),
        width: "100px",
      },
    ];

    if (!account) {
      return <div>No account data available.</div>;
    }

    return (
      <div className="detail-container">
        {/* Header */}
        <div className="detail-header">
          <h1>Student Details</h1>
          <div className="status-badge">
            <span
              className={`status-dot ${
                account.status === "Active" ? "active" : "inactive"
              }`}
            />
            <span>{account.status === "Active" ? "Active" : "Inactive"}</span>
          </div>
        </div>

        <div className="detail-form">
          {/* School Details */}
          <div className="detail-section">
            <h2>School Details</h2>
            <div className="info-group">
              <div className="info-item">
                <span className="label">School ID/Code</span>
                <span className="value">{account.code}</span>
              </div>
              <div className="info-item">
                <span className="label">Department</span>
                <span className="value">{account.department}</span>
              </div>
              <div className="info-item">
                <span className="label">Course</span>
                <span className="value">{account.course}</span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="detail-section">
            <h2>Personal Information</h2>
            <div className="info-group">
              <div className="info-item">
                <span className="label">Name</span>
                <span className="value">
                  {account.firstname} {account.middlename} {account.lastname}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Gender</span>
                <span className="value">{account.gender}</span>
              </div>
              <div className="info-item">
                <span className="label">Contact #</span>
                <span className="value">{account.contact}</span>
              </div>
              <div className="info-item">
                <span className="label">Email</span>
                <span className="value">{account.email}</span>
              </div>
              <div className="info-item full-width">
                <span className="label">Address</span>
                <span className="value">{account.address}</span>
              </div>
            </div>
          </div>

          {/* Dorm Information */}
          <div className="detail-section">
            <h2>Dorm Information</h2>
            <div className="info-group">
              <div className="info-item">
                <span className="label">Account Code</span>
                <span className="value">
                  {account.account_code || account.code}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Dorm</span>
                {isEditing ? (
                  <select
                    name="dorm"
                    value={account.dorm}
                    onChange={this.handleChangeDormInfo}
                  >
                    {dorms.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="value">{account.dorm}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Room</span>
                {isEditing ? (
                  <select
                    name="room"
                    value={account.room}
                    onChange={this.handleChangeDormInfo}
                  >
                    {filteredRooms.map((r) => (
                      <option key={r.room} value={r.room}>
                        {r.room}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="value">{account.room}</span>
                )}
              </div>
              <div className="info-item">
                <span className="label">Monthly Rate</span>
                {isEditing ? (
                  <input
                    type="number"
                    name="price"
                    value={account.price}
                    onChange={this.handleChangeDormInfo}
                  />
                ) : (
                  <span className="value">
                    {account.price?.toLocaleString() || ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
            <button className="btn" onClick={this.fetchPayments}>
              💲 Payment History
            </button>
            <button className="btn" onClick={this.openAddPayment}>
              💳 Add Payment
            </button>
            <button className="btn close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {/* Modal Payment History */}
        {showPaymentHistory && (
          <div className="modal" style={{ minWidth: 700 }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span role="img" aria-label="history">
                🧾
              </span>
              Payment History
            </h3>
            <div
              style={{
                marginBottom: 10,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                Show
                <select style={{ margin: "0 5px" }} disabled>
                  <option>10</option>
                </select>
                entries
              </div>
              <div>
                Search:{" "}
                <input type="text" onChange={this.handleSearchPayment} />
              </div>
            </div>
            <DataTable
              columns={columns}
              data={payments}
              pagination
              highlightOnHover
              dense
              noHeader
              defaultSortFieldId={2}
            />
            <button className="btn close" onClick={this.closeModal}>
              ✖ Close
            </button>
          </div>
        )}

        {/* Modal Add Payment */}
        {showAddPayment && (
          <div className="modal" style={{ minWidth: 400 }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span role="img" aria-label="add">
                💳
              </span>
              New Payment
            </h3>
            <div style={{ marginBottom: 10 }}>
              <label>Month of</label>
              <input
                type="month"
                name="month"
                value={newPayment.month || ""}
                onChange={this.handlePaymentChange}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={newPayment.amount}
                onChange={this.handlePaymentChange}
                min={0}
                style={{ width: "100%" }}
              />
            </div>
            <button className="btn save" onClick={this.handleAddPayment}>
              Save
            </button>
            <button className="btn cancel" onClick={this.closeModal}>
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default AccountDetail;
