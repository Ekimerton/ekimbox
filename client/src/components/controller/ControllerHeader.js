import React from "react";
import { Card } from "antd";

function ControllerHeader({ name }) {
  return (
    <Card size="small" style={{ textAlign: "center" }}>
      <p style={{ margin: 0 }}>{name ? name : "Select a name to join game"}</p>
    </Card>
  );
}

export default ControllerHeader;
