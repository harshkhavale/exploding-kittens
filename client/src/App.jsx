// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "./components/Game";
import Leaderboard from "./components/Leaderboard";
import "./index.css";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <Router>
      <div className="">
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" exact element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
