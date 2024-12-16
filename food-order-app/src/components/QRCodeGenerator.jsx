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
    // Function to generate a random userId
    const generateRandomUserId = () => Math.floor(Math.random() * 1000000).toString();

    const userId = generateRandomUserId();
    const url = `https://foodqueue.web.app/dashboard/${userId}`;

    // Add user to Firestore
    const addUserToFirestore = async (userId) => {
      try {
        const userRef = doc(db, "users", userId); // Reference to Firestore document
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

    // Generate QR Code
    const canvas = document.getElementById("qrcodeCanvas");
    QRCode.toCanvas(
      canvas,
      url,
      { width: 200 },
      async (error) => {
        if (error) console.error(error);
        console.log("QR Code generated!");

        // Add user to Firestore after QR Code is generated
        await addUserToFirestore(userId);
      }
    );

    // Add event listener to open the URL when clicked
    if (canvas) {
      canvas.addEventListener("click", () => {
        window.open(url, "_self");
      });
    }
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div>
      <h1>QR Code Generator</h1>
      <canvas id="qrcodeCanvas"></canvas>
    </div>
  );
};

export default QRCodeGenerator;