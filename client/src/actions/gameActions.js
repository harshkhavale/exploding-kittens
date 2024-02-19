export const START_GAME = "START_GAME";
export const DRAW_CARD = "DRAW_CARD";
export const SAVE_GAME = "SAVE_CARD";

export const startGame = (username, deck) => {
  return {
    type: START_GAME,
    payload: username,
    deck: deck,
  };
};
export const saveGame = (username, count) => {
  return {
    type: SAVE_GAME,
    username: username,
    score: count,
  };
};

export const drawCard = () => ({
  type: DRAW_CARD,
});
