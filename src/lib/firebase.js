import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "react-chat-app-7dc90.firebaseapp.com",
    projectId: "react-chat-app-7dc90",
    storageBucket: "react-chat-app-7dc90.appspot.com",
    messagingSenderId: "539575811516",
    appId: "1:539575811516:web:36b9cb71f1c27f92493fb9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
