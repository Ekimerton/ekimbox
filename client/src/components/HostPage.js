import React, { useState, useEffect } from "react";
import PlayerView from "./PlayerView";
import JoinCodeBox from "./JoinCodeBox";
import TipBox from "./TipBox";
import Timer from "./Timer";
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
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error(err.message); // log error message
      setGameState({ stage: "no_room", message: err.message });
    });

    return () => {
      newSocket.off("gameState");
      newSocket.close();
    };
  }, [gameId]);

  useEffect(() => {
    if (!connected) {
      messageApi.loading({
        content: "Trying to connect to server...",
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
                <Timer timeEnd={gameState.timeEnd} />
                <h2>
                  Answer your questions according to the prompt on your device.
                </h2>
              </div>
            </>
          )}
          {gameState.stage === "vote" && (
            <div className="card frosted-glass">
              <Timer timeEnd={gameState.timeEnd} />
              <h2>
                Question: {gameState.questions[gameState.subStage].prompt}
              </h2>
              {gameState.questions[gameState.subStage].answers.map(
                (answerOption, index) => (
                  <div key={index}>
                    <h3>{answerOption.answer}</h3>
                    <p>{answerOption.player}</p>
                  </div>
                )
              )}
            </div>
          )}
          {gameState.stage === "score" && (
            <>
              <div className="card frosted-glass max-width">
                <Timer timeEnd={gameState.timeEnd} />
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
          {gameState.stage === "no_room" && (
            <div className="card frosted-glass max-width">
              <h3>Unable to find room</h3>
              <p>The room code you entered no longer exists.</p>
            </div>
          )}
        </div>
        <TipBox />
      </div>
    </>
  );
}

export default HostPage;
