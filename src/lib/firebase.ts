// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } ;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6d-fSXBjRXPplgeXt1zXLogG8IhPOjyo",
  authDomain: "rc-kiosk-app.firebaseapp.com",
  projectId: "rc-kiosk-app",
  storageBucket: "rc-kiosk-app.firebasestorage.app",
  messagingSenderId: "780707551149",
  appId: "1:780707551149:web:c708655b0996651780f324",
  measurementId: "G-7WTEF6TLQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);