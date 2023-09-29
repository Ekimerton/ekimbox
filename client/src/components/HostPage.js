import React, { useState, useEffect } from "react";
import PlayerView from "./PlayerView";
import JoinCodeBox from "./host/JoinCodeBox";
import TipBox from "./host/TipBox";
import Timer from "./Timer";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { message } from "antd";
import RegisterCard from "./host/RegisterCard";
import PromptCard from "./host/PromptCard";
import AnswerCard from "./host/AnswerCard";
import BackgroundMusic from "./host/BackgroundMusic";
import { generateComedian } from "./host/utils";

const BASE_URL = "https://ekimbox-server.onrender.com";
// const BASE_URL = "http://localhost:3000";

function HostPage() {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState({});
  const [connected, setConnected] = useState(false);

  const [messageApi, messageContextHolder] = message.useMessage();

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
        key: "serverLoading",
      });
    } else {
      messageApi.destroy("serverLoading");
    }
  }, [connected, messageApi]);

  return (
    <>
      <BackgroundMusic stage={gameState.stage} messageApi={messageApi} />
      {messageContextHolder}
      <div className="funky-background full-screen">
        {!(
          gameState.stage === "answer" ||
          gameState.stage === "vote" ||
          gameState.stage === "score"
        ) && <JoinCodeBox gameID={gameId} />}
        {(gameState.stage === "answer" ||
          gameState.stage === "vote" ||
          gameState.stage === "score") && (
          <Timer
            timeEnd={gameState.timeEnd}
            fontSize={32}
            audible={gameState.stage === "answer"}
          />
        )}
        <div className="container host-container">
          {gameState.stage === "register" && (
            <RegisterCard gameState={gameState} />
          )}
          {gameState.stage === "answer" && (
            <PromptCard>
              <h2>Sending prompts to your devices... now!</h2>
              <p>
                Craft the funniest responses you can think of to the prompts
                landing on your device. Now's the time to channel your inner{" "}
                {generateComedian()}.
              </p>
            </PromptCard>
          )}
          {gameState.stage === "vote" && (
            <AnswerCard
              question={gameState.questions[gameState.subStage].prompt}
              answers={gameState.questions[gameState.subStage].answers}
              timeEnd={gameState.timeEnd}
            />
          )}
          {gameState.stage === "score" && (
            <>
              <div className="card frosted-glass max-width">
                <PlayerView gameState={gameState} showScores />
              </div>
            </>
          )}
          {gameState.stage === "end" && (
            <PromptCard>
              <h2>Thanks for playing!</h2>
              <p>
                This server will shut down now that the game has finished. You
                can start a new game by going to the{" "}
                <a href="https://chickadee.fun">home page</a>.
              </p>
              <PlayerView gameState={gameState} showScores final />
            </PromptCard>
          )}
          {gameState.stage === "no_room" && (
            <PromptCard>
              <h2>Unable to find room.</h2>
              <p>
                Oops! Looks like you've tried joining a room which doesn't
                exist! Double check your room code and try again.
              </p>
            </PromptCard>
          )}
        </div>
        <TipBox />
      </div>
    </>
  );
}

export default HostPage;
