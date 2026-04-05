import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/chat',        label: 'Chat' },
  { to: '/qa',          label: 'Q&A' },
  { to: '/study',       label: 'Study Sessions' },
  { to: '/mentorship',  label: 'Mentorship' },
]

function Toggle({ checked, onChange }) {
  return (
    <div
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-10 h-6 rounded-full cursor-pointer transition-colors duration-200 flex-shrink-0 ${checked ? 'bg-purple-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  )
}

// Sits at the top of the main content area
export default function Header({ showUpperclassmen, onToggleUpperclassmen }) {

  return (
    <header className="bg-white border-b border-gray-200 flex-shrink-0">
      {/* Row 1 — class info + search + bell */}
      <div className="px-6 py-4 flex items-center justify-between gap-6 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">CS 214 – Data Structures</h2>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Spring 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="search"
              placeholder="Search in class..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 w-64 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2 — nav tabs + show upperclassmen toggle */}
      <div className="px-6 flex items-center justify-between">
        <nav>
          <ul className="flex list-none m-0 p-0">
            {TABS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      isActive
                        ? 'text-purple-600 border-purple-600'
                        : 'text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2.5">
          <span className="text-sm text-gray-500 font-medium">Show Upperclassmen Only</span>
          <Toggle checked={showUpperclassmen} onChange={onToggleUpperclassmen} />
        </div>
      </div>
    </header>
  )
}
