import React from "react";

const MenuItem = ({ image, name, price }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={image} alt={name} className="w-full h-32 object-cover" />
            <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700">{name}</h3>
                <p className="text-sm text-gray-500">${price}</p>
            </div>
        </div>
    );
};

export default MenuItem;