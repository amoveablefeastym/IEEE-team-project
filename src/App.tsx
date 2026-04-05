import { useState } from 'react'
import Sidebar from './components/sidebar'
import Header from './components/header'
import RightSidebar from './components/rightsidebar'
import QAndA from './QAPage'
import StudySessions from './StudySessionsPage'

function App() {
  const [activeTab, setActiveTab] = useState('Q&A')

  return (
    <div className="flex h-screen bg-page overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'Q&A'            && <QAndA />}
        {activeTab === 'Study Sessions' && <StudySessions />}
      </div>

      <RightSidebar />
    </div>
  )
}

export default App
