import React from "react";
import { Card, Input, Button, Space } from "antd";

function RegisterView({
  currentName,
  name,
  setName,
  handleRegister,
  handleStartGame,
  gameState,
  clientId,
}) {
  return (
    <>
      <Card style={{ width: "100%" }} size="small">
        <Space direction="vertical" style={{ width: "100%" }}>
          <h4>Name</h4>
          <Input
            type="text"
            value={name}
            size="large"
            showCount
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            block
            size="large"
            type="primary"
            onClick={handleRegister}
            disabled={name.length === 0}
          >
            {currentName ? "Change Name" : "Join Game"}
          </Button>
        </Space>
      </Card>
      {gameState.vipID && gameState.vipID === clientId && (
        <Card
          style={{ marginTop: 16, width: "100%", textAlign: "center" }}
          size="small"
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <h4>👑 Super Secret VIP controls 👑</h4>
            <Button
              block
              type="primary"
              disabled={gameState.players.length < 2}
              onClick={handleStartGame}
            >
              Start Game
            </Button>
          </Space>
        </Card>
      )}
    </>
  );
}

export default RegisterView;
