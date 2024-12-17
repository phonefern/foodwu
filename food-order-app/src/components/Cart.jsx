import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";

const Cart = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true); 
  const { userId } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    
    const fetchCartDataRealtime = () => {
      setLoading(true); 

      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userId", "==", userId),
        where("status", "==", "pending") 
      );

      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let itemsCount = 0;
        let priceTotal = 0;

        querySnapshot.forEach((doc) => {
          const { items } = doc.data();

          if (items && Array.isArray(items)) {
            items.forEach((item) => {
              itemsCount += item.quantity;
              priceTotal += item.quantity * item.totalPrice;
            });
          }
        });

        setTotalItems(itemsCount);
        setTotalPrice(priceTotal);
        setLoading(false); 
      }, (error) => {
        console.error("Error fetching cart data:", error);
        setLoading(false); 
      });

      return unsubscribe; 
    };

    const unsubscribe = fetchCartDataRealtime();

    return () => unsubscribe(); 
  }, [userId]);

  if (loading) return null; 

  if (!userId || totalItems === 0) return null; 

  return (
    <div
      onClick={() => navigate(`/order-list/${userId}`)} 
      className="fixed bottom-4 left-4 right-4 bg-[#34A853] text-white px-4 py-1 rounded-md shadow-lg flex items-center justify-between cursor-pointer hover:bg-green-600 transition sm:left-1/2 sm:transform sm:-translate-x-1/2"
      style={{ zIndex: 100 }}
    >
      <div className="flex items-center">
        <span className="bg-white text-green-500 font-bold px-2 py-1 rounded-full mr-3 text-sm">
          {totalItems}
        </span>
        <span className="font-bold text-md">ตะกร้าของฉัน</span>
      </div>
      <span className="font-bold text-md">${totalPrice.toFixed(2)}</span>
    </div>
  );
  
};

export default Cart;
