import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// React 19 StrictMode double-invokes effects in dev, which breaks Firebase
// Firestore's internal WebChannel watch-stream state machine (INTERNAL
// ASSERTION FAILED: Unexpected state ve:-1). Removing StrictMode prevents
// this; experimentalForceLongPolling in firebase.js mitigates it at the SDK
// level but the double-invoke still triggers the assertion before the guard
// takes effect.
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
