import React from "react";

function PlayerView({ gameState, showScores = false }) {
  return (
    <>
      <h2>
        {showScores ? "Scores" : "Players"}{" "}
        {!showScores && `(${gameState.players.length}/8)`}
      </h2>
      {gameState.players &&
        gameState.players
          .sort((a, b) => b.score - a.score)
          .map((player) => (
            <p key={player.id}>
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
