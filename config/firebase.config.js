// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAUrjBP7AW2LM6GBoelKml52gvjEmp3ik",
  authDomain: "tailor-order-tracker.firebaseapp.com",
  projectId: "tailor-order-tracker",
  storageBucket: "tailor-order-tracker.firebasestorage.app",
  messagingSenderId: "987978734613",
  appId: "1:987978734613:web:a28adc21bd71cd72c9021c",
  measurementId: "G-VN00RSGG4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// ✅ Initialize Auth with persistence

export { app, auth, db };
