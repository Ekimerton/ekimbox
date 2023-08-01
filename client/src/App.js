import React from "react";
import ControllerPage from "./components/ControllerPage";
import HostPage from "./components/HostPage";
import LandingPage from "./components/LandingPage";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/host/:gameId" element={<HostPage />} />
      <Route path="/play/:gameId" element={<ControllerPage />} />
    </Routes>
  );
}

export default App;
