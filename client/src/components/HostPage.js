import React, { useState, useEffect } from "react";
import PlayerView from "./PlayerView";
import JoinCodeBox from "./JoinCodeBox";
import TipBox from "./TipBox";
import Timer from "./Timer";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { message } from "antd";
import RegisterCard from "./host/RegisterCard";
import PromptCard from "./host/PromptCard";
import AnswerCard from "./host/AnswerCard";
import useSound from "use-sound";
import bgMusic from "./host/sounds/bgmusic4.wav";
import bgMusic2 from "./host/sounds/bgmusic5.wav";

const BASE_URL = "https://ekimbox-server.onrender.com";
// const BASE_URL = "http://localhost:3000";

function HostPage() {
  const { gameId } = useParams();
  const [gameState, setGameState] = useState({});
  const [connected, setConnected] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const [play1, { stop: stop1 }] = useSound(bgMusic, {
    loop: true,
    volume: 0.2,
  });
  const [play2, { stop: stop2 }] = useSound(bgMusic2, {
    loop: true,
    playbackRate: 0.8,
    volume: 0.2,
  });

  useEffect(() => {
    // Play based on game state
    if (!gameState.stage || gameState.stage === "register") {
      play1();
    } else {
      play2();
    }

    // Return cleanup function to stop music on unmount
    return () => {
      stop1();
      stop2();
    };
  }, [gameState.stage]);

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
            <RegisterCard gameState={gameState} />
          )}
          {gameState.stage === "answer" && (
            <PromptCard timeEnd={gameState.timeEnd}>
              <h2>Sending prompts to your devices... now!</h2>
              <p>Now's the time to let out your inner Mark Twain.</p>
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
                <Timer timeEnd={gameState.timeEnd} />
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
                <a href="https://ekimbox.vercel.app">home page</a>.
              </p>
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
