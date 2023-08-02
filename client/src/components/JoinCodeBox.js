import React from "react";

function ScoreView({ gameID }) {
  return (
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
      <p style={{ textAlign: "center", paddingTop: 4 }}>
        https://ekimbox.vercel.app
      </p>
    </div>
  );
}

export default ScoreView;
