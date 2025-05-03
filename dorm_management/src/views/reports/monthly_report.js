import React from "react";

class Monthly_report extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // chiếm toàn bộ chiều cao viewport
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        Monthly Collection Reports
      </div>
    );
  }
}

export default Monthly_report;
