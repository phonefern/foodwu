import React, { useState } from "react";


const NavBar = () => {
    const [activeLink, setActiveLink] = useState("recommended");

    const handleLinkClick = (sectionId) => {
        setActiveLink(sectionId);
    };
    return (
        <div>
            <header className="bg-white shadow-md">
                <div className="max-w-4xl mx-auto flex items-center justify-center py-4 px-4">
                    <div className="flex items-center flex-col">
                        <img
                            src="..\src\assets\img\diet.png"
                            alt="logo"
                            className="w-10 h-10 mr-2"
                        />
                        <h1 className="text-xl font-bold text-gray-700">ครัวยายเทศ</h1>
                    </div>
                </div>
            </header>
            <nav className="bg-white">
                <div className="max-w-4xl mx-auto flex justify-around border-b py-2">
                    <a
                        href="#recommended"
                        onClick={() => handleLinkClick("recommended")}
                        className={`text-gray-500 hover:text-blue-500 ${activeLink === "recommended" ? "text-blue-500 border-b-2 border-blue-500 pb-1" : ""
                            }`}
                    >
                        เมนูแนะนำ
                    </a>
                    <a
                        href="#main-dishes"
                        onClick={() => handleLinkClick("main-dishes")}
                        className={`text-gray-500 hover:text-blue-500 ${activeLink === "main-dishes" ? "text-blue-500 border-b-2 border-blue-500 pb-1" : ""
                            }`}
                    >
                        เมนูอาหาร
                    </a>
                    <a
                        href="#snacks"
                        onClick={() => handleLinkClick("snacks")}
                        className={`text-gray-500 hover:text-blue-500 ${activeLink === "snacks" ? "text-blue-500 border-b-2 border-blue-500 pb-1" : ""
                            }`}
                    >
                        เมนูทานเล่น
                    </a>
                    <a
                        href="#salads"
                        onClick={() => handleLinkClick("salads")}
                        className={`text-gray-500 hover:text-blue-500 ${activeLink === "salads" ? "text-blue-500 border-b-2 border-blue-500 pb-1" : ""
                            }`}
                    >
                        เมนูยำ
                    </a>
                </div>
            </nav>
        </div>





    );
};



export default NavBar;

