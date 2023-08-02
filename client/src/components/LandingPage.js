import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // You can use any library to make HTTP requests

// const BASE_URL = "https://ekimbox-server.onrender.com";
const BASE_URL = "http://localhost:3000";

function LandingPage() {
  const [gameIdInput, setGameIdInput] = useState("");
  const navigate = useNavigate();

  const handleJoinGame = () => {
    navigate(`/play/${gameIdInput}`);
  };

  const handleCreateGame = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/createGame`);
      const gameId = response.data.gameId;
      navigate(`/host/${gameId}`);
    } catch (error) {
      console.error("Failed to create game", error);
    }
  };

  return (
    <div className="column-view" style={{ justifyContent: "center" }}>
      <div className="mobile-container">
        <div className="section-centered">
          <h1>Ekimbox</h1>
          <button onClick={handleCreateGame}>Create Game</button>
          <p>or</p>
          <input
            type="text"
            placeholder="AFC7"
            value={gameIdInput}
            onChange={(e) => {
              const gameId = e.target.value;
              if (gameId.length <= 4) {
                setGameIdInput(gameId.toUpperCase());
              }
            }}
          />
          <button onClick={handleJoinGame}>Join Game</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
