import { combineReducers } from "redux";
import gameReducer from "./gameReducer";
import leaderboardReducer from "./leaderboardReducer";

const rootReducer = combineReducers({
  game: gameReducer,
  leaderboard: leaderboardReducer,
});

export default rootReducer;
