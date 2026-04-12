import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('classhub-user'))
    } catch (e) {
      return null
    }
  })

  function login(name) {
    const u = { name }
    setUser(u)
    try { localStorage.setItem('classhub-user', JSON.stringify(u)) } catch {}
  }

  function logout() {
    setUser(null)
    try { localStorage.removeItem('classhub-user') } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
