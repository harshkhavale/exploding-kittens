import React from "react";
import kitten from "../assets/evilcat.jpg";
const KittenCard = ({ handler }) => {
  return (
    <div
      onClick={handler}
      className=" cursor-pointer border border-gray-500 w-2/12  shadow-2xl"
    >
      <img src={kitten} alt="" className=" h-full w-full" />
    </div>
  );
};

export default KittenCard;
