// src/reducers/leaderboardReducer.js
import { SET_LEADERBOARD } from "../actions/leaderboardActions";

const initialState = {
  leaderboard: [],
};

const leaderboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LEADERBOARD:
      return {
        leaderboard: action.leaderboard,
      };
    default:
      return state;
  }
};

export default leaderboardReducer;
