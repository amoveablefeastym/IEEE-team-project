import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useClasses } from '../context/ClassesContext'
import { subscribeToMembers } from '../services/firestore'

export default function RightSidebar() {
  const { user } = useAuth()
  const { activeClass } = useClasses()
  const [members, setMembers] = useState([])

  useEffect(() => {
    if (!activeClass?.id) { setMembers([]); return }
    return subscribeToMembers(activeClass.id, setMembers)
  }, [activeClass?.id])

  return (
    <aside className="w-56 min-h-screen bg-surface border-l border-line flex flex-col gap-4 p-4">
      {/* Class Members */}
      <div>
        <h3 className="text-xxs text-muted font-semibold uppercase tracking-widest mb-2">
          Class Members {members.length > 0 && <span className="font-normal normal-case">({members.length})</span>}
        </h3>
        <ul className="space-y-2">
          {members.length === 0 ? (
            <li className="text-xxs text-muted">No members yet.</li>
          ) : members.map((m) => {
            const initials = (m.displayName || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            const isMe = m.uid === user?.uid
            return (
              <li key={m.id} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-avatar bg-brand-light text-brand text-xxs font-bold flex items-center justify-center flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-label text-primary font-medium truncate">
                    {m.displayName}{isMe && <span className="text-muted"> (you)</span>}
                  </p>
                </div>
              </li>
            )
          })}
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

      {/* Become a Mentor banner removed */}
    </aside>
  );
}
