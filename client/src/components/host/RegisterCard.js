import React, { useState, useEffect } from "react";
import PlayerView from "../PlayerView";
import grunts from "../host/sounds/grunts.wav";
import useSound from "use-sound";

function RegisterCard({ gameState }) {
  const [prevPlayerNames, setPrevPlayerNames] = useState("");

  const [playGrunt] = useSound(grunts, {
    sprite: {
      1: [80, 300],
      2: [700, 400],
      3: [2000, 300],
      4: [2700, 500],
    },
    volume: 0.8,
  });

  function getRandomSprite() {
    const spriteKeys = ["1", "2", "3", "4"];
    const randomIndex = Math.floor(Math.random() * spriteKeys.length);
    return spriteKeys[randomIndex];
  }

  const currentPlayerNames = JSON.stringify(
    gameState.players.map((player) => player.name)
  );

  useEffect(() => {
    if (currentPlayerNames !== prevPlayerNames) {
      const randomSprite = getRandomSprite();
      playGrunt({ id: randomSprite });
      setPrevPlayerNames(currentPlayerNames);
    }
  }, [currentPlayerNames, prevPlayerNames, playGrunt]);

  return (
    <div className="card frosted-glass max-width">
      {gameState.players.length < 2 ? (
        <p className="prompt">
          Waiting for at least 2 players to join the game...
        </p>
      ) : (
        <p className="prompt">
          Waiting for the VIP player to start the game...
        </p>
      )}
      <PlayerView gameState={gameState} />
    </div>
  );
}

export default RegisterCard;
