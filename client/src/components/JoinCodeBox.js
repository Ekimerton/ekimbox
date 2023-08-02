import React from "react";

function ScoreView({ gameID }) {
  return (
    <>
      <div
        className="card frosted-glass"
        style={{ padding: 8, paddingLeft: 12, paddingRight: 12 }}
      >
        <p style={{ fontSize: "1.5rem" }}>
          Room Code: <code>{gameID}</code>
        </p>
      </div>
    </>
  );
}

export default ScoreView;
