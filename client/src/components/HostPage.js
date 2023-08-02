import React, { useState, useEffect } from "react";
import PlayerView from "./PlayerView";
import JoinCodeBox from "./JoinCodeBox";
import TipBox from "./TipBox";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { message } from "antd";

const BASE_URL = "https://ekimbox-server.onrender.com";
//const BASE_URL = "http://localhost:3000";

function HostPage() {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState({});
  const [connected, setConnected] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const newSocket = io(`${BASE_URL}/game/${gameId}`);

    newSocket.on("gameState", (newGameState) => {
      setGameState(newGameState);
    });

    newSocket.on("connect", () => {
      setConnected(true);
      newSocket.emit("ready");
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      newSocket.off("gameState");
      newSocket.close();
    };
  }, [gameId]);

  useEffect(() => {
    if (!connected) {
      messageApi.loading({
        content: "Connecting to server...",
        duration: 0,
        style: { width: "100%", alignItems: "center" },
      });
    } else {
      messageApi.destroy();
    }
  }, [connected, messageApi]);

  return (
    <>
      <div className="funky-background column-view">
        {contextHolder}
        <JoinCodeBox gameID={gameId} />
        <div className="container host-container">
          {gameState.stage === "register" && (
            <>
              <div className="card frosted-glass max-width">
                <p>Waiting for the VIP player to start the game...</p>
                <PlayerView gameState={gameState} />
              </div>
            </>
          )}
          {gameState.stage === "answer" && (
            <>
              <div className="card frosted-glass max-width">
                <p>
                  Answer your questions according to the prompt on your device.
                </p>
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
            <>
              <div className="card frosted-glass max-width">
                <PlayerView gameState={gameState} showScores />
              </div>
            </>
          )}
          {gameState.stage === "end" && (
            <div className="card frosted-glass max-width">
              <h3>Thanks for playing!</h3>
              <p>
                This server will shut down now that the game has finished. You
                can start a new game by going to the{" "}
                <a href="https://ekimbox.vercel.app">home page</a>.
              </p>
            </div>
          )}
        </div>
        <TipBox />
      </div>
    </>
  );
}

export default HostPage;
