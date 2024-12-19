import React, { useEffect, useState, useRef } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Replace with your Firebase config
import OrderList from "../components/OrderList";
import EnableSoundModal from "../components/EnableSoundModal";
import NewOrderModal from "../components/NewOrderModal";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [groupedOrders, setGroupedOrders] = useState([]);
    const [newOrder, setNewOrder] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const previousOrdersLength = useRef(0);
    const audioRef = useRef(new Audio("/assets/sounds/noti.mp3"));

    useEffect(() => {
       
        const soundPreference = localStorage.getItem("soundEnabled");
        if (soundPreference === "true") {
            setSoundEnabled(true);
        }

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

          
            if (fetchedOrders.length > previousOrdersLength.current) {
                setNewOrder(true);
                setShowModal(true);
                if (soundEnabled) playNotificationSound();
            } else {
                setShowModal(false);
            }

            previousOrdersLength.current = fetchedOrders.length;

            const grouped = fetchedOrders.reduce((acc, order) => {
                if (!acc[order.userId]) {
                    acc[order.userId] = { orders: [], totalPrice: 0 };
                }
                acc[order.userId].orders.push(order);
                acc[order.userId].totalPrice += order.totalPrice;
                return acc;
            }, {});

            const sortedGroupedOrders = Object.entries(grouped).sort(([_, a], [__, b]) => {
                return new Date(b.orders[0].timestamp) - new Date(a.orders[0].timestamp);
            });

            setGroupedOrders(sortedGroupedOrders);
        });

        return () => unsubscribe();
    }, [soundEnabled]);

    const playNotificationSound = () => {
        const audio = audioRef.current;
        audio.loop = true;
        audio.play().catch((error) => console.error("Error playing notification sound:", error));
    };

    const stopNotificationSound = () => {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
    };

    const formatRelativeTime = (timestamp) => {
        const orderTime = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - orderTime) / 60000);

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? "s" : ""} ago`;
        return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? "s" : ""} ago`;
    };

    const handleConfirm = () => {
        setShowModal(false);
        stopNotificationSound();
        setNewOrder(false);
    };

    const enableSound = () => {
        setSoundEnabled(true);
        localStorage.setItem("soundEnabled", "true"); 
    };

    return (
        <div className="p-4 bg-gray-200 min-h-screen">
           
            {!soundEnabled && <EnableSoundModal enableSound={enableSound} />}
            <div className="flex items-center justify-between mb-6">
                <img src="\assets\img\home.png" alt="home icon" className="w-5 h-5" />
                <h1 className="text-xl font-semibold text-center flex-grow text-center">
                    Today's Orders
                </h1>
                <img src="\assets\img\option.png" alt="option icon" className="w-5 h-5" />
            </div>
            <OrderList groupedOrders={groupedOrders} formatRelativeTime={formatRelativeTime} />
       
            {showModal && <NewOrderModal handleConfirm={handleConfirm} />}
        </div>
    );
};

export default AdminOrders;
