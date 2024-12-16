import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Replace with your Firebase config
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [groupedOrders, setGroupedOrders] = useState({});
    const navigate = useNavigate();

    // Fetch orders in real-time
    useEffect(() => {
        const ordersRef = collection(db, "orders");
        const q = query(
            ordersRef,
            where("status", "==", "confirm"),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedOrders = [];
            querySnapshot.forEach((doc) => {
                const orderData = doc.data();
                const items = orderData.items || [];
                const totalPrice = items.reduce((total, item) => total + item.totalPrice, 0);

                fetchedOrders.push({
                    id: doc.id,
                    userId: orderData.userId || "Unknown User",
                    totalPrice,
                    items,
                    timestamp: orderData.timestamp || new Date().toISOString(),
                    status: orderData.status || "pending",
                });
            });

            setOrders(fetchedOrders);

            // Group orders by userId
            const grouped = fetchedOrders.reduce((acc, order) => {
                if (!acc[order.userId]) {
                    acc[order.userId] = {
                        orders: [],
                        totalPrice: 0,
                    };
                }
                acc[order.userId].orders.push(order);
                acc[order.userId].totalPrice += order.totalPrice;
                return acc;
            }, {});
            setGroupedOrders(grouped);
        });

        // Cleanup the subscription
        return () => unsubscribe();
    }, []);

    // Format timestamp to relative time
    const formatRelativeTime = (timestamp) => {
        const orderTime = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - orderTime) / 60000);

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? "s" : ""} ago`;
        return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? "s" : ""} ago`;
    };

    return (
        <div className="p-4 bg-gray-200 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                {/* Home Icon */}
                <img src="\assets\img\home.png" alt="home icon" className="w-5 h-5" />

                {/* Centered Heading */}
                <h1 className="text-xl font-semibold text-center flex-grow text-center">
                    Today's Orders
                </h1>

                {/* Option Icon */}
                <img src="\assets\img\option.png" alt="option icon" className="w-5 h-5" />
            </div>

            {Object.entries(groupedOrders).map(([userId, userOrders]) => (
                <div key={userId} className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer" onClick={() => navigate(`/admin-list/${userId}`)}>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold">
                            ID: <span className="text-gray-800">{userId}</span>
                        </p>
                        <p className="text-green-600 font-bold">
                            Total: {userOrders.totalPrice.toFixed(2)} THB
                        </p>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">{formatRelativeTime(userOrders.orders[0].timestamp)}</p>

                    <ul className="text-gray-700">
                        {userOrders.orders.map((order) => (
                            <li key={order.id} className="flex justify-between text-sm">
                                <div>
                                    • {order.items.map((item, index) => (
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

export default AdminOrders;
