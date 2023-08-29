import React from "react";
import { QRCode } from "antd";

function ScoreView({ gameID }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
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
        <p style={{ textAlign: "center", paddingTop: 4, paddingBottom: 0 }}>
          https://ekimbox.vercel.app
        </p>
      </div>
      {/* 
      <QRCode
        value={`https://ekimbox.vercel.app/play/${gameID}`}
        size={100}
        className="frosted-glass"
      />
      */}
    </div>
  );
}

export default ScoreView;
