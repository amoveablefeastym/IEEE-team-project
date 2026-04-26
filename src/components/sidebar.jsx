import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <aside className="w-60 min-h-screen bg-surface border-r border-line flex flex-col">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-line">
        <h1 className="text-brand font-bold text-lg tracking-tight">ClassHub</h1>
      </div>

      {/* Main nav */}
      <nav className="px-3 pt-4">
        <p className="text-xxs text-muted font-semibold uppercase tracking-widest px-2 mb-1">Main</p>
        <ul className="space-y-0.5">
          <li className="px-2 py-1.5 rounded-btn text-label text-sub hover:bg-page hover:text-primary cursor-pointer transition-colors">
            Dashboard
          </li>
          <li className="px-2 py-1.5 rounded-btn text-label text-sub hover:bg-page hover:text-primary cursor-pointer transition-colors">
            Academics
          </li>
        </ul>
      </nav>

      {/* My Classes */}
      <nav className="px-3 pt-5">
        <div className="flex items-center justify-between px-2 mb-1">
          <p className="text-xxs text-muted font-semibold uppercase tracking-widest">My Classes</p>
          <button
            onClick={() => navigate('/discover', { state: { background: location } })}
            className="text-muted hover:text-brand text-base leading-none transition-colors"
            title="Discover courses"
          >
            +
          </button>
        </div>
        <ul className="space-y-0.5">
          <li className="px-2 py-1.5 rounded-btn text-label text-primary bg-brand-light font-medium cursor-pointer">
            Class One
          </li>
          <li className="px-2 py-1.5 rounded-btn text-label text-sub hover:bg-page hover:text-primary cursor-pointer transition-colors">
            Class Two
          </li>
          <li className="px-2 py-1.5 rounded-btn text-label text-sub hover:bg-page hover:text-primary cursor-pointer transition-colors">
            Class Three
          </li>
        </ul>
      </nav>

      {/* Community */}
      <nav className="px-3 pt-5">
        <p className="text-xxs text-muted font-semibold uppercase tracking-widest px-2 mb-1">Community</p>
        <ul className="space-y-0.5">
          <li className="px-2 py-1.5 rounded-btn text-label text-sub hover:bg-page hover:text-primary cursor-pointer transition-colors">
            Student Groups
          </li>
          <li className="px-2 py-1.5 rounded-btn text-label text-sub hover:bg-page hover:text-primary cursor-pointer transition-colors">
            Settings
          </li>
        </ul>
      </nav>

      {/* User profile */}
      <div className="mt-auto px-4 py-4 border-t border-line flex items-center gap-3">
        <div className="w-8 h-8 rounded-avatar bg-avatar-user text-white text-xxs font-bold flex items-center justify-center flex-shrink-0">
          UN
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-label text-primary font-medium truncate">{user?.displayName || 'Name'}</p>
          <p className="text-xxs text-muted truncate">Student</p>
        </div>
        <button onClick={handleLogout} className="text-muted hover:text-brand text-sm transition-colors" title="Log out">
          ↩
        </button>
      </div>
    </aside>
  );
}
