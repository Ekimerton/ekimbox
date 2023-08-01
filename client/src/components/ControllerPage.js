import React, { useState, useEffect } from "react";
import Timer from "./Timer";
import RegisterView from "./RegisterView";
import ScoreView from "./ScoreView";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";

function ControllerPage() {
  const [name, setName] = useState("");
  const [gameState, setGameState] = useState({});
  const [answer, setAnswer] = useState("");
  const [vote, setVote] = useState("");
  const [connected, setConnected] = useState(true);

  const { gameId } = useParams();
  const socket = io(`https://ekimbox-server.onrender.com/game/${gameId}`);

  // Check if the client already has an ID in local storage
  let clientId = localStorage.getItem("clientId");

  // If not, generate a new ID and store it in local storage
  if (!clientId) {
    clientId = uuidv4();
    localStorage.setItem("clientId", clientId);
  }

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
    });
    socket.on("gameState", (newGameState) => {
      setGameState(newGameState);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.emit("ready");

    return () => {
      socket.off("gameState");
      socket.off("connect");
      socket.off("disconnect");
      socket.close();
    };
  }, [socket]);

  const handleRegister = () => {
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
    socket.emit("register", { id: clientId, name: name });
  };

  const handleAnswer = () => {
    socket.emit("newAnswer", { userId: clientId, answer });
    setAnswer("");
  };

  const handleVote = () => {
    socket.emit("newVote", { userId: clientId, vote });
    setVote("");
  };

  const handleStartGame = () => {
    socket.emit("startGame", clientId);
  };

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
        {gameState.stage === "score" && (
          <ScoreView gameState={gameState} clientId={clientId} />
        )}
        {gameState.stage === "end" && <p>Thanks for playing!</p>}
      </div>
    </div>
  );
}

export default ControllerPage;
