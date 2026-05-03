/**
 * Northwestern course data via the paper.nu public data system.
 * Per https://support.dilanxd.com/paper/develop/accessing-course-data,
 * data refreshes ~3x/week. Attribution: data courtesy of Paper (paper.nu).
 *
 * Course-level fields:
 *   i: id, c: school (WCAS, MEAS, MUSIC, …), u: subject (COMP_SCI, MATH, …),
 *   n: catalog number ("214-0"), t: title, s: [section, …]
 *
 * Section-level fields:
 *   i: section id, r: [{n: instructor}], s: section number,
 *   m: meeting-day codes ["02"=MW, "13"=TR, "024"=MWF, "1"=T, …; nulls = TBA],
 *   x/y: start/end {h, m} arrays parallel to m, l: locations,
 *   d/e: course-date range, c: component (LEC/DIS/LAB/SEM/…), a: capacity,
 *   p: [[label, body], …] (description, materials, prereqs)
 *
 * Day code legend: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri.
 */

const DATA_INFO_URL = 'https://api-legacy.dilanxd.com/paper/data'
const TERM_DATA_URL = (termId) => `https://cdn.dil.sh/paper-data/${termId}.json`

// Bump SCHEMA_VERSION whenever the normalized course shape changes — old caches
// become invalid automatically and refetch on next modal open.
const SCHEMA_VERSION = 4
const TERM_INFO_KEY = 'classhub.paper.dataInfo'
const TERM_DATA_KEY = (termId) => `classhub.paper.term.${termId}.v${SCHEMA_VERSION}`

export const DAY_LABELS = ['M', 'T', 'W', 'Th', 'F']
export const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota: silently degrade — refetch next time */
  }
}

let infoMemo = null
async function fetchDataInfo() {
  if (infoMemo) return infoMemo
  const res = await fetch(DATA_INFO_URL)
  if (!res.ok) throw new Error(`paper data info: HTTP ${res.status}`)
  infoMemo = await res.json()
  writeCache(TERM_INFO_KEY, infoMemo)
  return infoMemo
}

/**
 * List recent terms only — newest first.
 * NU students searching ClassHub care about the current quarter, the next one
 * or two for registration prep, and a couple of previous quarters for reference.
 * paper.nu's full back-catalog (2020+) is overkill here.
 */
export async function listTerms({ limit = 6 } = {}) {
  const info = await fetchDataInfo()
  const all = Object.entries(info.terms)
    .map(([id, t]) => ({ id, name: t.name, updated: t.updated }))
    .sort((a, b) => Number(b.id) - Number(a.id))
  return all.slice(0, limit)
}

let cleanedOldCaches = false
function cleanupOldCaches() {
  if (cleanedOldCaches) return
  cleanedOldCaches = true
  try {
    const currentSuffix = `.v${SCHEMA_VERSION}`
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('classhub.paper.term.') && !k.endsWith(currentSuffix)) {
        localStorage.removeItem(k)
      }
    }
  } catch {
    /* ignore */
  }
}

/** Fetch a term's course list, cached by term `updated` stamp. */
export async function getTermCourses(termId) {
  cleanupOldCaches()
  const info = await fetchDataInfo()
  const termMeta = info.terms[termId]
  if (!termMeta) throw new Error(`Unknown termId: ${termId}`)

  const cached = readCache(TERM_DATA_KEY(termId))
  if (cached && cached.updated === termMeta.updated) {
    return cached.courses
  }

  const res = await fetch(TERM_DATA_URL(termId))
  if (!res.ok) throw new Error(`paper term data: HTTP ${res.status}`)
  const raw = await res.json()
  const courses = normalizeCourses(raw)
  writeCache(TERM_DATA_KEY(termId), { updated: termMeta.updated, courses })
  return courses
}

function normalizeCourses(raw) {
  if (!Array.isArray(raw)) return []
  // Dedupe by code: paper.nu sometimes lists the same course under multiple
  // school entries (e.g. cross-listings). Merge instructors/components/meetings.
  const byCode = new Map()
  for (const c of raw) {
    const subject = c.u || ''
    const number = c.n || ''
    const code = `${subject} ${number}`.trim()
    if (!code) continue
    const sections = Array.isArray(c.s) ? c.s : []
    const existing = byCode.get(code)
    if (existing) {
      mergeSectionsInto(existing, sections, c)
    } else {
      const numberPart = number.split('-')[0].replace(/\D/g, '')
      const numericNumber = numberPart ? Number(numberPart) : null
      const acc = {
        id: c.i,
        school: c.c || '',
        subject,
        number,
        numericNumber,
        level: bucketLevel(numericNumber),
        code,
        title: c.t || '',
        instructors: new Set(),
        components: new Set(),
        days: new Set(),
        earliestStartMin: null,
        meetings: [],
        locations: new Set(),
      }
      mergeSectionsInto(acc, sections, c)
      byCode.set(code, acc)
    }
  }
  return [...byCode.values()].map(finalizeAcc)
}

