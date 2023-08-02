import React from "react";

function PlayerView({ gameState, showScores = false }) {
  return (
    <>
      <h3>{showScores ? "Scores" : "Players"}</h3>
      {gameState.players &&
        gameState.players.map((player) => (
          <p key={player.id} style={{ fontSize: "1.1rem" }}>
            {player.name} {showScores && `- ${player.score}`}{" "}
            {!showScores && gameState.vipID === player.id && (
              <strong>VIP</strong>
            )}
          </p>
        ))}
    </>
  );
}

export default PlayerView;
