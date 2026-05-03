## Firebase setup (Web) — project configuration

Copy this snippet into your project to initialize Firebase and Cloud Firestore (modular SDK v9+ / v12 style).

Replace any values only if they differ in your Firebase Console. For this repository the project configuration is already filled below.

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Project configuration (from Firebase Console)
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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, db };
```

Notes:
- Use the exact values from your Firebase Console (Project settings → General → Your apps → Config).
- The recommended `storageBucket` format is `PROJECT_ID.appspot.com`. Use whatever the Console shows; earlier mismatches caused 404/CORS errors.
- For local development with Vite, consider moving these values into environment variables (`import.meta.env.VITE_...`) and referencing them instead of hardcoding.

If you want, I can add a `.env.example` and update `src/firebase.js` to read from `import.meta.env` so the config isn't hardcoded in source control.

## Adding data to Firestore (examples)

Cloud Firestore stores data in documents inside collections. Collections and documents are created implicitly the first time you add data.

Below are two example snippets (modular SDK) showing how to add documents to a `users` collection.

```javascript
import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/firebase"; // adjust the path depending on where you run this

async function addUsersExample() {
  try {
    const docRef1 = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef1.id);

    const docRef2 = await addDoc(collection(db, "users"), {
      first: "Alan",
      middle: "Mathison",
      last: "Turing",
      born: 1912,
    });
    console.log("Document written with ID: ", docRef2.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// call it from an async context
addUsersExample();
```

Notes:
- Documents in the same collection can have different fields — Firestore is schemaless.
- In production, secure your writes with Firestore security rules (avoid test mode long-term).
- When testing locally, you can use the Firestore emulator (`firebase emulators:start --only firestore`) to avoid writing to production.

