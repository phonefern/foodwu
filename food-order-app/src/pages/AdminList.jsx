import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) return;

            try {
                const ordersRef = collection(db, "orders");
                const q = query(
                    ordersRef,
                    where("userId", "==", userId),
                    where("status", "==", "confirm")
                );
                const querySnapshot = await getDocs(q);

                const orderItems = [];
                querySnapshot.forEach((doc) => {
                    const { items } = doc.data();
                    if (items && Array.isArray(items)) {
                        items.forEach((item) => {
                            orderItems.push({
                                ...item,
                                orderId: doc.id, // Save the document ID for updating
                            });
                        });
                    }
                });

                setOrders(orderItems);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [userId]);

    const handleCompleteOrders = async () => {
        try {
            const ordersRef = collection(db, "orders");
            const q = query(
                ordersRef,
                where("userId", "==", userId),
                where("status", "==", "confirm")
            );
            const querySnapshot = await getDocs(q);

            const batchUpdates = [];
            querySnapshot.forEach((doc) => {
                const docRef = doc.ref;
                batchUpdates.push(updateDoc(docRef, { status: "completed" }));
            });

            // Execute all updates
            await Promise.all(batchUpdates);

            // Navigate back or update UI
            console.log("Orders successfully marked as completed.");
            navigate(`/admin-orders`);
        } catch (error) {
            console.error("Error updating orders:", error);
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-700 cursor-pointer"
                        onClick={() => navigate(`/dashboard/${userId}`)}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                    <h1 className="text-xl font-bold text-gray-700">
                        <span className="ml-2">รายการอาหารที่สั่ง</span>
                    </h1>
                </div>
            </div>
            <div className="space-y-4">
                {orders.map((order, index) => (
                    <div
                        key={index}
                        className="flex items-start justify-between border-b pb-2"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded text-sm font-medium text-gray-700">
                                {order.quantity}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">{order.name}</p>
                                <p className="text-sm text-gray-500">เพิ่มเติม: {order.description}</p>
                                {order.addOns?.length > 0 && (
                                    <ul className="text-sm text-gray-500">
                                        {order.addOns.map((addon, i) => (
                                            <li key={i}>- {addon.name}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">
                                ฿{order.totalPrice}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-4">
                <p className="font-bold text-[#34A853]">ทั้งหมด</p>
                <p className="text-sm font-medium text-gray-700">
                    ฿{orders.reduce((acc, order) => acc + order.quantity * order.totalPrice, 0).toFixed(2)}
                </p>
            </div>
            <div
                className="fixed bottom-4 left-4 right-4 bg-[#34A853] text-white px-4 py-1 rounded-md shadow-lg flex items-center justify-between cursor-pointer hover:bg-green-600 transition sm:left-1/2 sm:transform sm:-translate-x-1/2"
                style={{ zIndex: 100 }}
                onClick={handleCompleteOrders}
            >
                <div className="flex items-center">
                    <span className="bg-white text-green-500 font-bold px-2 rounded-full mr-3">
                        {orders.reduce((acc, order) => acc + order.quantity, 0)}
                    </span>
                    <span className="font-bold text-lg">ทำอาหารเสร็จสิ้น</span>
                </div>
                <span className="font-bold text-lg">
                    ฿{orders.reduce((acc, order) => acc + order.quantity * order.totalPrice, 0).toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default OrderList;
