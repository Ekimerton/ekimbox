import React from "react";

function ScoreView({ gameState, clientId }) {
  return (
    <>
      <h3>Scores</h3>
      {gameState.players &&
        gameState.players.map((player) => (
          <p key={player.id}>
            {player.name} - {player.score}
          </p>
        ))}
    </>
  );
}

export default ScoreView;
