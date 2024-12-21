import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from "react-router-dom";
import AddOnOptions from '../components/AddOnOptions';
import LoadingScreen from '../components/LoadingScreen';
import QuantitySelector from '../components/QuantitySelector';

const OrderItem = () => {
    const [quantity, setQuantity] = useState(1);
    const [item, setItem] = useState(null);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [description, setDescription] = useState('');
    const location = useLocation();
    const menuId = new URLSearchParams(location.search).get('menuId');
    const navigate = useNavigate();

    const addOnOptions = [
        { name: 'ไข่ต้ม', price: 7 },
        { name: 'ไข่ดาว', price: 10 },
        { name: 'ไข่ขยี้', price: 10 },
        { name: 'ไข่เจียว', price: 15 },
        { name: 'ปลาทูทอด', price: 15 },
        { name: 'น้ำพริกมันปู', price: 15 },
        { name: 'น้ำพริกกะปิ', price: 10 },
        { name: 'น้ำพริกมะขามหมูกุ้ง', price: 15 },
        { name: 'น้ำพริกกากหมู', price: 15 },
        { name: 'น้ำพริกคั่วปลาฉิ้งฉ้าง', price: 15 },
        { name: 'ไตปลาแห้ง', price: 15 },
        { name: 'พิเศษ', price: 10 },
    ];

    useEffect(() => {
        const fetchMenuItem = async () => {
            try {
                const docRef = doc(db, 'menus', menuId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const menuItem = { id: docSnap.id, ...docSnap.data() };

                    // Fetch corresponding image from the images collection
                    const imagesQuery = query(
                        collection(db, 'images'),
                        where('name', '==', menuItem.name)
                    );
                    const imageSnap = await getDocs(imagesQuery);

                    if (!imageSnap.empty) {
                        const imageData = imageSnap.docs[0].data();
                        menuItem.imageBase64 = imageData.imageBase64;
                    } else {
                        console.warn('No matching image found for menu item name:', menuItem.name);
                    }

                    setItem(menuItem);
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching menu item:', error);
            }
        };

        if (menuId) fetchMenuItem();
    }, [menuId]);

    const handleAddOnChange = (addOn) => {
        if (selectedAddOns.some((selected) => selected.name === addOn.name)) {
            setSelectedAddOns(selectedAddOns.filter((selected) => selected.name !== addOn.name));
        } else {
            setSelectedAddOns([...selectedAddOns, addOn]);
        }
    };

    const calculateTotalPrice = () => {
        const basePrice = item?.price || 0;
        const addOnPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
        return (basePrice + addOnPrice) * quantity;
    };

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

    const handleBack = async () => {
        await handleAddToCart();
        navigate(-1);
        
    };

    if (!item) return <LoadingScreen />;

    return (
        <div className="max-w-md mx-auto relative">
            <a
                onClick={() => {
                    navigate(-1);
                    
                }}
                className="absolute top-4 left-4 bg-[#00000080] text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
                aria-label="Close"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-5 h-5">
                    <path fill="#ffffff" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
            </a>
            <img
                src={item.imageBase64 || "../src/assets/img/egg.jpg"}
                alt="Food item"
                className="rounded-lg mb-4 w-full h-64 object-cover"
            />
            <h1 className="text-xl font-semibold mb-2 p-2">{item.name}</h1>
            <p className="text-gray-500 mb-2 px-2">Starting price</p>
            <p className="text-lg font-meddium mb-4 px-2">฿ {item.price}</p>

            <AddOnOptions
                addOnOptions={addOnOptions}
                selectedAddOns={selectedAddOns}
                handleAddOnChange={handleAddOnChange}
            />

            <div className="mb-6 px-2">
                <h2 className="text-lg font-medium mb-2 flex items-center">
                    รายละเอียดเพิ่มเติม
                    <select
                        className="ml-2 border rounded-lg p-1 text-sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    >
                        <option value="">ใส่กล่องหรือกินที่นี่</option>
                        <option value="ใส่กล่อง">ใส่กล่อง</option>
                        <option value="กินที่นี่">กินที่นี่</option>
                    </select>
                </h2>
                <textarea
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="Add your note"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>

            <div className="flex items-center justify-between px-2 pb-4">
                <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                <button
                    onClick={handleBack}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                    ใส่ตะกร้า ฿{calculateTotalPrice().toFixed(2)}
                </button>
            </div>
        </div>
    );
};

export default OrderItem;
