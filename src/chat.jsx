import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { subscribeToClassMessages, sendClassMessage, sendClassReply, subscribeToMessageReplies } from './services/firestore'
import { useClasses } from './context/ClassesContext'

// Chat placeholder removed — chat now reads from Firestore in production or shows an empty feed locally.

// ─── Helpers ──────────────────────────────────────────────────────────────────

let nextId = 9000

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/** Deep-clone threads and append a reply at the target id */
function appendReply(threads, targetId, newMsg) {
  return threads.map((t) => {
    if (t.id === targetId) return { ...t, replies: [...(t.replies || []), newMsg] }
    return { ...t, replies: appendReply(t.replies || [], targetId, newMsg) }
  })
}

/** Deep-clone and clear hiddenCount at target id */
function expandHidden(threads, targetId) {
  return threads.map((t) => {
    if (t.id === targetId) return { ...t, hiddenCount: 0 }
    return { ...t, replies: expandHidden(t.replies || [], targetId) }
  })
}

/** Remove a message by id at any depth */
function deleteMessage(threads, targetId) {
  return threads
    .filter((t) => t.id !== targetId)
    .map((t) => ({ ...t, replies: deleteMessage(t.replies || [], targetId) }))
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function AvatarBubble({ msg, size }) {
  if (msg.anonymous) {
    return (
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size, backgroundColor: '#E5E7EB' }}
      >
        <svg width={size * 0.48} height={size * 0.48} fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    )
  }
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: msg.avatarBg, color: msg.avatarColor, fontSize: Math.round(size * 0.32) }}
    >
      {msg.initials}
    </div>
  )
}

function BadgeChip({ type }) {
  if (type === 'Previously Took Course') {
    return (
      <span style={{ fontSize: 11, backgroundColor: '#FEF9C3', color: '#854D0E', border: '1px solid #FDE047', borderRadius: 4, padding: '2px 8px', fontWeight: 600, whiteSpace: 'nowrap' }}>
        Previously Took Course
      </span>
    )
  }
  if (type === 'Anonymous') {
    return (
      <span style={{ fontSize: 11, backgroundColor: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>
        Anonymous
      </span>
    )
  }
  return null
}

function ReplyInput({ onSubmit, onCancel }) {
  const [text, setText] = useState('')

  function submit() {
    if (!text.trim()) return
    onSubmit(text.trim())
    setText('')
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <input
        autoFocus
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onCancel(); }}
        placeholder="Write a reply..."
        className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
      />
      <button
        onClick={submit}
        className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
      >
        Reply
      </button>
      <button
        onClick={onCancel}
        className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Cancel
      </button>
    </div>
  )
}

// ─── Recursive message ────────────────────────────────────────────────────────

