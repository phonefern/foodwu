import React from "react";

const EnableSoundModal = ({ enableSound }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-lg font-semibold mb-4">Enable Notifications</h2>
                <p className="text-gray-600 mb-4">Click below to enable sound notifications for new orders.</p>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={enableSound}
                >
                    Enable Sound
                </button>
            </div>
        </div>
    );
};

export default EnableSoundModal;
