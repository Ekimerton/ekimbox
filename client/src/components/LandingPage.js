import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import axios from "axios"; // You can use any library to make HTTP requests
import { Button, Card, Skeleton, Input } from "antd";

const BASE_URL = "https://ekimbox-server.onrender.com";
// const BASE_URL = "http://localhost:3000";

function LandingPage() {
  const [gameIdInput, setGameIdInput] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinGame = () => {
    navigate(`/play/${gameIdInput}`);
  };

  const handleCreateGame = async () => {
    try {
      setCreateLoading(true);
      const response = await axios.post(`${BASE_URL}/createGame`);
      setCreateLoading(false);
      const gameId = response.data.gameId;
      navigate(`/host/${gameId}`);
    } catch (error) {
      setCreateLoading(false);
      console.error("Failed to create game", error);
    }
  };

  return (
    <div className="column-view" style={{ justifyContent: "center" }}>
      <div className="mobile-container">
        <div className="section-centered">
          <div className="logo-section">
            <h1>Ekimbox</h1>
          </div>
          <div style={{ width: "100%", maxWidth: 400 }}>
            <p>Room Code</p>
            <Input
              type="text"
              placeholder="AFC7"
              size="large"
              value={gameIdInput}
              style={{ marginBottom: 12 }}
              onChange={(e) => {
                const gameId = e.target.value;
                if (gameId.length <= 4) {
                  setGameIdInput(gameId.toUpperCase());
                }
              }}
            />
            <Button
              size="large"
              type="primary"
              block
              onClick={handleJoinGame}
              disabled={gameIdInput.length < 4}
            >
              Join Game
            </Button>
          </div>
          <p style={{ textAlign: "center" }}>or</p>
          <Card size="small" title="Jokelash" className="game-card">
            <div className="game-card-content">
              <p style={{ marginTop: 0 }}>
                Gather 'round, party people! For a rip-roaring game made for 3-8
                laugh-lovers! 🎉 In just a quick 10-minute flash, you'll be
                dishing out giggles with your zany answers to quirky prompts.
                Then, put on your judge's hat and pick your favs. Ready for a
                laughter rollercoaster? 🎢🤣📝
              </p>
              <Button
                type="primary"
                loading={createLoading}
                onClick={handleCreateGame}
              >
                Create Game
              </Button>
            </div>
          </Card>
          <Card
            size="small"
            title="More games coming soon"
            className="game-card"
          >
            <div className="game-card-content">
              <Skeleton
                title={null}
                paragraph={{ rows: 4 }}
                style={{ marginTop: 8, marginBottom: 16 }}
              />
              <Button type="primary" disabled onClick={handleCreateGame}>
                Coming Soon!
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
