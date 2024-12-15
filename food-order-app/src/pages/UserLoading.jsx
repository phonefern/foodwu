import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Lottie from 'lottie-react';
import loadingAnimation from "../assets/loading.json";

const UserLoading = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [userOrders, setUserOrders] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersRef = collection(db, "orders");
                const q = query(ordersRef, where("userId", "==", userId));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const orders = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setUserOrders(orders);
                } else {
                    setUserOrders([]);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setUserOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
                {/* Lottie Animation */}
                <Lottie
                    animationData={loadingAnimation}
                    loop={true}
                    style={{ width: "100px", height: "100px", margin: "0 auto" }}
                />

                {/* Animated Text */}
                <h1 className="font-bold text-4xl mt-4">
                    กำลังทำอาหาร
                    <span className="loading-dots"></span>
                </h1>

                {/* User Info */}
                <h2 className="text-xl mt-2">
                    OrderId: {userId}
                </h2>
            </div>
        </div>
    );
};

export default UserLoading;
