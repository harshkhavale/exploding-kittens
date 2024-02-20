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
  saveGame as saveGameAPI,
  fetchLeaderboard as fetchLeaderboardAPI,
} from "../utils/api";
import KittenCard from "./KittenCard";
import Leaderboard from "./Leaderboard";
import LottieAnimation from "./LottieAnimation";
import winanimation from "../assets/win.json";
import lossanimation from "../assets/loss.json";
import { setLeaderboard } from "../actions/leaderboardActions";
const Game = () => {
  const gameState = useSelector((state) => state.game);
  const drawnCards = useSelector((state) => state.game.drawnCards);
  const user = useSelector((state) => state.game.username);
  const leaderboardState = useSelector(
    (state) => state.leaderboard.leaderboard
  );
  const isStarted = useSelector((state) => state.game.started);
  const [username, setUsername] = useState(null);
  const [deck, setDeck] = useState(null);
  const [score, setScore] = useState(null);
  const [img, setImg] = useState(null);
  const [animation, setAnimation] = useState(null);
  const [count, setCount] = useState(0);
  const [toggle, setToggle] = useState(true);
  const [pickedCard, setPickedCard] = useState(null);
  const [message, setMessage] = useState(null);
  const [winners, setWinners] = useState([]);
  const getScoreByUsername = (username, leaderboard) => {
    if (Array.isArray(leaderboard)) {
      for (let i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i].username === username) {
          return leaderboard[i].score;
        }
      }
    }

    return null;
  };

  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Drawn cards:", drawnCards);
    checkWin();
  }, [drawnCards, pickedCard]);

  const checkWin = async () => {
    if (drawnCards.length === 5) {
      setMessage("You Win!");

      setAnimation(winanimation);
      handleSaveGame();
      const response = await fetchLeaderboardAPI();
      dispatch(setLeaderboard(response));

      setWinners(response);
      setTimeout(() => {
        setAnimation(null);
        handleStartGame();
      }, 5000);
    }

    switch (pickedCard) {
      case "KITTEN":
        break;
      case "EXPLODE":
        if (drawnCards.includes("DIFFUSE")) {
          setMessage("You have a defuse card, you're safe!");
          console.log("You have a defuse card, you're safe!");
        } else {
          console.log("You don't have a defuse card, game over!");
          setAnimation(lossanimation);

          setTimeout(() => {
            setAnimation(null);
          }, 5000);

          setTimeout(handleStartGame, 3000);
        }
        break;
      case "SHUFFLE":
        toast("Restarting...,SHUFFLE card's restarts the game!", {
          icon: "👏",
        });
        setTimeout(handleStartGame, 3000);
        break;
      case "DIFFUSE":
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

  const handleSaveGame = async () => {
    setPickedCard(null);
    if (username != null) {
      try {
        const value = getScoreByUsername(username, leaderboardState);
        setScore(value);

        const response = await saveGameAPI(username, count + 1 + score);
        const value2 = getScoreByUsername(username, leaderboardState);
        setScore(value2);
      } catch (error) {
        console.error("Error saving the game:", error);
      }
    } else {
      toast.error("Error saving the game!");
    }
  };
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const response = await fetchLeaderboardAPI();
      dispatch(setLeaderboard(response));
      const value = getScoreByUsername(username, leaderboardState);
      setScore(value);
      setWinners(response);
    };

    fetchLeaderboardData();
  }, [dispatch, score, deck, count]);
  const handleStartGame = async () => {
    setCount(0);
    const response = await fetchLeaderboardAPI();
    dispatch(setLeaderboard(response));

    setWinners(response);
    const value = getScoreByUsername(username, leaderboardState);
    setScore(value);
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
      const newDeck = deck.slice(1);

      setDeck(newDeck);

      setCount(count + 1);
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
                    className="md:w-20 md:h-20 w-12 h-12 rounded-2xl shadow-2xl"
                    alt="img"
                  />
                </>
              ))}
            </div>

            {pickedCard && (
              <div className="flex absolute bottom-0 md:right-0 md:left-auto left-0  w-min shadow-xl bg-white flex-col justify-center items-center">
                <div className="md:text-xl text-sm p-2 text-nowrap  flex justify-center items-center font-bold text-gray-400 mb-2">
                  {message}
                  <div className="flex flex-col p-0 justify-center items-center border border-gray-400">
                    <img
                      src={getimage(pickedCard)}
                      className="w-auto h-12 md:h-20  shadow-2xl"
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
              <div className="flex mt-8 justify-center gap-8 items-center ">
                <button
                  onClick={handleStartGame}
                  className=" font-bold p-2 bg-gray-400 text-white flex justify-center my-8  border-gray-200"
                >
                  Restart
                </button>
                <div className="  font-bold p-2 border flex items-center border-gray-400 justify-center my-8  ">
                  <p className="font-bold text-xs w-min">your score:</p>
                  <p className=" text-5xl">{score}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="bg-sky-300 rounded-2xl p-2 text-white font-bold">
              hi {user}
            </p>
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