function mergeSectionsInto(acc, sections, raw) {
  for (const sec of sections) {
    for (const r of sec?.r || []) {
      if (r?.n) acc.instructors.add(r.n)
    }
    if (sec?.c) acc.components.add(sec.c)
    const ms = Array.isArray(sec?.m) ? sec.m : []
    const xs = Array.isArray(sec?.x) ? sec.x : []
    const ys = Array.isArray(sec?.y) ? sec.y : []
    const ls = Array.isArray(sec?.l) ? sec.l : []
    ms.forEach((code, idx) => {
      if (typeof code !== 'string') return
      for (const ch of code) {
        const d = Number(ch)
        if (d >= 0 && d <= 4) acc.days.add(d)
      }
      const start = xs[idx]
      const end = ys[idx]
      const loc = ls[idx] || ls[0] || ''
      if (loc && loc !== 'TBA') acc.locations.add(loc)
      if (start && typeof start.h === 'number') {
        const startMin = start.h * 60 + (start.m || 0)
        if (acc.earliestStartMin == null || startMin < acc.earliestStartMin) {
          acc.earliestStartMin = startMin
        }
        acc.meetings.push({
          sectionId: sec.i,
          sectionNum: sec.s,
          type: sec.c,
          days: code,
          start,
          end,
          location: loc,
          instructors: (sec.r || []).map((r) => r.n).filter(Boolean),
        })
      }
    })
  }
}

function finalizeAcc(acc) {
  return {
    id: acc.id,
    school: acc.school,
    subject: acc.subject,
    number: acc.number,
    numericNumber: acc.numericNumber,
    level: acc.level,
    code: acc.code,
    title: acc.title,
    instructors: [...acc.instructors].sort(),
    components: [...acc.components],
    days: [...acc.days].sort(),
    earliestStartMin: acc.earliestStartMin,
    timeOfDay: bucketTimeOfDay(acc.earliestStartMin),
    meetings: acc.meetings,
    primaryLocation: shortLocation([...acc.locations][0] || ''),
  }
}

function shortLocation(loc) {
  // "Tech Lecture Room 3" → "Tech LR 3" loose shortening; if too long, just keep the building.
  if (!loc) return ''
  const trimmed = loc.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= 22) return trimmed
  // Fall back to first two words (usually building + room number)
  const parts = trimmed.split(' ')
  return parts.slice(0, 3).join(' ')
}

function bucketLevel(n) {
  if (n == null) return null
  if (n < 200) return 100
  if (n < 300) return 200
  if (n < 400) return 300
  if (n < 500) return 400
  return 500
}

function bucketTimeOfDay(startMin) {
  if (startMin == null) return null
  if (startMin < 12 * 60) return 'morning'
  if (startMin < 17 * 60) return 'afternoon'
  return 'evening'
}

function extractDescription(section) {
  if (!section || !Array.isArray(section.p)) return ''
  for (const pair of section.p) {
    if (!Array.isArray(pair) || pair.length < 2) continue
    const [label, body] = pair
    if (typeof body !== 'string') continue
    if (typeof label === 'string' && /overview/i.test(label)) {
      return stripHtml(body)
    }
  }
  for (const pair of section.p) {
    if (Array.isArray(pair) && typeof pair[1] === 'string') return stripHtml(pair[1])
  }
  return ''
}

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

/** List unique subject codes present in a term, sorted. */
export function listSubjects(courses) {
  const set = new Set()
  for (const c of courses) if (c.subject) set.add(c.subject)
  return [...set].sort()
}

/**
 * NU subject aliases — what students actually type vs paper.nu's stored codes.
 * Add more as we hear them.
 */
const SUBJECT_ALIASES = {
  cs: 'COMP_SCI',
  compsci: 'COMP_SCI',
  ee: 'ELEC_ENG',
  ece: 'ELEC_ENG',
  ie: 'IEMS',
  iems: 'IEMS',
  bio: 'BIOL_SCI',
  bme: 'BIOMED_ENG',
  chem: 'CHEM',
  econ: 'ECON',
  eng: 'ENGLISH',
  history: 'HISTORY',
  math: 'MATH',
  me: 'MECH_ENG',
  meche: 'MECH_ENG',
  phys: 'PHYSICS',
  poli: 'POLI_SCI',
  polisci: 'POLI_SCI',
  psy: 'PSYCH',
  psych: 'PSYCH',
  stat: 'STAT',
  stats: 'STAT',
}

/**
 * Split a query into a flat list of normalized search tokens.
 *  - Whitespace splits tokens.
 *  - "cs214" splits into "cs" + "214" so a single token captures code+number.
 *  - Aliases ("cs" → "COMP_SCI") are resolved.
 */
