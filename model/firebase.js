import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "air-quality-squad.firebaseapp.com",
  projectId: "air-quality-squad",
  storageBucket: "air-quality-squad.firebasestorage.app",
  messagingSenderId: process.env.SENDERID,
  appId: process.env.FIREBASE_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const dbFirebase = getDatabase(app);

export { app, dbFirebase };