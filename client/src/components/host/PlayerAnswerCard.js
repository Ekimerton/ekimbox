import React, { useState, useEffect } from "react";
import { Avatar } from "antd";
import useSound from "use-sound";
import votesound from "./sounds/boom.mp3";
// import votesound from "./sounds/votesound.wav";

const PlayerAnswerCard = ({
  player,
  answer,
  avatarFirst = true,
  avatarVisible = false,
  numVotes = 0,
}) => {
  const [prevVoteCount, setPrevVoteCount] = useState(0);

  const [playVote] = useSound(votesound, {
    // playbackRate: Math.floor(Math.random() * 4) + 1,
    volume: 0.5,
    loop: false,
  });

  useEffect(() => {
    if (numVotes > prevVoteCount) {
      playVote();
    }

    // Update the previous vote count
    setPrevVoteCount(numVotes);
  }, [numVotes]);

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
            bottom: -10,
            left: "50%",
            transform: "translateX(-50%)",
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
  width: 16,
  height: 16,
  borderRadius: "50%",
  backgroundColor: "#4444ff",
  margin: "0 2px",
};

export default PlayerAnswerCard;
