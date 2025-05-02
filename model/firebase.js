import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DBBASEURL,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_SENDERID,
  appId: process.env.FIREBASE_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const dbFirebase = getDatabase(app);

export { app, dbFirebase };