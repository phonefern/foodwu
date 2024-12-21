import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import Item from "../components/Item";
import '../index.css';
import Cart from "../components/Cart";

const DashBoard = () => {
  useEffect(() => {
    const isReloaded = sessionStorage.getItem("isReloaded");
    if (!isReloaded) {
      sessionStorage.setItem("isReloaded", "true");
      window.location.reload();
    }
  }, []);

  return (
    <div height="710px" overflow="auto">
      <div className="bg-gray-50 min-h-screen">
        <div className="w-full h-48 bg-cover bg-center" style={{ backgroundImage: 'url(/assets/img/wp.jpg)' }}>
        </div>
        <NavBar />
        <Item />
        <Cart />
      </div>
    </div>
  );
};

export default DashBoard;
