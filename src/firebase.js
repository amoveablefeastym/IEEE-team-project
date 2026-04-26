import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAGhJLeDW_spmUfv4bSUcbzwNUDXJmR7U",
  authDomain: "ieee-studyspace.firebaseapp.com",
  projectId: "ieee-studyspace",
  storageBucket: "ieee-studyspace.firebasestorage.app",
  messagingSenderId: "1088507424557",
  appId: "1:1088507424557:web:6419db18295e52113dada4",
  measurementId: "G-23363RDMLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = null; // getAnalytics(app);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
