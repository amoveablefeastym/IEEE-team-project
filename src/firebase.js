import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAGhJLeDW_spmUfv4bSUcbzwNUDXJmR7U",
  authDomain: "ieee-studyspace.firebaseapp.com",
  projectId: "ieee-studyspace",
  storageBucket: "ieee-studyspace.appspot.com",
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

// Connect to local emulators when running on localhost during development
if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.info('Connected to Firebase emulators (Firestore, Auth)');
  } catch (e) {
    // don't crash the app if emulators aren't available
    console.warn('Could not connect to Firebase emulators', e);
  }
}
