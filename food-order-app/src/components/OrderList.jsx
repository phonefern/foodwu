import React from "react";
import { useNavigate } from "react-router-dom";

const OrderList = ({ groupedOrders, formatRelativeTime }) => {
    const navigate = useNavigate();

    return (
        <div>
            {groupedOrders.map(([userId, userOrders]) => (
                <div
                    key={userId}
                    className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer"
                    onClick={() => navigate(`/admin-list/${userId}`)}
                >
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold">
                            ID: <span className="text-gray-800">{userId}</span>
                        </p>
                        <p className="text-green-600 font-bold">
                            Total: {userOrders.totalPrice.toFixed(2)} THB
                        </p>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                        {formatRelativeTime(userOrders.orders[0].timestamp)}
                    </p>
                    <ul className="text-gray-700">
                        {userOrders.orders.map((order) => (
                            <li key={order.id} className="flex justify-between text-sm">
                                <div>
                                    •{" "}
                                    {order.items.map((item, index) => (
                                        <span key={index}>
                                            {item.name}
                                            <span className="text-gray-500"> ({item.quantity}x)</span>
                                            {index < order.items.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default OrderList;
