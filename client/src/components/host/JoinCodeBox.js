import React from "react";
import { QRCode } from "antd";

function JoinCodeBox({ gameID }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexShrink: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <div
          className="card frosted-glass"
          style={{
            padding: 8,
            paddingLeft: 12,
            paddingRight: 12,
            marginBottom: 0,
          }}
        >
          <p style={{ fontSize: "1.5rem" }}>
            Room Code: <code>{gameID}</code>
          </p>
        </div>
        <p style={{ textAlign: "center", marginTop: 4, marginBottom: 0 }}>
          https://chickadee.fun
        </p>
      </div>
      <div
        className="frosted-glass card"
        style={{ padding: 0, marginLeft: 16 }}
      >
        <QRCode
          value={`https://ekimbox.vercel.app/play/${gameID}`}
          size={100}
        />
      </div>
    </div>
  );
}

export default JoinCodeBox;
