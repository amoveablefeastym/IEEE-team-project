import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

// Existing page imports — keep whatever the team already has
// import App from './App'  ← replace this file, don't self-import
// Add other routes below as the team builds them out

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<SignUp />} />
        <Route path="/signup"  element={<SignUp />} />
        <Route path="/signin"  element={<SignIn />} />
        {/* 
          Future routes — add as pages are built:
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/class/:id"  element={<ClassView />} />
          <Route path="/settings"   element={<Settings />} />
        */}
      </Routes>
    </BrowserRouter>
  )
}
