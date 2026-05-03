import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { subscribeToClassMessages, sendClassMessage, sendClassReply } from './services/firestore'

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_THREADS = [
  {
    id: 1,
    author: 'Alex Chen',
    initials: 'AC',
    avatarBg: '#C7D2FE',
    avatarColor: '#4338CA',
    badge: 'Previously Took Course',
    time: '10:15 AM',
    text: "Hey everyone! For the midterm review, I'd suggest focusing on AVL tree rotations and the Big-O analysis of Dijkstra's. Those were common stumbling blocks when I took this last year.",
    pinned: true,
    replies: [
      {
        id: 11,
        author: 'Jordan Smith',
        initials: 'JS',
        avatarBg: '#D1FAE5',
        avatarColor: '#065F46',
        time: '10:20 AM',
        replies: [
          {
            id: 111,
            author: 'Alex Chen',
            initials: 'AC',
            avatarBg: '#C7D2FE',
            avatarColor: '#4338CA',
            badge: 'Previously Took Course',
            time: '10:25 AM',
            text: "Visualgo.net is amazing! Also the textbook has a good interactive section. I can share my notes if you want.",
            pinned: true,
            replies: [
              {
                id: 1111,
                author: 'Jordan Smith',
                initials: 'JS',
                avatarBg: '#D1FAE5',
                avatarColor: '#065F46',
                time: '10:27 AM',
                text: "That would be super helpful! Thanks so much!",
                replies: [],
              },
            ],
            hiddenCount: 0,
          },
          {
            id: 112,
            anonymous: true,
            avatarBg: '#E5E7EB',
            badge: 'Anonymous',
            time: '10:30 AM',
            text: "I've been using the same resource and it really helps. Also recommend doing practice problems from LeetCode.",
            replies: [],
          },
        ],
        hiddenCount: 1,
        text: "Thanks Alex! Quick question: is there a specific resource you used to practice the rotations?",
      },
    ],
    hiddenCount: 0,
  },
  {
    id: 2,
    author: 'Sarah Johnson',
    initials: 'SJ',
    avatarBg: '#FEE2E2',
    avatarColor: '#991B1B',
    time: '10:35 AM',
    text: "Do you think graph algorithms will be heavily tested?",
    replies: [
      {
        id: 21,
        anonymous: true,
        avatarBg: '#E5E7EB',
        badge: 'Anonymous',
        time: '10:40 AM',
        text: "I'm also curious about this. The problem sets had a lot of graph problems.",
        replies: [],
      },
    ],
    hiddenCount: 1,
  },
  {
    id: 3,
    author: 'Maya Patel',
    initials: 'MP',
    avatarBg: '#FCE7F3',
    avatarColor: '#9D174D',
    time: '11:05 AM',
    text: "I'm also struggling with the red-black tree deletions. Anyone down for a study session tomorrow at the library?",
    replies: [
      {
        id: 31,
        author: 'Liam Williams',
        initials: 'LW',
        avatarBg: '#EDE9FE',
        avatarColor: '#5B21B6',
        badge: 'Previously Took Course',
        time: '11:15 AM',
        text: "I can join! Red-black trees are tricky. Maya, I'm happy to explain the double-black cases for 30 mins.",
        replies: [],
      },
    ],
    hiddenCount: 0,
  },
]

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

