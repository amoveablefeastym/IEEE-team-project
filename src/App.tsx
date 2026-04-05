import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/sidebar'
import Header from './components/header'
import RightSidebar from './components/rightsidebar'
import QAndA from './QAPage'
import ChatPage from './chat'

function App() {
  const [showUpperclassmen, setShowUpperclassmen] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header showUpperclassmen={showUpperclassmen} onToggleUpperclassmen={setShowUpperclassmen} />
          {/* main has no padding — each page controls its own layout */}
          <main className="flex-1 overflow-hidden flex flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route path="/qa"   element={<div className="flex-1 overflow-y-auto p-6"><QAndA /></div>} />
              <Route path="/chat" element={<ChatPage showUpperclassmen={showUpperclassmen} />} />
              <Route path="/study"       element={<Placeholder label="Study Sessions" />} />
              <Route path="/mentorship"  element={<Placeholder label="Mentorship" />} />
            </Routes>
          </main>
        </div>
        <RightSidebar />
      </div>
    </BrowserRouter>
  )
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-sm text-gray-400">{label} — coming soon</p>
    </div>
  )
}

export default App
