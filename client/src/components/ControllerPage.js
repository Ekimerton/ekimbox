import React, { useState, useEffect, useRef, useCallback } from "react";
import Timer from "./Timer";
import RegisterView from "./RegisterView";
import PlayerView from "./PlayerView";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";

// const BASE_URL = "https://ekimbox-server.onrender.com";
const BASE_URL = "http://localhost:3000";

function ControllerPage() {
  const [name, setName] = useState("");
  const [gameState, setGameState] = useState({});
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
      setGameState(newGameState);
      console.log(newGameState);
      setName(
        newGameState.players.find((player) => player.id === clientId)?.name
      );
    });
    socketRef.current.on("disconnect", () => setConnected(false));
    socketRef.current.emit("ready");

    return () => {
      socketRef.current.off("gameState");
      socketRef.current.off("connect");
      socketRef.current.off("disconnect");
      socketRef.current.close();
    };
  }, [gameId, clientId]);

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

  const handleAnswer = useCallback(() => {
    socketRef.current.emit("newAnswer", { userId: clientId, answer });
    setAnswer("");
  }, [clientId, answer]);

  const handleVote = useCallback(() => {
    socketRef.current.emit("newVote", { userId: clientId, vote });
    setVote("");
  }, [clientId, vote]);

  const handleStartGame = useCallback(() => {
    socketRef.current.emit("startGame", clientId);
  }, [clientId]);

  if (!gameState.stage) {
    return <p>Loading...</p>;
  }

  return (
    <div className="column-view">
      <div className="container">
        <p>{connected ? "Connected" : "Lost Connection"}</p>
        {gameState.timeEnd && <Timer timeEnd={gameState.timeEnd} />}
        {/*<pre>JSON.stringify(gameState, null, 4)</pre>*/}
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
            <p>{gameState.prompt}</p>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button onClick={handleAnswer}>Submit Answer</button>
          </>
        )}
        {gameState.stage === "vote" && (
          <>
            <button>{gameState.comparisonPairs[gameState.subStage][0]}</button>
            <button>{gameState.comparisonPairs[gameState.subStage][1]}</button>
          </>
        )}
        {gameState.stage === "score" && <PlayerView gameState={gameState} />}
        {gameState.stage === "end" && <p>Thanks for playing!</p>}
      </div>
    </div>
  );
}

export default ControllerPage;
