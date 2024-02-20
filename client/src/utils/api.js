import axios from "axios";
const API_URL = "http://localhost:10000"; // Replace with your backend API URL
// Function to start a new game
export const startGame = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/start-game`, { username });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to draw a card
export const drawCard = async () => {
  try {
    const response = await axios.post(`${API_URL}/draw-card`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to save game state
export const saveGame = async (username, score) => {
  try {
    const response = await axios.post(`${API_URL}/save-game`, {
      username,
      score,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`);
    console.log("leader", response.data);
    // dispatch(response.data);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
