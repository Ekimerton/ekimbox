import React from "react";
import Timer from "../Timer";
import PlayerAnswerCard from "./PlayerAnswerCard";

function AnswerCard({ question, answers, timeEnd }) {
  return (
    <div className="card frosted-glass max-width">
      {timeEnd && <Timer timeEnd={timeEnd} />}
      <h2>{question}</h2>
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
        <PlayerAnswerCard
          answer={answers[0].answer}
          player={answers[0].player}
          numVotes={answers[0].votes.length}
        />
        <h4 style={{ margin: 4 }}>VS</h4>
        <PlayerAnswerCard
          answer={answers[1].answer}
          player={answers[1].player}
          numVotes={answers[1].votes.length}
          avatarFirst={false}
        />
      </div>
    </div>
  );
}

export default AnswerCard;
