// src/components/Leaderboard.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeaderboard,
  setLeaderboard,
} from "../actions/leaderboardActions";
import { fetchLeaderboard as fetchLeaderBoardAPI } from "../utils/api";

const Leaderboard = () => {
  const leaderboardState = useSelector(
    (state) => state.leaderboard.leaderboard
  );
  const dispatch = useDispatch();
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const response = await fetchLeaderBoardAPI();
      dispatch(setLeaderboard(response));
      // console.log("leaderState", leaderboardState);

      setWinners(response);
    };

    fetchLeaderboardData();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <p className="font-semibold text-xs">scroll to view</p>

      <div className="overflow-x-auto h-[30vh] overflow-y-scroll">
        <table className="table-auto relative w-full">
          <thead>
            <tr className="bg-gray-300 sticky z-50 top-0">
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {winners &&
              winners.map((winner, index) => (
                <tr key={index} className="font-bold">
                  <td className="border-2 px-4 py-2">{index + 1}</td>
                  <td className="border-2 px-4 py-2">{winner.username}</td>
                  <td className="border-2 px-4 py-2">{winner.score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
