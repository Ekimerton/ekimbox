import React from "react";

function RegisterView({
  name,
  setName,
  handleRegister,
  handleStartGame,
  gameState,
  clientId,
}) {
  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleRegister}>Set Name</button>

      <button
        onClick={handleStartGame}
        disabled={!gameState.vipID || gameState.vipID !== clientId}
      >
        Start Game
      </button>
      <h3>Players</h3>
      {gameState.players &&
        gameState.players.map((player) => <p key={player.id}>{player.name}</p>)}
    </>
  );
}

export default RegisterView;
