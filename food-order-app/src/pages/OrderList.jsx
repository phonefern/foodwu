import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
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
                console.log("Fetching orders for userId:", userId);

                const ordersRef = collection(db, "orders");
                const q = query(
                    ordersRef,
                    where("userId", "==", userId),
                    where("status", "==", "pending")
                );
                const querySnapshot = await getDocs(q);

                console.log("Query snapshot size:", querySnapshot.size);

                const orderItems = [];
                querySnapshot.forEach((doc) => {
                    console.log("Document ID:", doc.id, "Data:", doc.data());

                    const { items } = doc.data();
                    if (items && Array.isArray(items)) {
                        items.forEach((item) => {
                            console.log("Processing item:", item);
                            orderItems.push(item);
                        });
                    } else {
                        console.warn("Items field missing or not an array in doc:", doc.id);
                    }
                });

                setOrders(orderItems);
                console.log("Fetched order items:", orderItems);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [userId]);

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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    <h1 className="text-xl font-bold text-gray-700">
                        <span className="ml-2">รายการอาหารที่สั่ง</span>
                    </h1>
                </div>
                <span
                    className="text-sm text-[#34A853] font-normal cursor-pointer"
                    onClick={() => navigate(`/dashboard/${userId}`)} 
                >
                    สั่งอาหารเพิ่มเติม
                </span>
            </div>
            <div className="space-y-4">
                {orders.map((order, index) => (
                    <div
                        key={index}
                        className="flex items-start justify-between border-b pb-2"
                    >
                        <div className="flex items-center space-x-2">
                            {/* Quantity Box */}
                            <div className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded text-sm font-medium text-gray-700">
                                {order.quantity}
                            </div>
                            {/* Order Name and Details */}
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
                        {/* Price */}
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">
                                ${order.totalPrice}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-4">
                <p className="font-bold text-[#34A853]">ทั้งหมด</p>
                <p className="text-sm font-medium text-gray-700">
                    ${orders.reduce((acc, order) => acc + order.quantity * order.totalPrice, 0).toFixed(2)}
                </p>
            </div>
            <div
                className="fixed bottom-4 left-4 right-4 bg-[#34A853] text-white px-4 py-1 rounded-md shadow-lg flex items-center justify-between cursor-pointer"
                style={{ zIndex: 100 }}
                onClick={() => navigate(`/dashboard/${userId}`)} 
            >
                <div className="flex items-center">
                    <span className="bg-white text-green-500 font-bold px-2 rounded-full mr-3">
                        {orders.reduce((acc, order) => acc + order.quantity, 0)}
                    </span>
                    <span className="font-bold text-lg"> สั่งเลย</span>
                </div>
                <span className="font-bold text-lg">
                    ${orders.reduce((acc, order) => acc + order.quantity * order.totalPrice, 0).toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default OrderList;