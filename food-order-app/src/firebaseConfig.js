// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIHTDNjyqNJRDx7r3bIqJGqTlcrc6fO3E",
    authDomain: "ttgo-612a8.firebaseapp.com",
    databaseURL: "https://ttgo-612a8-default-rtdb.firebaseio.com",
    projectId: "ttgo-612a8",
    storageBucket: "ttgo-612a8.firebasestorage.app",
    messagingSenderId: "201406860974",
    appId: "1:201406860974:web:0d1524ab12ddcb04aca73f",
    measurementId: "G-L9LV2L77QN"
  };


// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

export { firebaseApp, db };