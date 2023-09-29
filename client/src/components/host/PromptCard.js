import React from "react";

function PromptCard({ children }) {
  return (
    <div
      className="card frosted-glass max-width"
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 32,
      }}
    >
      {children}
    </div>
  );
}

export default PromptCard;
