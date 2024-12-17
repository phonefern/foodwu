import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/cooking.json";
import "../index.css";

const LoadingScreen = () => {
    return (
        <div className="flex justify-center items-center h-screen md:w-1/2 md:mx-auto lg:w-1/3 lg:max-w-[1000px]">
            <Lottie animationData={loadingAnimation} loop={true} style={{ width: "150px", height: "150px", maxWidth: "100%" }} />
        </div>
    );
};

export default LoadingScreen;
