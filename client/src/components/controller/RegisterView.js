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
        maxLength={20}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleRegister}>Set Name</button>

      {gameState.vipID && gameState.vipID === clientId && (
        <button onClick={handleStartGame}>Start Game</button>
      )}
    </>
  );
}

export default RegisterView;
