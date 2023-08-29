import React from "react";
import PlayerView from "../PlayerView";

function RegisterCard({ gameState }) {
  return (
    <div className="card frosted-glass max-width">
      <p className="prompt">Waiting for the VIP player to start the game...</p>
      <PlayerView gameState={gameState} />
    </div>
  );
}

export default RegisterCard;
