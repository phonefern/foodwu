import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
// import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const OrderItem = () => {
    const [quantity, setQuantity] = useState(1);
    const [item, setItem] = useState(null);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [description, setDescription] = useState('');
    const location = useLocation();
    const menuId = new URLSearchParams(location.search).get('menuId');

    const navigate = useNavigate();

    const handleBack = async () => {
        await handleAddToCart();
        navigate(-1);
    };

    // Add-on options
    const addOnOptions = [
        { name: 'ไข่ดาว', price: 10 },
        { name: 'ไข่เจียว', price: 15 },
        { name: 'ไตปลาแห้ง', price: 5 },
        { name: 'น้ำพริกกะปิ', price: 5 },
        { name: 'พิเศษ', price: 10 },
    ];

    // Fetch menu item from Firestore
    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const docRef = doc(db, 'menus', menuId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setItem({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching menu item:', error);
            }
        };

        if (menuId) fetchMenuItem();
    }, [menuId]);

    // Handle Add-on Selection
    const handleAddOnChange = (addOn) => {
        if (selectedAddOns.some((selected) => selected.name === addOn.name)) {
            setSelectedAddOns(selectedAddOns.filter((selected) => selected.name !== addOn.name));
        } else {
            setSelectedAddOns([...selectedAddOns, addOn]);
        }
    };

    // Calculate Total Price
    const calculateTotalPrice = () => {
        const basePrice = item?.price || 0;
        const addOnPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
        return (basePrice + addOnPrice) * quantity;
    };

    // Create Order in Firestore
    const handleAddToCart = async () => {
        if (!item) return;

        const order = {
            items: [
                {
                    menuId: item.id,
                    name: item.name,
                    price: item.price,
                    addOns: selectedAddOns,
                    quantity,
                    totalPrice: calculateTotalPrice(),
                    description,
                },
            ],
            timestamp: new Date().toISOString(),
            userId: new URLSearchParams(location.search).get('userId'),
            status: 'pending',
        };

        try {
            await addDoc(collection(db, 'orders'), order);
            alert('ส่งรายการเข้าตะกร้าเรียบร้อยแล้ว');
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    if (!item) {
        return (
            <div
                className="fixed inset-0 flex items-center justify-center bg-white z-50"
            >
                <img
                    src="..\src\Loading.gif"
                    alt="Loading..."
                    className="w-1/5"
                />
            </div>
        );
    }


    return (
        <div className="max-w-md mx-auto relative">
            {/* Close Icon */}
            <a
                href="/dashboard/:userId"
                className="absolute top-4 left-4 bg-[#00000080] text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    className="w-5 h-5">


                    <path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
            </a>
            <img
                src={item.image_url || "../src/assets/img/egg.jpg"}
                alt="Food item"
                className="rounded-lg mb-4 w-full h-64 object-cover"
            />
            <h1 className="text-xl font-semibold mb-2 p-2">{item.name}</h1>
            <p className="text-gray-500 mb-2 px-2">Starting price</p>
            <p className="text-lg font-semibold mb-4 px-2">${item.price}</p>

            <div className="mb-6">
                <h2 className="text-lg font-medium mb-2 px-2">เพิ่ม</h2>
                <p className="text-gray-500 text-sm mb-4 px-2">Choose your options</p>
                <div className="space-y-2">
                    {addOnOptions.map((option, index) => (
                        <div key={index} className="flex items-center px-2">
                            <input
                                type="checkbox"
                                id={`option-${index}`}
                                className="mr-2"
                                checked={selectedAddOns.some((selected) => selected.name === option.name)}
                                onChange={() => handleAddOnChange(option)}
                            />
                            <label htmlFor={`option-${index}`} className="flex-1">
                                {option.name}
                            </label>
                            <span className="text-sm text-gray-500">+ ${option.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6 px-2">
                <h2 className="text-lg font-medium mb-2 px-1">รายละเอียดเพิ่มเติม</h2>
                <textarea
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="Add your note"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="flex items-center">
                    <button
                        onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                        className="w-8 h-8 border rounded-l-lg flex items-center justify-center bg-gray-100"
                    >
                        -
                    </button>
                    <span className="w-12 h-8 border-t border-b flex items-center justify-center text-lg">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 border rounded-r-lg flex items-center justify-center bg-gray-100"
                    >
                        +
                    </button>
                </div>
                <button
                    onClick={handleBack}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                    ใส่ตะกร้า ${calculateTotalPrice().toFixed(2)}
                </button>
            </div>
        </div>
    );
};

export default OrderItem;
