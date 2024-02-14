import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGame, drawCard } from "../actions/gameActions";
import explode from "../assets/explode.jpg";
import kitten from "../assets/kittens.jpg";

import diffuse from "../assets/deffuse.jpg";

import shuffle from "../assets/shuffle.jpg";

import evilcat from "../assets/evilcat.jpg";
import { toast } from "react-hot-toast";
import {
  startGame as startGameAPI,
  drawCard as drawCardAPI,
  fetchLeaderboard as fetchLeaderboardAPI,
} from "../utils/api";
import KittenCard from "./KittenCard";
import Leaderboard from "./Leaderboard";
import LottieAnimation from "./LottieAnimation";
import winanimation from "../assets/win.json";
import lossanimation from "../assets/loss.json";

const Game = () => {
  const gameState = useSelector((state) => state.game); // Using useSelector to access gameState
  const drawnCards = useSelector((state) => state.game.drawnCards); // Accessing drawnCards from the game state
  const user = useSelector((state) => state.game.username); // Accessing drawnCards from the game state

  const [username, setUsername] = useState(null);
  const [deck, setDeck] = useState(null);
  const [img, setImg] = useState(null);
  const [animation, setAnimation] = useState(null);

  const [toggle, setToggle] = useState(true);
  const [pickedCard, setPickedCard] = useState(null); // State variable to track the picked card
  const [message, setMessage] = useState(null); // State variable to track the picked card
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Drawn cards:", drawnCards);
    checkWin();
  }, [drawnCards, pickedCard]);

  const checkWin = () => {
    if (drawnCards.length === 5) {
      setMessage("You Win!");
      setAnimation(winanimation); // Set the animation

      // Clear the animation after 5 seconds
      setTimeout(() => {
        setAnimation(null);
      }, 5000);
    }

    switch (pickedCard) {
      case "KITTEN":
        break;
      case "EXPLODE":
        // Check if "DIFFUSE" card has been drawn before
        if (drawnCards.includes("DIFFUSE")) {
          setMessage("You have a defuse card, you're safe!");
          console.log("You have a defuse card, you're safe!");
        } else {
          console.log("You don't have a defuse card, game over!");
          setAnimation(lossanimation); // Set the animation

          // Clear the animation after 5 seconds
          setTimeout(() => {
            setAnimation(null);
          }, 5000);
          // Introduce a delay of 5 seconds before restarting the game
          setTimeout(handleStartGame, 3000); // Restart the game after 5 seconds
        }
        break;
      case "SHUFFLE":
        // Introduce a delay of 5 seconds before restarting the game
        toast("Restarting...,SHUFFLE card's restarts the game!", {
          icon: "👏",
        });
        setTimeout(handleStartGame, 3000); // Restart the game after 5 seconds
        break;
      case "DIFFUSE":
        // Handle diffuse logic
        break;
      default:
        return null;
    }
  };

  const getimage = (name) => {
    switch (name) {
      case "KITTEN":
        return kitten;
        break;
      case "EXPLODE":
        return explode;
        break;
      case "SHUFFLE":
        return shuffle;
        break;
      case "DIFFUSE":
        return diffuse;
        break;
      default:
        return null;
    }
  };

  const handleStartGame = async () => {
    setPickedCard(null);
    if (username != null) {
      try {
        const response = await startGameAPI(username);
        dispatch(startGame(username, response.deck));
        setDeck(response.deck);
      } catch (error) {
        console.error("Error starting game:", error);
      }
    } else {
      toast.error("Please enter a username to start the game.");
    }
  };

  const handleDrawCard = async () => {
    try {
      const response = await drawCardAPI();
      dispatch(drawCard());

      setPickedCard(response.card);
      setMessage(response.message);

      // Call checkWin immediately after setting the state

      console.log("drawns:", drawnCards);
    } catch (error) {
      console.error("Error drawing card:", error);
    }
  };

  return (
    <div className="w-[110vw] md:w-[100vw] h-[100vh]  flex justify-center items-center">
      {animation && <LottieAnimation animation={animation} />}
      <div className="container flex flex-col justify-center items-center gap-4 mx-auto bg-white  w-min shadow-2xl p-8">
        <h1 className="md:text-5xl text-3xl font-bold  my-8 text-nowrap ">
          Exploding Kitten Game
        </h1>

        {!gameState.started ? (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border font-semibold text-3xl  p-4"
            />
            <button
              onClick={handleStartGame}
              className=" font-bold p-4 bg-gray-400 text-white  border-gray-200"
            >
              Start Game
            </button>
          </div>
        ) : toggle ? (
          <div className="flex flex-col justify-center items-center gap-8">
            <div className="nav absolute md:w-4/12 md:top-4  top-10 bg-white flex font-bold justify-around items-center w-full rounded-3xl border-4 border-gray-300">
              <p
                className=" cursor-pointer w-5/12 text-center"
                onClick={() => setToggle(true)}
              >
                Home
              </p>
              <div className=" bg-gray-300 h-8 md:h-16 p-[2.5px]" />
              <p
                className=" cursor-pointer w-5/12 text-center"
                onClick={() => setToggle(false)}
              >
                leaderboard
              </p>
            </div>
            <div className="flex gap-2">
              {drawnCards?.map((card, index) => (
                <>
                  <img
                    src={getimage(card)}
                    className="w-20 h-20 rounded-2xl shadow-2xl"
                    alt="img"
                  />
                </>
              ))}
            </div>

            {pickedCard && (
              <div className="flex absolute bottom-20 md:right-0 md:left-auto left-0  w-min shadow-xl bg-white flex-col justify-center items-center">
                <div className="md:text-xl text-sm p-2 text-nowrap  flex justify-center items-center font-bold text-gray-400 mb-2">
                  {message}
                  <div className="flex flex-col p-0 justify-center items-center border border-gray-400">
                    <img
                      src={getimage(pickedCard)}
                      className="w-20 h-20  shadow-2xl"
                      alt="img"
                    />
                    {pickedCard}
                  </div>
                </div>
              </div>
            )}
            <div>
              <div className="flex justify-center items-center gap-2">
                {deck?.map((card, index) => (
                  <KittenCard key={index} handler={handleDrawCard} />
                ))}
              </div>
              <button
                onClick={handleStartGame}
                className=" font-bold p-2 bg-gray-400 text-white flex justify-center my-8  border-gray-200"
              >
                Restart
              </button>
            </div>
          </div>
        ) : (
          <>
            <p>hi {user}</p>
            <div className="nav absolute md:w-4/12 md:top-4  top-10 bg-white flex font-bold justify-around items-center w-full rounded-3xl border-4 border-gray-300">
              <p
                className=" cursor-pointer w-5/12 text-center"
                onClick={() => setToggle(true)}
              >
                Home
              </p>
              <div className=" bg-gray-300 h-8 md:h-16 p-[2.5px]" />
              <p
                className=" cursor-pointer w-5/12 text-center"
                onClick={() => setToggle(false)}
              >
                leaderboard
              </p>
            </div>
            <Leaderboard />
          </>
        )}
      </div>
      <div className="fixed top-0 start-0 md:relative -z-40 h-screen w-auto">
        <img
          src={evilcat}
          className=" w-full h-[100vh] object-cover object-center"
          alt=""
        />
      </div>
    </div>
  );
};

export default Game;
