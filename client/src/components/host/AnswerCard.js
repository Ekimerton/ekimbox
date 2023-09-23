import React from "react";
import PlayerAnswerCard from "./PlayerAnswerCard";

function AnswerCard({ question, answers, timeEnd }) {
  return (
    <>
      <div style={{ height: "min-content", maxWidth: "100%" }}>
        <h2 style={{ color: "black" }}>{question}</h2>
        <p style={{ color: "black" }}>
          Vote for who you think has the funniest answer!
        </p>
      </div>
      <div
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          padding: 16,
        }}
      >
        <PlayerAnswerCard
          answer={answers[0].answer}
          player={answers[0].player}
          numVotes={answers[0].votes.length}
          userHidden={false}
        />
        <PlayerAnswerCard
          answer={answers[1].answer}
          player={answers[1].player}
          numVotes={answers[1].votes.length}
          userHidden={false}
        />
      </div>
    </>
  );
}

export default AnswerCard;
