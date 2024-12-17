import React, { useEffect } from "react";
import QRCode from "qrcode";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIHTDNjyqNJRDx7r3bIqJGqTlcrc6fO3E",
  authDomain: "ttgo-612a8.firebaseapp.com",
  databaseURL: "https://ttgo-612a8-default-rtdb.firebaseio.com",
  projectId: "ttgo-612a8",
  storageBucket: "ttgo-612a8.firebasestorage.app",
  messagingSenderId: "201406860974",
  appId: "1:201406860974:web:0d1524ab12ddcb04aca73f",
  measurementId: "G-L9LV2L77QN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const QRCodeGenerator = () => {
  useEffect(() => {
    const generateRandomUserId = () => Math.floor(Math.random() * 1000000).toString();

    const userId = generateRandomUserId();
    const url = `https://foodqueue.web.app/dashboard/${userId}`;

    const addUserToFirestore = async (userId) => {
      try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
          userId: userId,
          createdAt: serverTimestamp(),
          sessionActive: true,
        });
        console.log(`User ${userId} added to Firestore!`);
      } catch (error) {
        console.error("Error adding user to Firestore:", error);
      }
    };

    const canvas = document.getElementById("qrcodeCanvas");
    QRCode.toCanvas(
      canvas,
      url,
      { width: 200 },
      async (error) => {
        if (error) console.error(error);
        console.log("QR Code generated!");

        await addUserToFirestore(userId);
      }
    );

    if (canvas) {
      canvas.addEventListener("click", () => {
        window.open(url, "_self");
      });
    }
  }, []);

  // ฟังก์ชันสำหรับดาวน์โหลด QR Code เป็นรูปภาพ
  const downloadQRCode = () => {
    const canvas = document.getElementById("qrcodeCanvas");
    if (canvas) {
      const imageURL = canvas.toDataURL("image/png"); // แปลง Canvas เป็น Data URL
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = "qrcode.png"; // ชื่อไฟล์ที่ต้องการดาวน์โหลด
      link.click();
    }
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <canvas id="qrcodeCanvas"></canvas>
      <button onClick={downloadQRCode} style={{ marginTop: "10px" }}>
        Download QR Code
      </button>
    </div>
  );
};

export default QRCodeGenerator;
