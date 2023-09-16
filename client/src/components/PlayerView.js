import React from "react";
import { motion } from "framer-motion";

function PlayerView({ gameState, showScores = false, final = false }) {
  return (
    <>
      <h2>
        {showScores ? (final ? "Final " : "") + "Scores" : "Players"}{" "}
        {!showScores && `(${gameState.players.length}/8)`}
      </h2>
      {gameState.players && (
        <motion.div layout>
          {gameState.players
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <motion.p key={player.id} layoutId={player.id}>
                {player.name} {showScores && `- ${player.score}`}{" "}
                {!showScores && gameState.vipID === player.id && (
                  <strong>VIP</strong>
                )}
              </motion.p>
            ))}
        </motion.div>
      )}
    </>
  );
}

export default PlayerView;
