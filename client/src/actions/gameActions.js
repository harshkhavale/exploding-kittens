export const START_GAME = "START_GAME";
export const DRAW_CARD = "DRAW_CARD";

export const startGame = (username, deck) => {
  return {
    type: START_GAME,
    payload: username,
    deck: deck, // Pass the deck along with the action
  };
};

export const drawCard = () => ({
  type: DRAW_CARD,
});
