import React, { useState, useEffect } from "react";
import ScoreView from "./ScoreView";
import TriangleBackground from "./TriangleBackground";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

function HostPage() {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState({});
  const [connected, setConnected] = useState(false);

  const socket = io(`https://ekimbox-server.onrender.com/game/${gameId}`);

  useEffect(() => {
    socket.on("gameState", (newGameState) => {
      setGameState(newGameState);
    });

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.emit("ready");

    return () => {
      socket.off("gameState");
      socket.close();
    };
  }, [gameId]);

  return (
    <div className="funky-background column-view">
      <TriangleBackground />
      <div className="container">
        <p>{connected ? "Connected" : "Lost Connection"}</p>
        {gameState.stage === "register" && (
          <div className="card frosted-glass">
            <p>Waiting for host to start the game...</p>
            <p>
              Join this game using code: <code>{gameId}</code>
            </p>
            <h3>Players</h3>
            {gameState.players &&
              gameState.players.map((player) => (
                <p key={player.id}>{player.name}</p>
              ))}
          </div>
        )}
        {gameState.stage === "answer" && (
          <>
            <div className="card frosted-glass">
              <p>{gameState.prompt}</p>
            </div>
          </>
        )}
        {gameState.stage === "vote" && (
          <>
            <div className="card frosted-glass">
              <button>
                {gameState.comparisonPairs[gameState.subStage][0]}
              </button>
              <button>
                {gameState.comparisonPairs[gameState.subStage][1]}
              </button>
            </div>
          </>
        )}
        {gameState.stage === "score" && (
          <div className="card frosted-glass">
            {" "}
            <ScoreView gameState={gameState} />{" "}
          </div>
        )}
        {gameState.stage === "end" && (
          <div className="card frosted-glass">
            <p>Thanks for playing!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HostPage;
