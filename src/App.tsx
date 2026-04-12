import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/sidebar'
import Header from './components/header'
import RightSidebar from './components/rightsidebar'
import QAndA from './QAPage'
import StudySessions from './StudySessionsPage'
import CourseDiscovery from './CourseDiscovery'

function App() {
  const [activeTab, setActiveTab] = useState('Q&A')

  return (
    <Router>
      <div className="flex h-screen bg-page overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === 'Q&A'            && <QAndA />}
          {activeTab === 'Study Sessions' && <StudySessions />}
        </div>

        <RightSidebar />

        {/* Routes for overlay pages like course discovery */}
        <Routes>
          <Route path="/discover" element={<CourseDiscovery onClose={() => window.history.back()} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
