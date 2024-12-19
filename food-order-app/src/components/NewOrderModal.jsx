import React from "react";

const NewOrderModal = ({ handleConfirm }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
            <h2 className="text-lg font-semibold mb-4">ออเดอร์ใหม่เข้ามา!</h2>
            <p className="text-gray-600 mb-4">กดยืนยันออเดอร์?</p>
            <button
                className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleConfirm}
            >
                ยืนยัน
            </button>
        </div>
    </div>
);

export default NewOrderModal;
