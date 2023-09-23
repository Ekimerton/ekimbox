import React, { useState, useEffect } from "react";
import PlayerProfile from "./PlayerProfile";
import useSound from "use-sound";
import votesound from "./sounds/boom.mp3";
// import votesound from "./sounds/votesound.wav";

const PlayerAnswerCard = ({
  player,
  answer,
  userHidden = true,
  numVotes = 0,
}) => {
  const [prevVoteCount, setPrevVoteCount] = useState(0);

  const [playVote] = useSound(votesound, {
    // playbackRate: Math.floor(Math.random() * 4) + 1,
    volume: 0.3,
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
        flexDirection: "column",
        alignItems: "center",
        width: "27rem",
        height: "23rem",
        margin: 16,
      }}
    >
      <div
        className="card frosted-glass"
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: "2rem" }}>{answer}</p>
        <div
          style={{
            position: "absolute",
            bottom: -16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {voteCircles}
        </div>
      </div>

      <div
        className="card frosted-glass"
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
        }}
      >
        <PlayerProfile name={player.name} userHidden={userHidden} picNum={4} />
      </div>
    </div>
  );
};

const voteCircleStyle = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: "#FDA90D",
  margin: "0 2px",
};

export default PlayerAnswerCard;
