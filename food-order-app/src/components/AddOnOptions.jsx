import React from "react";

const AddOnOptions = ({ addOnOptions, selectedAddOns, handleAddOnChange }) => (
    <div className="mb-6">
        <h2 className="text-lg font-medium mb-2 px-2">เพิ่ม</h2>
        <p className="text-gray-500 text-sm mb-4 px-2">Choose your options</p>
        <div className="space-y-2">
            {addOnOptions.map((option, index) => (
                <div key={index} className="flex items-center px-2">
                    <input
                        type="checkbox"
                        id={`option-${index}`}
                        className="mr-2"
                        checked={selectedAddOns.some((selected) => selected.name === option.name)}
                        onChange={() => handleAddOnChange(option)}
                    />
                    <label htmlFor={`option-${index}`} className="flex-1">
                        {option.name}
                    </label>
                    <span className="text-sm text-gray-500">+ ${option.price.toFixed(2)}</span>
                </div>
            ))}
        </div>
    </div>
);

export default AddOnOptions;