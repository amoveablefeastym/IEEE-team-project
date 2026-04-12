import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [name, setName] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    login(trimmed)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Welcome to ClassHub</h2>
        <p className="text-sm text-gray-500 mb-4">Enter a display name to continue (no password for demo).</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full border border-gray-200 rounded px-3 py-2 mb-3 focus:outline-none"
        />
        <div className="flex justify-end gap-2">
          <button type="submit" className="bg-brand text-white px-4 py-2 rounded">Sign in</button>
        </div>
      </form>
    </div>
  )
}
