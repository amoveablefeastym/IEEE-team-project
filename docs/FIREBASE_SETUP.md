Firebase setup (quickstart) — local + production

This document walks through setting up Cloud Firestore and Storage for local development and production.

1) Console: create project
- Open https://console.firebase.google.com/ and create/select your `ieee-studyspace` project.

2) Enable Firestore
- Build -> Firestore Database -> Create database
- Select a location (if prompted). For quick prototyping choose "Test mode" (opens to public read/write) and remember to lock it down before production.

3) Enable Storage
- Build -> Storage -> Get started
- Use the default bucket. Note the bucket name (typically `<project-id>.appspot.com`).

4) Install Firebase SDK (web)

  npm install firebase@12.12.1 --save

5) Local Emulator Suite (recommended)
- Install the Firebase CLI: https://firebase.google.com/docs/cli
- From your project root initialize emulators (auth/firestore):

  firebase init emulators

- Or run emulators directly if already initialized:

  firebase emulators:start

- The `firebase.json` file is included in the repo and configures ports for auth/firestore/functions and UI.

6) CORS for Storage (if you serve from local dev server)
- Create a small cors.json file:

  echo '[{"origin": ["*"],"method": ["GET","PUT","POST","DELETE","HEAD"],"maxAgeSeconds": 3600}]' > cors.json

- Then use gsutil (or Google Cloud Console) to set it (requires gcloud/gsutil):

  gsutil cors set cors.json gs://<your-bucket>.appspot.com

7) Security rules
- The repo contains `firestore.rules` with reasonable defaults for a prototype. Adapt rules before production.

8) Local dev wiring
- Your `src/firebase.js` should initialize Firebase and export `auth`, `db`, `storage`. The project already contains a `src/firebase.js` file — verify the `storageBucket` string looks like `<project-id>.appspot.com`.
- To use the emulator in development, add these lines to your firebase initialization code (when running locally):

import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';

if (location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

9) Adding data samples (JS)
- Use examples in the Firestore quickstart. For instance:

import { collection, addDoc } from 'firebase/firestore';
await addDoc(collection(db, 'resources'), { name: 'notes.pdf', uploader: 'you', createdAt: serverTimestamp() });

10) Next steps
- Wire your Q&A and Resources components to Firestore (Resources is already wired in the repo).
- Harden rules for production, enable App Check if required, and restrict Storage bucket CORS instead of wildcard origin.


If you want, I can:
- Add emulator wiring directly in `src/firebase.js` guarded by `location.hostname === 'localhost'`.
- Add a small script to seed sample data into Firestore using the Admin SDK or emulator.

Tell me which of those you want me to add now and I'll do it.