import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const ClassesContext = createContext()

const STORAGE_KEY_PREFIX = 'classhub.myClasses.'

function readFromStorage(uid) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + uid)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeToStorage(uid, classes) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + uid, JSON.stringify(classes))
  } catch {
    /* quota or disabled storage — silently degrade to in-memory */
  }
}

export function ClassesProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid || 'guest'
  const [classes, setClasses] = useState(() => readFromStorage(uid))

  useEffect(() => {
    setClasses(readFromStorage(uid))
  }, [uid])

  useEffect(() => {
    writeToStorage(uid, classes)
  }, [uid, classes])

  function addClass(course) {
    setClasses((prev) => {
      if (prev.some((c) => c.id === course.id)) return prev
      return [...prev, course]
    })
  }

  function removeClass(id) {
    setClasses((prev) => prev.filter((c) => c.id !== id))
  }

  function hasClass(id) {
    return classes.some((c) => c.id === id)
  }

  return (
    <ClassesContext.Provider value={{ classes, addClass, removeClass, hasClass }}>
      {children}
    </ClassesContext.Provider>
  )
}

export function useClasses() {
  const ctx = useContext(ClassesContext)
  if (!ctx) throw new Error('useClasses must be used inside <ClassesProvider>')
  return ctx
}
