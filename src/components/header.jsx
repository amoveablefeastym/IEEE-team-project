import { NavLink, useLocation } from 'react-router-dom';

const DEFAULT_TABS = [
  { to: '/chat', label: 'Chat' },
  { to: '/qa',   label: 'Q&A' },
  { to: '/study',      label: 'Study Sessions' },
  { to: '/resources', label: 'Resources' },
];

const MENTOR_TABS = [
  { to: '/mentor/qa', label: 'Q&A (Upperclassmen)' },
];

function Toggle({ checked, onChange }) {
  return (
    <div
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-10 h-6 rounded-full cursor-pointer transition-colors duration-200 flex-shrink-0 ${checked ? 'bg-brand' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  );
}

export default function Header({ showUpperclassmen, onToggleUpperclassmen }) {
  const location = useLocation();
  const isMentorView = location.pathname.startsWith('/mentor');
  const TABS = isMentorView ? MENTOR_TABS : DEFAULT_TABS;

  return (
    <header className="bg-surface border-b border-line px-6 py-4 flex flex-col gap-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-primary">
            {isMentorView ? 'CS111 - Past Class Mentorship' : 'CS214 - Data Structures and Algorithms'}
          </h2>
          <p className="text-label text-muted font-medium">Spring Quarter</p>
        </div>
        {/* Search, Notification, and Upperclassmen toggle */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input className="px-4 py-2 bg-page rounded-full text-sm border-line focus:bg-surface focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none w-64" type="search" placeholder="Search in class..." />
            <svg className="absolute right-3 top-2.5 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <button className="p-2 text-muted hover:bg-page rounded-full relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2">
            {!isMentorView && (
              <>
                <span className="text-label text-muted font-medium whitespace-nowrap">Show Upperclassmen Only</span>
                <Toggle checked={showUpperclassmen} onChange={onToggleUpperclassmen} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="border-t border-line pt-2 mt-2 -mb-4">
        <ul className="flex gap-6 text-label font-medium text-muted list-none m-0 p-0">
          {TABS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `pb-3 border-b-2 block cursor-pointer transition-colors ${
                    isActive
                      ? 'border-brand text-brand'
                      : 'border-transparent hover:text-primary'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
