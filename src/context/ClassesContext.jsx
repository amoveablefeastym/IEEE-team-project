import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const ClassesContext = createContext()

const STORAGE_KEY_PREFIX = 'classhub.myClasses.'
const ACTIVE_CLASS_KEY_PREFIX = 'classhub.activeClass.'

// Default classes shown on the dashboard — pre-seeded for every user
const DEFAULT_CLASSES = [
  { id: 'cs214', code: 'CS 214', title: 'Data Structures & Algorithms', color: 'bg-blue-100 text-blue-700' },
  { id: 'cs349', code: 'CS 349', title: 'Machine Learning', color: 'bg-purple-100 text-purple-700' },
  { id: 'math330', code: 'MATH 330', title: 'Abstract Algebra', color: 'bg-green-100 text-green-700' },
]

function readFromStorage(uid) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + uid)
    if (!raw) return null        // null = never been set, use defaults
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return null
  }
}

function writeToStorage(uid, classes) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + uid, JSON.stringify(classes))
  } catch {
    /* quota or disabled storage — silently degrade to in-memory */
  }
}

function readActiveClass(uid) {
  try {
    const raw = localStorage.getItem(ACTIVE_CLASS_KEY_PREFIX + uid)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function writeActiveClass(uid, cls) {
  try {
    if (cls) localStorage.setItem(ACTIVE_CLASS_KEY_PREFIX + uid, JSON.stringify(cls))
    else localStorage.removeItem(ACTIVE_CLASS_KEY_PREFIX + uid)
  } catch {}
}

export function ClassesProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.uid || 'guest'
  const [classes, setClasses] = useState(() => readFromStorage(uid) ?? DEFAULT_CLASSES)
  const [activeClass, setActiveClassState] = useState(() => readActiveClass(uid))

  useEffect(() => {
    const stored = readFromStorage(uid)
    setClasses(stored ?? DEFAULT_CLASSES)
    setActiveClassState(readActiveClass(uid))
  }, [uid])

  useEffect(() => {
    writeToStorage(uid, classes)
  }, [uid, classes])

  function setActiveClass(cls) {
    setActiveClassState(cls)
    writeActiveClass(uid, cls)
  }

  function addClass(course) {
    setClasses((prev) => {
      if (prev.some((c) => c.id === course.id)) return prev
      return [...prev, course]
    })
  }

  function removeClass(id) {
    setClasses((prev) => prev.filter((c) => c.id !== id))
    setActiveClassState((prev) => (prev?.id === id ? null : prev))
  }

  function hasClass(id) {
    return classes.some((c) => c.id === id)
  }

  return (
    <ClassesContext.Provider value={{ classes, addClass, removeClass, hasClass, activeClass, setActiveClass }}>
      {children}
    </ClassesContext.Provider>
  )
}

export function useClasses() {
  const ctx = useContext(ClassesContext)
  if (!ctx) throw new Error('useClasses must be used inside <ClassesProvider>')
  return ctx
}
