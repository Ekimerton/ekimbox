import React, { useState, useEffect, useRef, useCallback } from "react";
import Timer from "./Timer";
import RegisterView from "./controller/RegisterView";
import PlayerView from "./PlayerView";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import "./ControllerPage.css";
import ControllerHeader from "./controller/ControllerHeader";

// const BASE_URL = "https://ekimbox-server.onrender.com";
const BASE_URL = "http://localhost:3000";

function ControllerPage() {
  const [name, setName] = useState("");
  const [gameState, setGameState] = useState({});
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [vote, setVote] = useState("");
  const [connected, setConnected] = useState(false);

  const socketRef = useRef();
  const { gameId } = useParams();

  // Check if the client already has an ID in local storage
  let clientId = localStorage.getItem("clientId");

  // If not, generate a new ID and store it in local storage
  if (!clientId) {
    clientId = uuidv4();
    localStorage.setItem("clientId", clientId);
  }

  useEffect(() => {
    socketRef.current = io(`${BASE_URL}/game/${gameId}`);

    socketRef.current.on("connect", () => {
      setConnected(true);
    });
    socketRef.current.on("gameState", (newGameState) => {
      console.log("gameState", newGameState);

      if (newGameState.stage === "score") {
        setCurrentPromptIndex(0);
      }

      setGameState(newGameState);
      setName(
        newGameState.players.find((player) => player.id === clientId)?.name ||
          ""
      );
    });

    socketRef.current.on("disconnect", () => setConnected(false));
    socketRef.current.on("error", (error) => console.error(error));
    socketRef.current.emit("ready");

    return () => {
      socketRef.current.off("gameState");
      socketRef.current.off("connect");
      socketRef.current.off("disconnect");
      socketRef.current.close();
    };
  }, [gameId, clientId]);

  const currentPlayer = gameState.players?.find(
    (player) => player.id === clientId
  );

  const myPrompts =
    gameState.questions
      ?.filter((q) => q.answers.some((answer) => answer.player === clientId))
      .map((q) => q.prompt) || [];

  const handleRegister = useCallback(() => {
    if (
      gameState.players &&
      Object.values(gameState.players).some(
        (player) => player && player.name === name
      )
    ) {
      // If the name is already in use, send an error message to the client
      console.log("can't use that name");
      return;
    }
    socketRef.current.emit("register", { id: clientId, name: name });
  }, [gameState.players, name, clientId]);

  const handleAnswerSubmit = () => {
    if (answer) {
      socketRef.current.emit("answer", {
        clientId: clientId,
        prompt: myPrompts[currentPromptIndex],
        answer: answer,
      });
      // Reset the selected answer and move to the next prompt
      setAnswer("");
      setCurrentPromptIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleVote = (answerOption) => {
    socketRef.current.emit("vote", {
      clientId: clientId,
      questionPrompt: gameState.questions[gameState.subStage]?.prompt,
      votedFor: answerOption.player.id,
    });
  };

  const handleStartGame = useCallback(() => {
    socketRef.current.emit("startGame", clientId);
  }, [clientId]);

  if (!gameState.stage) {
    return <p>Loading...</p>;
  }

  return (
    <div className="column-view controller-page">
      <div className="mobile-container frosted-glass">
        <ControllerHeader
          name={currentPlayer ? currentPlayer.name : ""}
          timeEnd={gameState.timeEnd}
        />
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {gameState.stage === "register" && (
            <RegisterView
              name={name}
              setName={setName}
              handleRegister={handleRegister}
              handleStartGame={handleStartGame}
              gameState={gameState}
              clientId={clientId}
            />
          )}
          {gameState.stage === "answer" && (
            <>
              <p>{myPrompts[currentPromptIndex]}</p>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button onClick={handleAnswerSubmit}>Submit Answer</button>
            </>
          )}
          {gameState.stage === "vote" && (
            <div>
              <h2>
                Question: {gameState.questions[gameState.subStage]?.prompt}
              </h2>
              {gameState.questions[gameState.subStage]?.answers.map(
                (answerOption, index) => (
                  <button key={index} onClick={() => handleVote(answerOption)}>
                    {answerOption.answer}
                  </button>
                )
              )}
            </div>
          )}
          {gameState.stage === "score" && <PlayerView gameState={gameState} />}
          {gameState.stage === "end" && <p>Thanks for playing!</p>}
        </div>
        <div>
          <p>Footer section</p>
        </div>
      </div>
    </div>
  );
}

export default ControllerPage;
