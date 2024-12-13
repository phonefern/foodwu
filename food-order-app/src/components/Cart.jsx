import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";

const Cart = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { userId } = useParams(); // Get userId from the route parameters
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      if (!userId) return;

      try {
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("userId", "==", userId),
          where("status", "==", "pending")
        );
        const querySnapshot = await getDocs(q);

        let itemsCount = 0;
        let priceTotal = 0;

        querySnapshot.forEach((doc) => {
          const { items } = doc.data();

          if (items && Array.isArray(items)) {
            items.forEach((item) => {
              itemsCount += item.quantity;
              priceTotal += item.quantity * item.totalPrice; // Use `totalPrice` from items
            });
          }
        });

        setTotalItems(itemsCount);
        setTotalPrice(priceTotal);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [userId]);

  // Show nothing if no userId or cart is empty
  if (!userId || totalItems === 0) return null;

  return (
    <div
      onClick={() => navigate(`/order-list/${userId}`)} // Navigate to `/order-list/:userId`
      className="fixed bottom-4 left-4 right-4 bg-[#34A853] text-white px-4 py-1 rounded-md shadow-lg flex items-center justify-between cursor-pointer"
      style={{ zIndex: 100 }}
    >
      <div className="flex items-center">
        <span className="bg-white text-green-500 font-bold px-2 rounded-full mr-3">
          {totalItems}
        </span>
        <span className="font-bold text-lg">ตะกร้าของฉัน</span>
      </div>
      <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
    </div>
  );
};

export default Cart;