function ReplyMessage({ msg, depth, onAddReply, onDelete }) {
  const [replying, setReplying] = useState(false)
  const avatarSize = depth === 1 ? 32 : 28
  const isOwn = msg.isOwn === true

  return (
    <div className="mt-4 pl-4 border-l-2 border-gray-100">
      <div className="flex gap-3 group">
        <AvatarBubble msg={msg} size={avatarSize} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-gray-800">
                {msg.anonymous ? 'Anonymous' : (msg.author || msg.authorName || 'Unknown')}
              </span>
              {msg.badge && <BadgeChip type={msg.badge} />}
              <span className="text-xs text-gray-400">{msg.time}</span>
            </div>
            {isOwn && (
              <button onClick={() => onDelete(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all rounded" title="Delete">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{msg.text}</p>
          <button onClick={() => setReplying(v => !v)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition-colors mt-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
            Reply
          </button>
          {replying && (
            <ReplyInput onSubmit={(text) => { onAddReply(msg.id, text); setReplying(false) }} onCancel={() => setReplying(false)} />
          )}
        </div>
      </div>
    </div>
  )
}

/** Top-level message — owns a Firestore subscription for its replies */
function Message({ msg, classId, onAddReply, onDelete }) {
  const [replying, setReplying] = useState(false)
  const [firestoreReplies, setFirestoreReplies] = useState(msg.replies || [])
  const isOwn = msg.isOwn === true

  // Subscribe to this message's replies directly — no collectionGroup, no index needed
  useEffect(() => {
    if (!classId || !msg.id || String(msg.id).startsWith('local_')) return
    let unsub = null
    try {
      unsub = subscribeToMessageReplies(classId, msg.id, (items) => {
        setFirestoreReplies(items.map(r => ({
          id: r.id,
          text: r.text,
          anonymous: r.anonymous,
          author: r.authorName || (r.anonymous ? null : 'Unknown'),
          authorName: r.authorName,
          initials: r.initials || (r.authorName ? r.authorName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'UN'),
          avatarBg: r.avatarBg || '#E5E7EB',
          avatarColor: r.avatarColor || '#374151',
          badge: r.anonymous ? 'Anonymous' : null,
          time: r.createdAt?.toDate ? r.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          replies: [],
        })))
      })
    } catch (e) {
      console.warn('subscribeToMessageReplies failed:', e.message)
    }
    return () => { try { unsub?.() } catch (_) {} }
  }, [classId, msg.id])

  // Use Firestore replies if available, otherwise fall back to msg.replies (local/optimistic)
  const replies = firestoreReplies.length > 0 ? firestoreReplies : (msg.replies || [])

  return (
    <div>
      <div className="flex gap-3 group">
        <AvatarBubble msg={msg} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-gray-800">
                {msg.anonymous ? 'Anonymous' : msg.author}
              </span>
              {msg.badge && <BadgeChip type={msg.badge} />}
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {msg.time}
              </span>
            </div>
            {isOwn && (
              <button onClick={() => onDelete(msg.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all rounded" title="Delete message">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{msg.text}</p>

          <div className="flex items-center gap-4 mt-2">
            <button onClick={() => setReplying(v => !v)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              Reply
            </button>
            {replies.length > 0 && (
              <span className="text-xs text-gray-400">{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
            )}
          </div>

          {replying && (
            <ReplyInput
              onSubmit={(text) => { onAddReply(msg.id, text); setReplying(false) }}
              onCancel={() => setReplying(false)}
            />
          )}
        </div>
      </div>

      {/* Replies */}
      {replies.map((reply) => (
        <ReplyMessage key={reply.id} msg={reply} depth={1} onAddReply={onAddReply} onDelete={onDelete} />
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatPage({ showUpperclassmen = false }) {
  const { user } = useAuth()
  const { activeClass } = useClasses()
  const [threads, setThreads] = useState([])
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  const visibleThreads = showUpperclassmen
    ? threads.filter((t) => t.badge === 'Previously Took Course')
    : threads
  useEffect(() => {
    // Clear stale messages immediately when class changes so you never see another class's feed
    setThreads([])
    let unsub = null
    try {
      unsub = subscribeToClassMessages(activeClass?.id, (msgs) => {
        // map firestore shape to UI shape (no replies here — each Message subscribes to its own)
        const mapped = msgs.map((m) => ({
          id: m.id,
          text: m.text,
          anonymous: m.anonymous,
          isOwn: m.authorId === user?.uid,
          author: m.authorName || (m.initials ? m.initials : 'Unknown'),
          initials: m.initials || (m.authorName ? m.authorName.split(' ').map(n=>n[0]).join('').slice(0,2) : 'UN'),
          avatarBg: m.avatarBg || '#E5E7EB',
          avatarColor: m.avatarId === user?.uid ? '#FFFFFF' : '#374151',
          badge: m.badge || (m.previousTaker ? 'Previously Took Course' : null),
          time: m.createdAt && m.createdAt.toDate ? m.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          replies: [],
        }))
        setThreads(mapped)
      })
    } catch (e) {
      console.warn('Firestore subscribe failed', e)
    }

    return () => {
      try { if (unsub) unsub() } catch (_) {}
    }
  }, [activeClass?.id, user?.uid])

  // Helper to compute author display name and initials from auth user
  function getAuthorInfo(userObj, wantAnonymous) {
    if (wantAnonymous) return { authorName: null, initials: null, avatarBg: '#E5E7EB' }
    const name = userObj?.displayName || (userObj?.email ? userObj.email.split('@')[0] : 'User')
    const initials = userObj?.displayName ? userObj.displayName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : (userObj?.email ? userObj.email.split('@')[0].slice(0,2).toUpperCase() : 'US')
    return { authorName: name, initials, avatarBg: '#7C3AED' }
  }

  function handleDelete(id) {
    setThreads((prev) => deleteMessage(prev, id))
  }

  function handleSend() {
    if (!message.trim()) return
    if (!activeClass?.id) return
    const author = getAuthorInfo(user, anonymous)
    const text = message.trim()
    setMessage('')
    const payload = {
      text,
      anonymous: !!anonymous,
      authorName: author.authorName,
      authorId: user?.uid || null,
      initials: author.initials,
      avatarBg: author.avatarBg,
    }
    // Optimistic local message — Firestore snapshot will replace it with the real one
    const localId = `local_${nextId++}`
    const optimistic = {
      id: localId,
      isOwn: true,
      text,
      ...(anonymous
        ? { anonymous: true, avatarBg: '#E5E7EB', badge: 'Anonymous' }
        : { author: author.authorName || 'You', initials: author.initials || 'YY', avatarBg: author.avatarBg, avatarColor: '#FFFFFF' }),
      time: now(),
      replies: [],
    }
    setThreads((prev) => [...prev, optimistic])
    sendClassMessage(activeClass.id, payload)
      .then(() => {
        // Firestore snapshot will arrive and replace the optimistic entry via setThreads(mapped)
        // Remove the local_ entry to avoid duplicates before the snapshot fires
        setThreads((prev) => prev.filter((t) => t.id !== localId))
      })
      .catch((e) => {
        console.warn('sendClassMessage failed, keeping local fallback', e)
      })
  }

  function handleAddReply(parentId, text) {
    if (!activeClass?.id) return
    const author = getAuthorInfo(user, anonymous)
    const payload = {
      text,
      anonymous: !!anonymous,
      authorName: author.authorName,
      authorId: user?.uid || null,
      initials: author.initials,
      avatarBg: author.avatarBg,
    }
    sendClassReply(activeClass.id, parentId, payload).catch((e) => {
      console.warn('sendClassReply failed', e)
    })
  }

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden min-h-0">
      {/* Active class header */}
      {activeClass && (
        <div className="mb-3 flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeClass.color || 'bg-brand/10 text-brand'}`}>
            {activeClass.code}
          </span>
          <h2 className="text-base font-bold text-primary">{activeClass.title} — Class Chat</h2>
        </div>
      )}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto px-7 py-7">
          <div className="flex flex-col gap-7">
            {visibleThreads.map((thread) => (
              <Message
                key={thread.id}
                msg={thread}
                classId={activeClass?.id}
                onAddReply={handleAddReply}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        {/* Post Anonymously toggle */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">Post Anonymously</p>
            <p className="text-xs text-gray-400">Hide your identity</p>
          </div>
          <Toggle checked={anonymous} onChange={setAnonymous} />
        </div>

        {/* Input bar */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0"
              style={{ border: '1.5px solid #D1D5DB' }}
            >
              <span style={{ fontSize: 18, fontWeight: 300, lineHeight: 1 }}>+</span>
            </button>
            <button className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 13s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message to the class..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ backgroundColor: '#5B21B6' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4C1D95')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5B21B6')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" stroke="#fff" strokeWidth="2.2" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#fff" stroke="none" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">
            Press Enter to send. Keep it academic and supportive!
          </p>
        </div>

      </div>
    </div>
  )
}
