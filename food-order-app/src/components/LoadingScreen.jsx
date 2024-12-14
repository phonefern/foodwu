import React from "react";

const LoadingScreen = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <img
            src="../src/Loading.gif"
            alt="Loading..."
            className="w-1/5"
        />
    </div>
);

export default LoadingScreen;