function tokenizeQuery(query) {
  const lower = query.trim().toLowerCase()
  if (!lower) return []
  const out = []
  for (const raw of lower.split(/\s+/)) {
    if (!raw) continue
    // Split letter-then-digit runs: "cs214" → ["cs", "214"], "214b" → ["214", "b"]
    const parts = raw.match(/[a-z_]+|\d+/g) || [raw]
    for (const p of parts) {
      out.push({
        text: p,
        isNumeric: /^\d+$/.test(p),
        // Pre-resolve subject aliases for letter tokens.
        alias: /^[a-z_]+$/.test(p) ? SUBJECT_ALIASES[p] : null,
      })
    }
  }
  return out
}

function tokenMatchesCourse(token, c) {
  // Numeric token: prefix-match the catalog number ("214" matches 214-0 but not 1214 or 212).
  if (token.isNumeric) {
    if (c.numericNumber == null) return false
    return String(c.numericNumber).startsWith(token.text)
  }
  const subj = (c.subject || '').toLowerCase()
  const title = (c.title || '').toLowerCase()
  const instr = (c.instructors || []).join(' ').toLowerCase()
  // Alias hit on the subject = full match (highest signal).
  if (token.alias && c.subject === token.alias) return true
  // Subject prefix match (e.g. "comp" matches "COMP_SCI").
  if (subj.startsWith(token.text)) return true
  // Word-boundary match in title or instructor — strict-ish, no random substrings.
  // \b with _ counts _ as word char so "comp_sci" boundaries are start and end only.
  const wbRe = new RegExp(`\\b${escapeRegex(token.text)}`, 'i')
  if (wbRe.test(title)) return true
  if (wbRe.test(instr)) return true
  return false
}

function tokenScore(token, c) {
  if (token.isNumeric) {
    return c.numericNumber != null && String(c.numericNumber) === token.text ? 200 : 100
  }
  if (token.alias && c.subject === token.alias) return 200
  const subj = (c.subject || '').toLowerCase()
  const title = (c.title || '').toLowerCase()
  if (subj === token.text) return 150
  if (subj.startsWith(token.text)) return 100
  if (new RegExp(`\\b${escapeRegex(token.text)}\\b`, 'i').test(title)) return 60
  return 30
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Apply structured filters + strict free-text search to a course array.
 * filters: { subject?: string, levels?: number[], days?: number[],
 *            timesOfDay?: ('morning'|'afternoon'|'evening')[],
 *            components?: string[], instructor?: string }
 */
export function filterCourses(courses, filters = {}, query = '', limit = 200) {
  const tokens = tokenizeQuery(query)
  const wantInstr = (filters.instructor || '').trim().toLowerCase()
  const wantLevels = filters.levels && filters.levels.length ? new Set(filters.levels) : null
  const wantDays = filters.days && filters.days.length ? new Set(filters.days) : null
  const wantTOD = filters.timesOfDay && filters.timesOfDay.length ? new Set(filters.timesOfDay) : null
  const wantComp = filters.components && filters.components.length ? new Set(filters.components) : null

  const scored = []
  for (const c of courses) {
    if (filters.subject && c.subject !== filters.subject) continue
    if (wantLevels && !wantLevels.has(c.level)) continue
    if (wantDays) {
      let ok = false
      for (const d of c.days || []) if (wantDays.has(d)) { ok = true; break }
      if (!ok) continue
    }
    if (wantTOD && !wantTOD.has(c.timeOfDay)) continue
    if (wantComp) {
      let ok = false
      for (const cmp of c.components || []) if (wantComp.has(cmp)) { ok = true; break }
      if (!ok) continue
    }
    if (wantInstr) {
      const wbRe = new RegExp(`\\b${escapeRegex(wantInstr)}`, 'i')
      const haystack = (c.instructors || []).join(' ')
      if (!wbRe.test(haystack)) continue
    }

    let score = 0
    if (tokens.length) {
      let allMatch = true
      for (const t of tokens) {
        if (!tokenMatchesCourse(t, c)) {
          allMatch = false
          break
        }
        score += tokenScore(t, c)
      }
      if (!allMatch) continue
    }
    scored.push({ c, score })
  }
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (a.c.subject !== b.c.subject) return a.c.subject.localeCompare(b.c.subject)
    return (a.c.numericNumber || 0) - (b.c.numericNumber || 0)
  })
  return scored.slice(0, limit).map((r) => r.c)
}

export function formatTime(t) {
  if (!t || typeof t.h !== 'number') return ''
  const hour = ((t.h + 11) % 12) + 1
  const ampm = t.h < 12 ? 'a' : 'p'
  const min = (t.m || 0).toString().padStart(2, '0')
  return min === '00' ? `${hour}${ampm}` : `${hour}:${min}${ampm}`
}

export function formatDays(dayCode) {
  if (typeof dayCode !== 'string') return ''
  return [...dayCode].map((ch) => DAY_LABELS[Number(ch)] || '').join('')
}
