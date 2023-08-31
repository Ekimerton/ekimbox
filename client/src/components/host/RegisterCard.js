import React, { useState, useEffect } from "react";
import PlayerView from "../PlayerView";
// import grunts from "../host/sounds/grunts.wav";
import grunts from "../../sounds/grunts2.wav";
import useSound from "use-sound";

function RegisterCard({ gameState }) {
  const [prevPlayerNames, setPrevPlayerNames] = useState("");

  /*
  const [playGrunt] = useSound(grunts, {
    sprite: {
      1: [80, 300],
      2: [700, 400],
      3: [2000, 300],
      4: [2700, 500],
    },
    volume: 0.8,
  });
  */

  const [playGrunt] = useSound(grunts, {
    sprite: {
      1: [430, 300],
      2: [1050, 550],
      3: [2253, 250],
      4: [3800, 800],
      5: [5730, 370],
      6: [7000, 500],
      7: [7680, 430],
      8: [8500, 500],
      9: [9180, 300],
      10: [10920, 450],
    },
    volume: 0.8,
  });

  function getRandomSprite() {
    const spriteKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
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
