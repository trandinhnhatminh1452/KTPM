import React from "react";

class Setting extends React.Component {
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
        Setting
      </div>
    );
  }
}

export default Setting;
