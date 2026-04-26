import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Header from './components/header';
import Sidebar from './components/sidebar';
import RightSidebar from './components/rightsidebar';
import QAndA from './QAPage';
import ChatPage from './chat';
import CourseDiscovery from './CourseDiscovery';
import StudySessions from './StudySessionsPage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Dashboard() {
  const [showUpperclassmen, setShowUpperclassmen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  return (
    <>
      <div className="flex bg-gray-50 h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Header showUpperclassmen={showUpperclassmen} onToggleUpperclassmen={setShowUpperclassmen} />
          <main className="flex-1 overflow-hidden flex flex-col">
            <Routes location={background || location}>
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route path="/qa" element={<div className="flex-1 overflow-y-auto w-full"><QAndA /></div>} />
              <Route path="/chat" element={<ChatPage showUpperclassmen={showUpperclassmen} />} />
              <Route path="/study" element={<StudySessions />} />
              <Route path="/mentorship" element={<Placeholder label="Mentorship" />} />
            </Routes>
          </main>
        </div>
        <RightSidebar />
      </div>

      {background && (
        <Routes>
          <Route path="/discover" element={<CourseDiscovery onClose={() => navigate(-1)} />} />
        </Routes>
      )}
    </>
  );
}

function Placeholder({ label }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-sm text-gray-400">{label} — coming soon</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
