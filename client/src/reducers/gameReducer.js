// src/reducers/gameReducer.js
import { START_GAME, DRAW_CARD, drawCard } from "../actions/gameActions";

const initialState = {
  started: false,
  username: "",
  deck: [], // Initialize with an empty array
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
      if (state.deck?.length === 0) {
        console.log("You win!");
        return state;
      }
      const drawnCard = state.deck.pop();
      let message, card;
      switch (drawnCard) {
        case "KITTEN":
          // Cat card - Remove from deck
          message = "You drew a cat card 😼";
          card = "KITTEN";
          break;
        case "EXPLODE":
          // Bomb card - Player loses the game
          message = "Game over! You drew an exploding kitten 💣";
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
        deck: state.deck,
        drawnCard: card,

        drawnCards: [...state.drawnCards, card],
      };
    default:
      return state;
  }
};

export default gameReducer;
