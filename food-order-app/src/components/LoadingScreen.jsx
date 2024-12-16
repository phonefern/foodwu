import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/progress-bar.json";

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <Lottie animationData={loadingAnimation} loop={false} style={{width: "150px", height: "150px"}} />
        </div>
    );
};

export default LoadingScreen;
