// src/components/Leaderboard.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../actions/leaderboardActions";

const Leaderboard = () => {
  const leaderboard = useSelector((state) => state.leaderboard);
  console.log(leaderboard);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <ul>
        {Object.entries(leaderboard).map(([username, score]) => (
          <li key={username} className="mb-2">
            {username}: {score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
