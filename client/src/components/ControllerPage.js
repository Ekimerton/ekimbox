import React, { useState, useEffect, useRef, useCallback } from "react";
import Timer from "./Timer";
import { Card } from "antd";
import RegisterView from "./controller/RegisterView";
import AnswerView from "./controller/AnswerView";
import VoteView from "./controller/VoteView";
import PlayerView from "./PlayerView";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import "./ControllerPage.css";
import ControllerHeader from "./controller/ControllerHeader";

const BASE_URL = "https://ekimbox-server.onrender.com";
// const BASE_URL = "http://localhost:3000";

function ControllerPage() {
  const [name, setName] = useState("");
  const [gameState, setGameState] = useState({});
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
      const currentPlayer = newGameState.players.find(
        (player) => player.id === clientId
      );

      setGameState(newGameState);
      if (currentPlayer) {
        setName(currentPlayer.name);
      }
    });

    socketRef.current.on("disconnect", () => setConnected(false));

    socketRef.current.on("connect_error", (err) => {
      console.error(err.message); // log error message
      setGameState({ stage: "no_room", message: err.message });
    });

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
      ?.filter((q) => q.answers.some((answer) => answer.player.id === clientId))
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

  const handleStartGame = useCallback(() => {
    socketRef.current.emit("startGame", clientId);
  }, [clientId]);

  return (
    <div className="full-screen controller-page">
      <div className="mobile-container">
        <ControllerHeader name={currentPlayer ? currentPlayer.name : ""} />
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
              currentName={currentPlayer ? currentPlayer.name : ""}
              name={name}
              setName={setName}
              handleRegister={handleRegister}
              handleStartGame={handleStartGame}
              gameState={gameState}
              clientId={clientId}
            />
          )}
          {gameState.stage === "answer" && (
            <AnswerView
              prompts={myPrompts}
              socket={socketRef}
              clientId={clientId}
            />
          )}
          {gameState.stage === "vote" && (
            <VoteView
              key={gameState.questions[gameState.subStage]?.prompt}
              questionPrompt={gameState.questions[gameState.subStage]?.prompt}
              answers={gameState.questions[gameState.subStage]?.answers}
              socket={socketRef}
              clientId={clientId}
            />
          )}
          {gameState.stage === "score" && (
            <Card style={{ width: "100%", textAlign: "center" }} size="small">
              <p>You are in 🏆 3rd place! Keep up the good work.</p>
            </Card>
          )}
          {gameState.stage === "end" && (
            <Card style={{ width: "100%", textAlign: "center" }} size="small">
              <p>
                You ended in 3rd place 🏆 Good effort and thanks for playing.
              </p>
            </Card>
          )}
          {gameState.stage === "no_room" && (
            <Card style={{ width: "100%", textAlign: "center" }} size="small">
              <h4>Unable to find room.</h4>
              <p>
                Double-check your room code and try again! (Make sure your
                letters are capitalized!)
              </p>
            </Card>
          )}
        </div>
        <div>{/*<p>Footer section</p>*/}</div>
      </div>
    </div>
  );
}

export default ControllerPage;
