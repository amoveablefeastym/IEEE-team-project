import Sidebar from './components/sidebar'
import Header from './components/header'
import RightSidebar from './components/rightsidebar'
import QAndA from './QAPage'

function App() {
  return (
    <div className="flex h-screen bg-page overflow-hidden">
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <QAndA />
      </div>

      <RightSidebar />
    </div>
  )
}

export default App
