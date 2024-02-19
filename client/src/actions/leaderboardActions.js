// src/actions/leaderboardActions.js
export const FETCH_LEADERBOARD = "FETCH_LEADERBOARD";
export const SET_LEADERBOARD = "SET_LEADERBOARD";

export const fetchLeaderboard = () => ({
  type: FETCH_LEADERBOARD,
});

export const setLeaderboard = (response) => ({
  type: SET_LEADERBOARD,
  leaderboard: response,
});
