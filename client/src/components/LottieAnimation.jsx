import React from "react";
import Lottie from "lottie-react";

const LottieAnimation = ({ animation }) => {
  return (
    <div
      className="h-screen w-screen fixed Z-50 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 flex justify-center items-center
"
    >
      <Lottie
        animationData={animation}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "22rem" }}
      />
    </div>
  );
};

export default LottieAnimation;
