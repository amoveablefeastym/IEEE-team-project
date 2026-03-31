import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'
import RightSidebar from '../components/RightSidebar.jsx'

const MESSAGES = [
  {
    id: 1,
    author: 'Alex Chen',
    avatarBg: '#C7D2FE',
    avatarColor: '#4338CA',
    avatarInitials: 'AC',
    badge: 'Previously Took Course',
    time: '10:15 AM',
    text: "Hey everyone! For the midterm review, I'd suggest focusing on AVL tree rotations and the Big-O analysis of Dijkstra's. Those were common stumbling blocks when I took this last year.",
    pinned: true,
  },
  {
    id: 2,
    author: 'Jordan Smith',
    avatarBg: '#D1FAE5',
    avatarColor: '#065F46',
    avatarInitials: 'JS',
    badge: null,
    time: '10:20 AM',
    text: "Thanks Alex! Quick question: is there a specific resource you used to practice the rotations?",
    pinned: false,
  },
  {
    id: 3,
    author: 'Maya Patel',
    avatarBg: '#FCE7F3',
    avatarColor: '#9D174D',
    avatarInitials: 'MP',
    badge: null,
    time: '11:05 AM',
    text: "I'm also struggling with the red-black tree deletions. Anyone down for a study session tomorrow at the library?",
    pinned: false,
  },
  {
    id: 4,
    author: 'Liam Williams',
    avatarBg: '#EDE9FE',
    avatarColor: '#5B21B6',
    avatarInitials: 'LW',
    badge: 'Previously Took Course',
    time: '11:15 AM',
    text: "Visualgo.net is a lifesaver for tree animations! And yes, red-black trees are tricky. Maya, I'm happy to stop by your session for 30 mins to explain the double-black cases.",
    pinned: true,
  },
]

export default function ChatPage() {
  const [message, setMessage] = useState('')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      <Sidebar />

      <div style={{
        marginLeft: '160px',
        marginRight: '240px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Header />

        <main style={{ flex: 1, padding: '20px 24px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 140px)',
            overflow: 'hidden',
          }}>

            {/* Message feed */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '28px 28px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}>
              {MESSAGES.map((msg) => (
                <MessageRow key={msg.id} msg={msg} />
              ))}
            </div>

            {/* Input area */}
            <div style={{
              padding: '16px 20px 20px',
              borderTop: '1px solid #F3F4F6',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '12px 16px',
                backgroundColor: '#FAFAFA',
              }}>
                {/* Plus button */}
                <button style={{
                  width: '28px', height: '28px',
                  border: '1.5px solid #D1D5DB',
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  color: '#6B7280',
                  fontSize: '18px',
                  lineHeight: 1,
                  fontWeight: '300',
                }}>+</button>

                {/* SVG */}
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 0, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Type a message to the class..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    flex: 1, border: 'none', background: 'none', outline: 'none',
                    fontSize: '14px', color: '#111827',
                  }}
                />

                {/* Send button */}
                <button style={{
                  width: '36px', height: '36px',
                  backgroundColor: '#5B21B6',
                  border: 'none', borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#ffffff" stroke="none"/>
                  </svg>
                </button>
              </div>

              <p style={{
                margin: '8px 0 0',
                fontSize: '11px',
                color: '#9CA3AF',
                textAlign: 'center',
              }}>
                Press Enter to send. Keep it academic and supportive!
              </p>
            </div>

          </div>
        </main>
      </div>

      <RightSidebar />
    </div>
  )
}

function MessageRow({ msg }) {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

      {/* rounded rectangle  */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        backgroundColor: msg.avatarBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        color: msg.avatarColor,
        fontSize: '14px',
        fontWeight: '700',
      }}>
        {msg.avatarInitials}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Name + badge + time row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>
              {msg.author}
            </span>
            {msg.badge && (
              <span style={{
                fontSize: '11px',
                backgroundColor: '#FEF9C3',
                color: '#854D0E',
                border: '1px solid #FDE047',
                borderRadius: '4px',
                padding: '2px 8px',
                fontWeight: '500',
              }}>{msg.badge}</span>
            )}
          </div>

          {/* Clock SVG + time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{msg.time}</span>
          </div>
        </div>

        {/* Message text */}
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#374151',
          lineHeight: '1.6',
        }}>
          {msg.text}
        </p>

        {/* Yellow bookmark pin for highlighted messages */}
        {msg.pinned && (
          <div style={{ marginTop: '10px' }}>
            <div style={{
              width: '22px', height: '22px',
              backgroundColor: '#F59E0B',
              borderRadius: '5px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
