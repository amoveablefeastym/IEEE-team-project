import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const classes = [
    { code: 'CS 214', name: 'Data Structures & Algorithms', color: 'bg-blue-100 text-blue-700' },
    { code: 'CS 349', name: 'Machine Learning', color: 'bg-purple-100 text-purple-700' },
    { code: 'MATH 330', name: 'Abstract Algebra', color: 'bg-green-100 text-green-700' },
  ];

  const upcomingSessions = [
    { id: 1, title: 'Midterm Prep – Trees & Graphs', time: 'Today, 6:00 PM', attendees: 4 },
    { id: 2, title: 'Dynamic Programming', time: 'Saturday, 2:00 PM', attendees: 2 },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-page">
      {/* Welcome Banner */}
      <div className="bg-brand rounded-2xl p-8 mb-8 text-white shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">
            Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-brand-light font-medium text-lg">
            You have 2 study sessions coming up this week.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (takes up 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* My Classes Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-primary">My Classes</h2>
              <button 
                onClick={() => navigate('/discover')}
                className="text-brand text-sm font-semibold hover:text-brand-hover"
              >
                + Add Class
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classes.map((cls) => (
                <div 
                  key={cls.code} 
                  onClick={() => navigate('/chat')}
                  className="bg-surface border border-line rounded-xl p-5 hover:border-brand hover:shadow-sm transition-all cursor-pointer group"
                >
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${cls.color}`}>
                    {cls.code}
                  </span>
                  <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-brand transition-colors">
                    {cls.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted mt-4">
                    <span className="flex items-center gap-1">124 Peers</span>
                    <span className="flex items-center gap-1">3 Active Q&A</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column (takes up 1/3) */}
        <div className="space-y-8">
          
          {/* Upcoming Sessions */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-4">Upcoming Sessions</h2>
            <div className="bg-surface border border-line rounded-xl p-4 space-y-4">
              {upcomingSessions.map(session => (
                <div key={session.id} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center text-xl flex-shrink-0">
                    <span className="text-brand font-bold text-xs">SYS</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary leading-tight mb-1">{session.title}</h4>
                    <p className="text-xs text-brand font-medium mb-1">{session.time}</p>
                    <p className="text-xs text-sub">{session.attendees} attending</p>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <button 
                  onClick={() => navigate('/study')}
                  className="w-full py-2 bg-page border border-line rounded-lg text-sm font-semibold text-sub hover:text-brand hover:border-brand transition-colors"
                >
                  View All Sessions
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}