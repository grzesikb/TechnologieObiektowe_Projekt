// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDCFQGZlU32i0I4ex7jTHvsmpaPvlccifM",
    authDomain: "evento-f8ada.firebaseapp.com",
    projectId: "evento-f8ada",
    storageBucket: "evento-f8ada.appspot.com",
    messagingSenderId: "222148464368",
    appId: "1:222148464368:web:334c664f8519da8e4cfc35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
