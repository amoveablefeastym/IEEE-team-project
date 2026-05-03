import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useClasses } from '../context/ClassesContext'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { classes, removeClass } = useClasses()
  
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
          <li
            onClick={() => navigate('/dashboard')}
            className={`px-2 py-1.5 rounded-btn text-label cursor-pointer transition-colors ${
              location.pathname === '/dashboard' ? 'bg-brand/10 text-brand' : 'text-sub hover:bg-page hover:text-primary'
            }`}
          >
            Dashboard
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
          {classes.length === 0 ? (
            <li className="px-2 py-1.5 text-xxs text-muted leading-relaxed">
              No classes yet.{' '}
              <button
                onClick={() => navigate('/discover', { state: { background: location } })}
                className="text-brand hover:text-brand-hover font-medium"
              >
                Add one
              </button>
            </li>
          ) : (
            classes.map((c) => {
              const inClassRoute = ['/chat', '/qa', '/study', '/mentorship'].includes(location.pathname)
              return (
                <li
                  key={c.id}
                  onClick={() => navigate('/chat')}
                  className={`group flex items-center justify-between px-2 py-1.5 rounded-btn text-label cursor-pointer transition-colors ${
                    inClassRoute ? 'text-sub hover:bg-page hover:text-primary' : 'text-sub hover:bg-page hover:text-primary'
                  }`}
                  title={c.title}
                >
                  <span className="truncate">{c.code || c.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeClass(c.id)
                    }}
                    className="text-muted hover:text-brand text-xxs opacity-0 group-hover:opacity-100 transition-opacity ml-1 leading-none"
                    title="Remove from My Classes"
                  >
                    ×
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </nav>

      {/* Alumni / Mentor Classes */}
      <nav className="px-3 pt-5">
        <div className="flex items-center justify-between px-2 mb-1">
          <p className="text-xxs text-muted font-semibold uppercase tracking-widest">Past Classes</p>
        </div>
        <ul className="space-y-0.5">
          <li
            onClick={() => navigate('/mentor/qa')}
            className={`px-2 py-1.5 rounded-btn text-label cursor-pointer transition-colors ${
              location.pathname === '/mentor/qa' ? 'bg-brand/10 text-brand' : 'text-sub hover:bg-page hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-brand">🎓</span>
              <span>CS 111</span>
            </div>
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
