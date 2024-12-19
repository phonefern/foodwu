import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/cooking2.json";
import completedAnimation from "../assets/complete.json";

const UserLoading = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [userOrders, setUserOrders] = useState([]);
    const [status, setStatus] = useState("confirm");

    useEffect(() => {
        if (!userId) return;

        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", userId), where("status", "==", "confirm"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty) {
                setStatus("completed");
                setUserOrders([]);
            } else {
                const orders = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserOrders(orders);

                const orderStatus = orders[0]?.status || "none";
                setStatus(orderStatus);
                if (orderStatus !== "confirm") {
                    setLoading(false); 
                }
            }
        });

        return () => unsubscribe();
    }, [userId]);

    // Calculate the total price
    const totalPrice = userOrders.reduce((acc, order) => {
        const items = order.items || [];
        return acc + items.reduce((sum, item) => sum + item.quantity * item.totalPrice, 0);
    }, 0);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 md:w-1/2 md:max-w-md md:mx-auto">
            {loading && status === "confirm" ? (
               
                <div className="text-center max-w-full px-4 md:px-0">
                    <Lottie
                        animationData={loadingAnimation}
                        loop={true}
                        style={{ width: "150px", height: "150px", margin: "0 auto" }}
                    />
                    <h1 className="font-bold text-4xl mt-4">
                        กำลังทำอาหาร
                        <span className="loading-dots"></span>
                    </h1>
                    <h1 className="text-xl mt-2">
                        ยอดรวม: ฿{totalPrice.toFixed(2)}
                    </h1>
                    <h2 className="text-xl mt-2">
                        OrderId: {userId}
                    </h2>
                </div>
            ) : status === "completed" ? (
              
                <div className="text-center max-w-full px-4 md:px-0">
                    <Lottie
                        animationData={completedAnimation}
                        loop={true}  
                        style={{ width: "150px", height: "150px", margin: "0 auto" }}
                    />
                    <h1 className="font-bold text-4xl mt-4 text-green-500">
                        ทำอาหารเสร็จแล้ว!
                    </h1>
                    <h2 className="text-xl mt-2">
                        ขอบคุณที่ใช้บริการ, รับอาหารที่เคาเตอร์ได้เลย
                    </h2>
                </div>
            ) : (
                
                <div className="text-center max-w-full px-4 md:px-0">
                    <h1 className="font-bold text-4xl mt-4 text-gray-700">
                        ยอดรวม: ฿{totalPrice.toFixed(2)}
                    </h1>
                    <h2 className="text-xl mt-2">
                        OrderId: {userId}
                    </h2>
                </div>
            )}
        </div>
    );
};

export default UserLoading;
