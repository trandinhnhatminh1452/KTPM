import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

const columns = [
  { name: "#", selector: (row, i) => i + 1, width: "60px", sortable: false },
  {
    name: "DateTime Added",
    selector: (row) => new Date(row.dateCreated).toLocaleString(),
    sortable: true,
  },
  {
    name: "Month of",
    selector: (row) => row.monthOf,
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row) => Number(row.amount).toLocaleString(),
    sortable: true,
  },
  {
    name: "Action",
    cell: (row) => (
      <div>
        <button>Action</button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

export default function PaymentHistory({ accountId, onClose }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/payment/history/${accountId}`)
      .then((res) => setData(res.data));
  }, [accountId]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Payment History</h2>
        <DataTable columns={columns} data={data} pagination highlightOnHover />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
