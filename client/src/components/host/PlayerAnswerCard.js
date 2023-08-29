import React from "react";
import { Avatar } from "antd";

const PlayerAnswerCard = ({
  player,
  answer,
  avatarFirst = true,
  avatarVisible = false,
  numVotes = 2,
}) => {
  const voteCircles = Array.from({ length: numVotes }).map((_, idx) => (
    <div key={idx} style={voteCircleStyle}></div>
  ));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: 100,
        margin: 8,
        width: "100%",
      }}
    >
      {avatarVisible && avatarFirst && (
        <Avatar size={100} style={{ marginRight: 16, flexShrink: 0 }}>
          {player.name}
        </Avatar>
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          background: "#f3f3f3",
          width: "100%",
          height: "100%",
          borderRadius: 32,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          border: "4px solid #444444",
        }}
      >
        <p>{answer}</p>
        <div
          style={{
            position: "absolute",
            bottom: -10, // slightly more than half the size of a circle to center it on the border
            left: "50%",
            transform: "translateX(-50%)", // centers the container
            display: "flex",
            justifyContent: "center",
          }}
        >
          {voteCircles}
        </div>
      </div>
      {avatarVisible && !avatarFirst && (
        <Avatar size={100} style={{ marginLeft: 16, flexShrink: 0 }}>
          {player.name}
        </Avatar>
      )}
    </div>
  );
};

const voteCircleStyle = {
  width: 16, // making the circle smaller
  height: 16,
  borderRadius: "50%",
  backgroundColor: "#4444ff", // Or any desired color for the vote circle
  margin: "0 2px", // Adjusted spacing between circles
};

export default PlayerAnswerCard;
