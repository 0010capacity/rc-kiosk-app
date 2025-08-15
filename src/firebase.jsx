// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFoak47jdE8nON74UgyILVZh2B11WXrC4",
  authDomain: "redcross-kiosk.firebaseapp.com",
  projectId: "redcross-kiosk",
  storageBucket: "redcross-kiosk.firebasestorage.app",
  messagingSenderId: "247408374376",
  appId: "1:247408374376:web:9279d59485e244e8fa81dd",
  measurementId: "G-WGYN9FVT9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);