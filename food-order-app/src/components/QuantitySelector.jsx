import React from "react";

const QuantitySelector = ({ quantity, setQuantity }) => (
    <div className="flex items-center">
        <button
            onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            className="w-8 h-8 border rounded-l-lg flex items-center justify-center bg-gray-100"
        >
            -
        </button>
        <span className="w-12 h-8 border-t border-b flex items-center justify-center text-lg">
            {quantity}
        </span>
        <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 border rounded-r-lg flex items-center justify-center bg-gray-100"
        >
            +
        </button>
    </div>
);

export default QuantitySelector;