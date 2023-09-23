import React from "react";

function PlayerView({ gameState, showScores = false, final = false }) {
  return (
    <>
      <h2>
        {showScores ? (final ? "Final " : "") + "Scores" : "Players"}{" "}
        {!showScores && `(${gameState.players.length}/8)`}
      </h2>
      {gameState.players && (
        <div layout>
          {gameState.players
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <p key={player.id} layoutId={player.id}>
                {player.name} {showScores && `- ${player.score}`}{" "}
                {!showScores && gameState.vipID === player.id && (
                  <strong>VIP</strong>
                )}
              </p>
            ))}
        </div>
      )}
    </>
  );
}

export default PlayerView;