function Message({ msg, depth, onAddReply, onExpand, onDelete }) {
  const [replying, setReplying] = useState(false)
  const avatarSize = depth === 0 ? 40 : depth === 1 ? 32 : 28
  const visibleReplies = (msg.replies || []).slice(0, Math.max(0, (msg.replies || []).length - (msg.hiddenCount || 0)))
  const hiddenCount = msg.hiddenCount || 0
  const isOwn = msg.isOwn === true

  function handleReplySubmit(text) {
    onAddReply(msg.id, text)
    setReplying(false)
  }

  return (
    <div className={depth > 0 ? 'mt-4 pl-4 border-l-2 border-gray-100' : ''}>
      <div className="flex gap-3 group">
        <AvatarBubble msg={msg} size={avatarSize} />
        <div className="flex-1 min-w-0">
          {/* Name + badge + time + delete */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-gray-800">
                {msg.anonymous ? 'Anonymous' : msg.author}
              </span>
              {msg.badge && <BadgeChip type={msg.badge} />}
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {msg.time}
              </span>
            </div>
            {isOwn && (
              <button
                onClick={() => onDelete(msg.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all rounded"
                title="Delete message"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Text */}
          <p className="text-sm text-gray-700 leading-relaxed">{msg.text}</p>

          {/* Reply button */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => setReplying((v) => !v)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
            {(msg.replies || []).length > 0 && (
              <span className="text-xs text-gray-400">
                {(msg.replies || []).length} {(msg.replies || []).length === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>

          {/* Pinned bookmark removed */}

          {/* Inline reply input */}
          {replying && (
            <ReplyInput onSubmit={handleReplySubmit} onCancel={() => setReplying(false)} />
          )}
        </div>
      </div>

      {/* Visible nested replies */}
      {visibleReplies.map((reply) => (
        <Message key={reply.id} msg={reply} depth={depth + 1} onAddReply={onAddReply} onExpand={onExpand} onDelete={onDelete} />
      ))}

      {/* Show more */}
      {hiddenCount > 0 && (
        <div className={`mt-3 ${depth === 0 ? 'pl-14' : 'pl-4'}`}>
          <button
            onClick={() => onExpand(msg.id)}
            className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 transition-colors"
          >
            ↳ Show {hiddenCount} more {hiddenCount === 1 ? 'reply' : 'replies'}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatPage({ showUpperclassmen = false }) {
  const { user } = useAuth()
  const [threads, setThreads] = useState(SEED_THREADS)
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  const visibleThreads = showUpperclassmen
    ? threads.filter((t) => t.badge === 'Previously Took Course')
    : threads
  useEffect(() => {
    let unsub = null
    try {
      unsub = subscribeToClassMessages((msgs) => {
        // map firestore shape to UI shape
        const mapped = msgs.map((m) => ({
          id: m.id,
          text: m.text,
          anonymous: m.anonymous,
          author: m.authorName || (m.initials ? m.initials : 'Unknown'),
          initials: m.initials || (m.authorName ? m.authorName.split(' ').map(n=>n[0]).join('').slice(0,2) : 'UN'),
          avatarBg: m.avatarBg || '#E5E7EB',
          avatarColor: m.avatarColor || '#374151',
          badge: m.badge || (m.previousTaker ? 'Previously Took Course' : null),
          time: m.createdAt && m.createdAt.toDate ? m.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          replies: (m.replies || []).map((r) => ({
            id: r.id,
            text: r.text,
            anonymous: r.anonymous,
            author: r.authorName || 'Unknown',
            time: r.createdAt && r.createdAt.toDate ? r.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          })),
          hiddenCount: 0,
        }))
        setThreads(mapped)
      })
    } catch (e) {
      // Firestore not available or permission denied — keep seed threads
      console.warn('Firestore subscribe failed, using local seed threads', e)
    }

    return () => {
      if (unsub) unsub()
    }
  }, [])

  function handleDelete(id) {
    setThreads((prev) => deleteMessage(prev, id))
  }

  function handleSend() {
    if (!message.trim()) return
    // persist to Firestore if available
    const payload = {
      text: message.trim(),
      anonymous,
      authorName: user?.displayName || 'Anonymous',
      authorId: user?.uid || null,
      initials: user?.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').slice(0,2) : 'AN',
      avatarBg: '#7C3AED',
    }
    sendClassMessage(payload).catch((e) => {
      console.warn('sendClassMessage failed, falling back to local', e)
      const newMsg = {
        id: nextId++,
        isOwn: true,
        ...(anonymous
          ? { anonymous: true, avatarBg: '#E5E7EB', badge: 'Anonymous' }
          : { author: 'Jane Doe', initials: 'JD', avatarBg: '#7C3AED', avatarColor: '#FFFFFF' }),
        time: now(),
        text: message.trim(),
        replies: [],
        hiddenCount: 0,
      }
      setThreads((prev) => [...prev, newMsg])
    })
    setMessage('')
  }

  function handleAddReply(parentId, text) {
    const payload = {
      text,
      anonymous,
      authorName: user?.displayName || 'Anonymous',
      authorId: user?.uid || null,
      initials: user?.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').slice(0,2) : 'AN',
      avatarBg: '#7C3AED',
    }
    sendClassReply(parentId, payload).catch((e) => {
      console.warn('sendClassReply failed, falling back to local', e)
      const newReply = {
        id: nextId++,
        isOwn: true,
        ...(anonymous
          ? { anonymous: true, avatarBg: '#E5E7EB', badge: 'Anonymous' }
          : { author: 'Jane Doe', initials: 'JD', avatarBg: '#7C3AED', avatarColor: '#FFFFFF' }),
        time: now(),
        text,
        replies: [],
        hiddenCount: 0,
      }
      setThreads((prev) => appendReply(prev, parentId, newReply))
    })
  }

  function handleExpand(msgId) {
    setThreads((prev) => expandHidden(prev, msgId))
  }

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden min-h-0">
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto px-7 py-7">
          <div className="flex flex-col gap-7">
            {visibleThreads.map((thread) => (
              <Message
                key={thread.id}
                msg={thread}
                depth={0}
                onAddReply={handleAddReply}
                onExpand={handleExpand}
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
