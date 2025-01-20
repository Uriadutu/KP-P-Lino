// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw2jTNvK2E5PdpQN6ycq0mxSfSuqqwc14",
  authDomain: "tania-firebase-b8bfc.firebaseapp.com",
  projectId: "tania-firebase-b8bfc",
  storageBucket: "tania-firebase-b8bfc.firebasestorage.app",
  messagingSenderId: "283252605556",
  appId: "1:283252605556:web:4e6bc7a7daa8e371ca8721",
  measurementId: "G-DVFCPQ0345"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
