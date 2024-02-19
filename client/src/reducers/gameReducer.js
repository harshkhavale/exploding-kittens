// src/reducers/gameReducer.js
import {
  START_GAME,
  DRAW_CARD,
  drawCard,
  SAVE_GAME,
} from "../actions/gameActions";

const initialState = {
  started: false,
  username: "",
  score: 0,
  deck: [],
  drawnCard: null,
  drawnCards: [],
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        started: true,
        username: action.payload,
        deck: action.deck,
        drawnCard: null,
        drawnCards: [],
      };
    case DRAW_CARD:
      if (!state.started) {
        // Game has not started yet
        return state;
      }
      if (state.deck.length === 0) {
        console.log("You win!");
        return state;
      }
      // Create a copy of the deck array before modifying it
      const newDeck = [...state.deck];
      const drawnCard = newDeck.pop(); // Use the copied deck array
      let message, card;
      switch (drawnCard) {
        case "KITTEN":
          // Cat card - Remove from deck
          message = "You drew a cat card 😼";
          card = "KITTEN";
          break;
        case "EXPLODE":
          // Bomb card - Player loses the game
          message = "Game over! You drew an exploding kitten 💣.....";
          card = "EXPLODE";
          break;
        case "DIFFUSE":
          // Defuse card - Remove from deck
          message = "You drew a defuse card 🙅‍♂️";
          card = "DIFFUSE";
          break;
        case "SHUFFLE":
          // Shuffle card - Restart the game and refill the deck
          message = "You drew a shuffle card 🔀";
          card = "SHUFFLE";
          // Implement logic to restart the game and refill the deck
          // You may dispatch a separate action to handle this
          break;
        default:
          break;
      }
      console.log(message);
      return {
        ...state,
        deck: newDeck, // Update with the copied deck array
        drawnCard: card,
        drawnCards: [...state.drawnCards, card],
      };
    case SAVE_GAME:
      return {
        ...state,
        score: state.score + action.count,
      };

    default:
      return state;
  }
};

export default gameReducer;
