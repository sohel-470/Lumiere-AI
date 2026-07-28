// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "lumiere-ai-fe65e.firebaseapp.com",
  projectId: "lumiere-ai-fe65e",
  storageBucket: "lumiere-ai-fe65e.firebasestorage.app",
  messagingSenderId: "934131309440",
  appId: "1:934131309440:web:55da3f0391ee1918d43f65",
  measurementId: "G-2TD7YMEZRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const storage = getStorage(app);