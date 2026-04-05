export default function Header() {
  return (
    <header className="bg-surface border-b border-line px-6 py-3 flex flex-col gap-3">
      {/* Top row: class info + search + bell */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-primary font-bold text-base leading-tight">CLASS NAME</h2>
          <p className="text-xxs text-muted">Quarter</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search in class..."
            className="bg-page border border-line rounded-btn px-3 py-1.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand w-56"
          />
          <button className="text-muted hover:text-brand text-lg transition-colors" title="Notifications">
            🔔
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <nav>
        <ul className="flex gap-1">
          {['Chat', 'Q&A', 'Study Sessions', 'Mentorship'].map((tab) => (
            <li key={tab}>
              <button
                className={`px-4 py-1.5 text-label rounded-btn transition-colors ${
                  tab === 'Q&A'
                    ? 'bg-brand text-white font-medium'
                    : 'text-sub hover:bg-page hover:text-primary'
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
