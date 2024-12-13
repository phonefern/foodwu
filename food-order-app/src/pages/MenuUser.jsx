import React from "react";
import NavBar from "../components/NavBar";
import Item from "../components/Item";
import '../index.css'
import Cart from "../components/Cart";

const DashBoard = () => {
  return (
    <div height="710px" overflow="auto">
      <div className="bg-gray-50 min-h-screen">
      <div className="w-full h-48 bg-cover bg-center" style={{ backgroundImage: 'url(../src/assets/img/wp.jpg)' }}>
      </div>
        <NavBar />
        <Item />
        <Cart />
      </div>
    </div>
  );
};

export default DashBoard;