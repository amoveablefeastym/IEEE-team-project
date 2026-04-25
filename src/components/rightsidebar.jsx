export default function RightSidebar() {
  return (
    <aside className="w-56 min-h-screen bg-surface border-l border-line flex flex-col gap-4 p-4">
      {/* Class Members */}
      <div>
        <h3 className="text-xxs text-muted font-semibold uppercase tracking-widest mb-2">Class Members</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-avatar bg-brand-light text-brand text-xxs font-bold flex items-center justify-center flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-label text-primary font-medium truncate">Member Name</p>
              <p className="text-xxs text-muted truncate">Year • Major</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Upperclassmen Mentors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xxs text-muted font-semibold uppercase tracking-widest">Upperclassmen Mentors</h3>
          <a href="#" className="text-xxs text-brand hover:underline">View All</a>
        </div>

        <div className="flex items-center gap-2 bg-page rounded-card p-2">
          <div className="w-7 h-7 rounded-avatar bg-star text-white text-xxs font-bold flex items-center justify-center flex-shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-label text-primary font-medium truncate">Mentor Name</p>
            <p className="text-xxs text-muted truncate">Year • Major</p>
          </div>
          <button className="text-xxs text-brand border border-brand rounded-btn px-2 py-1 hover:bg-brand-light transition-colors flex-shrink-0">
            Message
          </button>
        </div>
      </div>

      {/* Become a Mentor banner */}
      <div className="mt-auto bg-brand-light rounded-card p-3">
        <h4 className="text-label text-brand font-semibold mb-1">Become a Mentor!</h4>
        <p className="text-xxs text-sub mb-2">Share your knowledge and help your peers succeed in this class.</p>
        <button className="w-full bg-brand hover:bg-brand-hover text-white text-xxs font-medium py-1.5 rounded-btn transition-colors">
          Learn More
        </button>
      </div>
    </aside>
  );
}
