import { useState, useRef, useEffect } from 'react'

function Avatar({ initials, color }) {
  const colors = {
    purple: 'bg-brand text-white',
    teal:   'bg-teal-500 text-white',
    green:  'bg-green-500 text-white',
    orange: 'bg-orange-400 text-white',
    pink:   'bg-pink-500 text-white',
    blue:   'bg-blue-500 text-white',
  }
  return (
    <div className={`w-8 h-8 rounded-avatar text-xxs font-bold flex items-center justify-center flex-shrink-0 ${colors[color] || colors.purple}`}>
      {initials}
    </div>
  )
}

function ChatMessage({ message, isOwn }) {
  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isOwn && <Avatar initials={message.authorInitials} color={message.authorColor} />}
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
        {!isOwn && (
          <span className="text-xxs text-muted px-1">{message.author}</span>
        )}
        <div className={`px-3 py-2 rounded-card text-label leading-relaxed ${
          isOwn
            ? 'bg-brand text-white rounded-tr-sm'
            : 'bg-surface border border-line text-primary rounded-tl-sm'
        }`}>
          {message.text}
        </div>
        <span className="text-xxs text-muted px-1">{message.time}</span>
      </div>
    </div>
  )
}

export default function SessionChat({ session, onBack }) {
  const mockMessages = [
    { id: 1, author: session.attendees[0]?.name || 'M. Smith',   authorInitials: session.attendees[0]?.initials || 'MS', authorColor: session.attendees[0]?.color || 'purple', text: `Hey everyone! Just confirmed the room booking for ${session.location} 🎉`, time: '5:12 PM', isOwn: false },
    { id: 2, author: session.attendees[1]?.name || 'Alex I.',    authorInitials: session.attendees[1]?.initials || 'AI', authorColor: session.attendees[1]?.color || 'teal',   text: 'Awesome, I\'ll bring my notes from lecture 8 and 9. Should we start with BFS or DFS problems first?', time: '5:15 PM', isOwn: false },
    { id: 3, author: 'You', authorInitials: 'UN', authorColor: 'purple', text: 'Let\'s do BFS first since it showed up more on the practice midterm.', time: '5:18 PM', isOwn: true },
    { id: 4, author: session.attendees[2]?.name || 'J. Kim',     authorInitials: session.attendees[2]?.initials || 'JK', authorColor: session.attendees[2]?.color || 'orange', text: 'Agreed! Also can we go over the time complexity proofs? I keep mixing up O(V+E) vs O(V²)', time: '5:20 PM', isOwn: false },
    { id: 5, author: 'You', authorInitials: 'UN', authorColor: 'purple', text: 'Yeah for sure, that\'ll definitely be on the midterm lol', time: '5:21 PM', isOwn: true },
    { id: 6, author: session.attendees[3]?.name || 'P. Wong',    authorInitials: session.attendees[3]?.initials || 'PW', authorColor: session.attendees[3]?.color || 'green',  text: 'I found a great LeetCode list for tree traversal. Sending it here: [Tree Problems - LeetCode Set]', time: '5:30 PM', isOwn: false },
    { id: 7, author: session.attendees[0]?.name || 'M. Smith',   authorInitials: session.attendees[0]?.initials || 'MS', authorColor: session.attendees[0]?.color || 'purple', text: `See you all Thursday at 6! 📚`, time: '5:45 PM', isOwn: false },
  ]

  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      author: 'You',
      authorInitials: 'UN',
      authorColor: 'purple',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    }])
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat header */}
      <div className="bg-surface border-b border-line px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-muted hover:text-brand transition-colors text-lg leading-none"
          title="Back to sessions"
        >
          ←
        </button>
        <div className="w-9 h-9 rounded-card bg-brand flex items-center justify-center text-lg flex-shrink-0">
          {session.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-primary font-semibold text-label truncate">{session.title}</p>
          <p className="text-xxs text-muted">{session.attendees.length} members · {session.date}</p>
        </div>
        {/* Member avatars */}
        <div className="flex -space-x-2">
          {session.attendees.map((a) => (
            <Avatar key={a.initials} initials={a.initials} color={a.color} />
          ))}
          <Avatar initials="UN" color="purple" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-page">
        {/* Date divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-line" />
          <span className="text-xxs text-muted px-2">{session.date}</span>
          <div className="flex-1 h-px bg-line" />
        </div>

        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isOwn={msg.isOwn} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-surface border-t border-line px-4 py-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${session.title}...`}
          className="flex-1 bg-page border border-line rounded-btn px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-brand hover:bg-brand-hover disabled:opacity-40 text-white text-label font-medium px-4 py-2 rounded-btn transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}
