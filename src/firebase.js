import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, getFirestore, connectFirestoreEmulator, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { connectAuthEmulator } from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics";

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

// Initialize Firebase (guard to avoid re-initializing during HMR)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const analytics = null; // getAnalytics(app);

// Initialize Services
export const auth = getAuth(app);
// Use experimentalForceLongPolling in local dev to avoid the WebChannel
// watch-stream state machine crash that React 19 StrictMode triggers via
// double-invocation of effects (mount→cleanup→remount on the same db instance).
const isLocalDev = typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
export const db = (() => {
  try {
    if (isLocalDev) {
      return initializeFirestore(app, { experimentalForceLongPolling: true });
    }
    return initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });
  } catch (_) {
    // Already initialized (HMR re-run) — retrieve existing instance
    return getFirestore(app);
  }
})();
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Connect to emulators when running locally
// Detect common local dev hostnames (localhost, 127.0.0.1, 0.0.0.0)
if (typeof window !== 'undefined') {
  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
  if (isLocalHost) {
    // Avoid connecting multiple times during HMR by using a global guard
    try {
      if (!window.__FIREBASE_EMULATORS_CONNECTED) {
        // Use 'localhost' for emulator connections to avoid hostname mismatch issues
        connectFirestoreEmulator(db, 'localhost', 8088);
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectStorageEmulator(storage, 'localhost', 9199);
        window.__FIREBASE_EMULATORS_CONNECTED = true;
        console.info(`Firebase emulators connected (host=${host})`);
      }
    } catch (err) {
      // Log full error for easier debugging in the browser console
      console.warn('Could not connect to Firebase emulators:', err);
    }
  }
}
