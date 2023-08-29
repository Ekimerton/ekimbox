import React from "react";
import Timer from "../Timer";

function PromptCard({ children, timeEnd }) {
  return (
    <div className="card frosted-glass max-width">
      {timeEnd && <Timer timeEnd={timeEnd} />}
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: 16,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default PromptCard;
