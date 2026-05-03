import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  listTerms,
  getTermCourses,
  filterCourses,
  listSubjects,
  formatTime,
  formatDays,
  DAY_LABELS,
} from './lib/paperApi'
import { useClasses } from './context/ClassesContext'

const LEVELS = [
  { v: 100, label: '100s' },
  { v: 200, label: '200s' },
  { v: 300, label: '300s' },
  { v: 400, label: '400s' },
  { v: 500, label: '500+' },
]

const TIMES = [
  { v: 'morning', label: 'Morning' },
  { v: 'afternoon', label: 'Afternoon' },
  { v: 'evening', label: 'Evening' },
]

const COMPONENTS = ['LEC', 'DIS', 'LAB', 'SEM', 'STU']

export default function CourseDiscovery({ onClose }) {
  const navigate = useNavigate()
  const { classes, addClass, hasClass, removeClass } = useClasses()

  const close = onClose || (() => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/dashboard')
  })

  const [terms, setTerms] = useState([])
  const [termId, setTermId] = useState('')
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    subject: '',
    levels: [],
    days: [],
    timesOfDay: [],
    components: [],
    instructor: '',
  })
  const searchInputRef = useRef(null)

  // Esc to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  // Load term list
  useEffect(() => {
    let cancelled = false
    listTerms()
      .then((t) => {
        if (cancelled) return
        setTerms(t)
        const preferred = t.find((x) => /Spring|Fall|Winter/.test(x.name)) || t[0]
        setTermId(preferred?.id || t[0]?.id || '')
      })
      .catch((e) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [])

  // Load courses for selected term
  useEffect(() => {
    if (!termId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    getTermCourses(termId)
      .then((c) => {
        if (cancelled) return
        setAllCourses(c)
        setLoading(false)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e.message)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [termId])

  const subjects = useMemo(() => listSubjects(allCourses), [allCourses])

  const filtered = useMemo(
    () => filterCourses(allCourses, filters, search, 250),
    [allCourses, filters, search]
  )

  const termName = terms.find((t) => t.id === termId)?.name || ''

  function toggleArray(key, value) {
    setFilters((f) => {
      const arr = f[key]
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]
      return { ...f, [key]: next }
    })
  }

  function clearAllFilters() {
    setFilters({
      subject: '',
      levels: [],
      days: [],
      timesOfDay: [],
      components: [],
      instructor: '',
    })
  }

  const activeFilterCount =
    (filters.subject ? 1 : 0) +
    filters.levels.length +
    filters.days.length +
    filters.timesOfDay.length +
    filters.components.length +
    (filters.instructor.trim() ? 1 : 0)

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={close}
    >
      <div
        className="bg-surface rounded-modal w-full max-w-3xl flex flex-col overflow-hidden shadow-xl"
        style={{ maxHeight: '85vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-line">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-primary leading-tight">Discover courses</h2>
            <p className="text-xxs text-muted mt-0.5 truncate">
              Northwestern course catalog{termName ? ` · ${termName}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
              className="bg-page border border-line rounded-btn px-2.5 py-1.5 text-xxs text-primary font-medium focus:outline-none focus:border-brand transition-colors"
            >
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button
              onClick={close}
              className="text-muted hover:text-brand text-lg transition-colors leading-none px-1"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search + Filters trigger */}
        <div className="px-5 py-3 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by code, title, or instructor — e.g. 'CS 214'"
                className="w-full bg-page border border-line rounded-btn pl-9 pr-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-brand transition-colors"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
                🔍
              </span>
            </div>
            <button
              onClick={() => setFiltersOpen((x) => !x)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-btn text-xxs font-semibold border transition-colors ${
                filtersOpen || activeFilterCount > 0
                  ? 'bg-brand-light text-brand border-brand'
                  : 'bg-surface text-sub border-line hover:border-brand hover:text-primary'
              }`}
              aria-expanded={filtersOpen}
            >
              <FilterIcon />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Inline filter panel */}
        {filtersOpen && (
          <div className="bg-page border-b border-line">
            <div className="px-5 py-4 grid grid-cols-2 gap-x-5 gap-y-4">
              <FilterGroup label="Subject">
                <select
                  value={filters.subject}
                  onChange={(e) => setFilters((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full bg-surface border border-line rounded-btn px-2 py-1.5 text-xxs text-primary focus:outline-none focus:border-brand"
                >
                  <option value="">All subjects</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label="Instructor">
                <input
                  type="text"
                  value={filters.instructor}
                  onChange={(e) => setFilters((f) => ({ ...f, instructor: e.target.value }))}
                  placeholder="Last name"
                  className="w-full bg-surface border border-line rounded-btn px-2 py-1.5 text-xxs text-primary placeholder:text-muted focus:outline-none focus:border-brand"
                />
              </FilterGroup>

              <FilterGroup label="Course level">
                <div className="flex flex-wrap gap-1">
                  {LEVELS.map((lv) => (
                    <Chip
                      key={lv.v}
                      active={filters.levels.includes(lv.v)}
                      onClick={() => toggleArray('levels', lv.v)}
                    >
                      {lv.label}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Class type">
                <div className="flex flex-wrap gap-1">
                  {COMPONENTS.map((cmp) => (
                    <Chip
                      key={cmp}
                      active={filters.components.includes(cmp)}
                      onClick={() => toggleArray('components', cmp)}
                    >
                      {cmp}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Days">
                <div className="flex gap-1">
                  {DAY_LABELS.map((d, i) => (
                    <Chip
                      key={i}
                      active={filters.days.includes(i)}
                      onClick={() => toggleArray('days', i)}
                    >
                      {d}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup label="Time of day">
                <div className="flex flex-wrap gap-1">
                  {TIMES.map((t) => (
                    <Chip
                      key={t.v}
                      active={filters.timesOfDay.includes(t.v)}
                      onClick={() => toggleArray('timesOfDay', t.v)}
                    >
                      {t.label}
                    </Chip>
                  ))}
                </div>
              </FilterGroup>
            </div>
            {activeFilterCount > 0 && (
              <div className="px-5 py-2 border-t border-line bg-surface flex items-center justify-end">
                <button
                  onClick={clearAllFilters}
                  className="text-xxs text-brand hover:text-brand-hover font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Result meta */}
        <div className="px-5 py-2 border-b border-line flex items-center justify-between">
          <p className="text-xxs text-muted">
            {loading
              ? 'Loading…'
              : error
              ? ''
              : `${filtered.length.toLocaleString()} ${filtered.length === 1 ? 'result' : 'results'}${
                  allCourses.length ? ` of ${allCourses.length.toLocaleString()}` : ''
                }`}
          </p>
          {classes.length > 0 && (
            <p className="text-xxs text-muted">{classes.length} added</p>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-5 py-3 bg-page">
          {error && (
            <div className="bg-surface border border-line rounded-card p-4 text-sm text-sub">
              Couldn't load course data: {error}.{' '}
              <button
                onClick={() => setTermId((id) => id)}
                className="text-brand hover:text-brand-hover font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {!error && loading && (
            <div className="flex items-center justify-center py-12 text-sm text-muted">
              <span className="animate-pulse">Loading courses…</span>
            </div>
          )}

          {!error && !loading && filtered.length === 0 && allCourses.length > 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-sub">No courses match.</p>
              <button
                onClick={() => {
                  setSearch('')
                  clearAllFilters()
                }}
                className="text-brand hover:text-brand-hover text-xxs font-medium mt-2"
              >
                Clear search & filters
              </button>
            </div>
          )}

          {!error && !loading && filtered.length > 0 && (
            <ul className="space-y-2">
              {filtered.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  added={hasClass(course.id)}
                  onAdd={() => addClass(course)}
                  onRemove={() => removeClass(course.id)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-line px-5 py-2 flex items-center justify-between">
          <p className="text-xxs text-muted">
            Course data{' '}
            <a
              href="https://www.paper.nu"
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:text-brand-hover hover:underline"
            >
              courtesy of Paper
            </a>
          </p>
          <button
            onClick={close}
            className="text-label font-semibold text-brand hover:text-brand-hover transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function FilterIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h12M4 8h8M6 12h4" />
    </svg>
  )
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <p className="text-xxs text-muted font-semibold uppercase tracking-widest mb-1.5">{label}</p>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xxs font-medium px-2 py-1 rounded-btn border transition-colors ${
        active
          ? 'bg-brand text-white border-brand'
          : 'bg-surface text-sub border-line hover:border-brand hover:text-primary'
      }`}
    >
      {children}
    </button>
  )
}

function CourseCard({ course, added, onAdd, onRemove }) {
  const instructors = course.instructors || []
  const components = course.components || []
  const meetings = course.meetings || []
  const meetingPreview = useMemo(() => buildMeetingPreview(meetings), [meetings])
  const location = course.primaryLocation || ''

  return (
    <li className="bg-surface rounded-card border border-line hover:border-brand/40 transition-colors">
      <div className="px-4 py-2.5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-semibold text-primary">{course.code}</span>
            <span className="text-sm text-sub truncate">{course.title}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap mt-0.5 text-xxs">
            {meetingPreview && <span className="text-sub">{meetingPreview}</span>}
            {location && (
              <>
                <Sep />
                <span className="text-muted">{location}</span>
              </>
            )}
            {instructors.length > 0 && (
              <>
                <Sep />
                <span className="text-muted truncate">
                  {instructors.slice(0, 2).join(', ')}
                  {instructors.length > 2 ? ` +${instructors.length - 2}` : ''}
                </span>
              </>
            )}
            {components.length > 0 && (
              <span className="flex gap-1 ml-1">
                {components.slice(0, 3).map((cmp) => (
                  <span
                    key={cmp}
                    className="text-[10px] font-medium text-muted bg-page border border-line px-1 py-0.5 rounded-badge leading-none"
                  >
                    {cmp}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={added ? onRemove : onAdd}
          className={`flex-shrink-0 px-3 py-1.5 rounded-btn text-xxs font-semibold transition-colors ${
            added
              ? 'bg-brand-light text-brand hover:bg-brand/20'
              : 'bg-brand text-white hover:bg-brand-hover'
          }`}
        >
          {added ? '✓ Added' : '+ Add'}
        </button>
      </div>
    </li>
  )
}

function Sep() {
  return <span className="text-line">·</span>
}

function buildMeetingPreview(meetings) {
  if (!meetings || meetings.length === 0) return ''
  const seen = new Set()
  const parts = []
  for (const m of meetings) {
    const days = formatDays(m.days)
    const start = formatTime(m.start)
    const end = formatTime(m.end)
    const key = `${days}-${start}-${end}-${m.type}`
    if (seen.has(key)) continue
    seen.add(key)
    if (days && start) parts.push(`${days} ${start}${end ? `–${end}` : ''}`)
    if (parts.length >= 2) break
  }
  return parts.join(' · ')
}
