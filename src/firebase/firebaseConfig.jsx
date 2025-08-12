/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
const firebaseConfig = {
    apiKey: "AIzaSyDBhnqn_HY49VOnKLTKNuOUvUxuAwDEphM",
    authDomain: "sashastore000.firebaseapp.com",
    projectId: "sashastore000",
    storageBucket: "sashastore000.firebasestorage.app",
    messagingSenderId: "357704353862",
    appId: "1:357704353862:web:40252e2613b4455125a247",
    measurementId: "G-W08820FG2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, app };