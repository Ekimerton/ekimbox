import React, { useState, useEffect } from "react";
import PlayerView from "../PlayerView";
import joinsound from "../host/sounds/joinsound.wav";
import useSound from "use-sound";

function RegisterCard({ gameState }) {
  const [prevPlayerCount, setPrevPlayerCount] = useState(0);

  const [playJoin] = useSound(joinsound, {
    playbackRate: Math.floor(Math.random() * 3) + 1,
    volume: 0.5,
    loop: false,
  });

  useEffect(() => {
    function handlePlayerAdded() {
      console.log("A new player has joined!");
      playJoin();
    }

    if (gameState.players && gameState.players.length > prevPlayerCount) {
      handlePlayerAdded();
    }

    // Update the previous player count
    setPrevPlayerCount(gameState.players.length);
  }, [gameState.players.length]);

  return (
    <div className="card frosted-glass max-width">
      <p className="prompt">Waiting for the VIP player to start the game...</p>
      <PlayerView gameState={gameState} />
    </div>
  );
}

export default RegisterCard;
