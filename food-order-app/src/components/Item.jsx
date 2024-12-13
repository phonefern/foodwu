import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import MenuItem from "./MenuItem";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Item = () => {
    const [sections, setSections] = useState([]);
    const [userId, setUserId] = useState("");

    
    const { userId: urlUserId } = useParams();

    useEffect(() => {
        
        if (urlUserId) {
            setUserId(urlUserId);
        }
    }, [urlUserId]);

    
    useEffect(() => {
        const fetchMenus = async () => {
            try {
               
                const querySnapshot = await getDocs(collection(db, "menus"));
                const menus = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                
                const groupedSections = [
                    {
                        id: "recommended",
                        title: "เมนูแนะนำ",
                        items: menus.filter((menu) => menu.category === "recommended"),
                    },
                    {
                        id: "main-dishes",
                        title: "เมนูอาหาร",
                        items: menus.filter((menu) => menu.category === "main-dishes"),
                    },
                    {
                        id: "snacks",
                        title: "เมนูทานเล่น",
                        items: menus.filter((menu) => menu.category === "snacks"),
                    },
                    {
                        id: "salads",
                        title: "เมนูยำ",
                        items: menus.filter((menu) => menu.category === "salads"),
                    },
                ];

                setSections(groupedSections);
            } catch (error) {
                console.error("Error fetching menu data:", error);
            }
        };

        fetchMenus();
    }, []);

    return (
        <div>
            <main className="max-w-4xl mx-auto mt-6 px-4">
                {sections.map((section) => (
                    <div id={section.id} key={section.id}>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 pt-2">
                            {section.title}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {section.items.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={`/order-item?menuId=${item.id}&userId=${userId}`}
                                    className="block"
                                >
                                    <MenuItem
                                        image={item.image_url || "https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} // Use a default image if `image_url` is undefined
                                        name={item.name}
                                        price={item.price}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Item;
