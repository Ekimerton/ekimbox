import React from "react";
import Timer from "../Timer";

function ControllerHeader({ name }) {
  return (
    <div
      className="card mobile-card frosted-glass"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
      }}
    >
      <p>{name ? name : "Select a name to join game"}</p>
    </div>
  );
}

export default ControllerHeader;
