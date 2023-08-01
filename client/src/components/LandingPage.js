import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // You can use any library to make HTTP requests

function LandingPage() {
  const [gameIdInput, setGameIdInput] = useState("");
  const navigate = useNavigate();

  const handleJoinGame = () => {
    navigate(`/play/${gameIdInput}`);
  };

  const handleCreateGame = async () => {
    try {
      const response = await axios.post(
        "https://ekimbox-server.onrender.com/createGame"
      );
      const gameId = response.data.gameId;
      navigate(`/host/${gameId}`);
    } catch (error) {
      console.error("Failed to create game", error);
    }
  };

  return (
    <div className="column-view">
      <div className="container">
        <button onClick={handleCreateGame}>Create Game</button>
        <input
          type="text"
          placeholder="AFC7"
          value={gameIdInput}
          onChange={(e) => setGameIdInput(e.target.value)}
        />
        <button onClick={handleJoinGame}>Join Game</button>
      </div>
    </div>
  );
}

export default LandingPage;
