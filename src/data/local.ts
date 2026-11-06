import type { Approval, ClassRoom, Company, Member, Role, Submission, UserProfile } from '../types'
import { DEFAULT_SETTINGS, approvalId, isBetter, makeCode, type Backend, type Unsub } from './backend'
import { getLesson } from '../curriculum'

/** Demo backend: everything lives in this browser's localStorage. Open two tabs
 *  (one as the teacher, one as a student) and they stay in sync. */

interface DB {
  version: number
  users: Record<string, UserProfile>
  classes: Record<string, ClassRoom>
  members: Record<string, Record<string, Member>>
  companies: Record<string, Record<string, Company>>
  submissions: Record<string, Record<string, Submission>>
}

const KEY = 'appventure-demo-db'
const SESSION_KEY = 'appventure-demo-user'
const VERSION = 3

const id = () => Math.random().toString(36).slice(2, 10)

export interface DemoBackend extends Backend {
  mode: 'demo'
  listUsers(): UserProfile[]
  switchUser(uid: string | null): void
  createUser(name: string, role: Role): string
  reset(): void
}

export function createLocalBackend(): DemoBackend {
  let db: DB = load()
  let currentUid: string | null = safeGet(SESSION_KEY)
  const listeners = new Set<() => void>()

  function load(): DB {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as DB
        if (parsed.version === VERSION) return parsed
      }
    } catch {
      /* storage unavailable */
    }
    return seed()
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(db))
    } catch {
      /* ignore */
    }
    emit()
  }
  function emit() {
    listeners.forEach((l) => l())
  }
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      db = load()
      emit()
    }
  })

  /** Subscribe to a derived value; re-run whenever the DB changes. */
  function watch<T>(get: () => T, cb: (v: T) => void): Unsub {
    let last = ''
    const run = () => {
      const v = get()
      const s = JSON.stringify(v)
      if (s !== last) {
        last = s
        cb(structuredClone(v))
      }
    }
    listeners.add(run)
    queueMicrotask(run)
    return () => listeners.delete(run)
  }

  const me = () => {
    const u = currentUid ? db.users[currentUid] : null
    if (!u) throw new Error('Not signed in')
    return u
  }
  const tick = () => new Promise((r) => setTimeout(r, 60))

  const backend: DemoBackend = {
    mode: 'demo',

    onAuth(cb) {
      return watch(() => (currentUid ? (db.users[currentUid] ?? null) : null), cb)
    },
    async signIn() {
      /* Demo sign-in happens through switchUser */
    },
    async signOut() {
      backend.switchUser(null)
    },
    async setRole(role) {
      me().role = role
      save()
    },
    async setName(name) {
      const u = me()
      u.name = name
      for (const cid of u.classIds) {
        const m = db.members[cid]?.[u.uid]
        if (m) m.name = name
      }
      save()
    },

    async createClass(name) {
      await tick()
      const u = me()
      const c: ClassRoom = {
        id: id(),
        name,
        teacherId: u.uid,
        teacherName: u.name,
        joinCode: makeCode(),
        createdAt: Date.now(),
        settings: { ...DEFAULT_SETTINGS },
      }
      db.classes[c.id] = c
      db.members[c.id] = {}
      db.companies[c.id] = {}
      db.submissions[c.id] = {}
      u.classIds.push(c.id)
      save()
      return c
    },
    async joinClass(code) {
      await tick()
      const u = me()
      const c = Object.values(db.classes).find((x) => x.joinCode === code.trim().toUpperCase())
      if (!c) throw new Error('No class found with that code. Check with your teacher.')
      if (!u.classIds.includes(c.id)) u.classIds.push(c.id)
      db.members[c.id][u.uid] ??= { uid: u.uid, name: u.name, email: u.email, companyId: null, joinedAt: Date.now() }
      save()
      return c
    },
    async updateClass(classId, patch) {
      Object.assign(db.classes[classId], patch)
      save()
    },
    async deleteClass(classId) {
      delete db.classes[classId]
      Object.values(db.users).forEach((u) => (u.classIds = u.classIds.filter((c) => c !== classId)))
      save()
    },
    watchClass(classId, cb) {
      return watch(() => db.classes[classId] ?? null, cb)
    },
    watchMyClasses(cb) {
      return watch(() => {
        const u = currentUid ? db.users[currentUid] : null
        if (!u) return []
        return u.classIds.map((c) => db.classes[c]).filter(Boolean)
      }, cb)
    },
    watchMembers(classId, cb) {
      return watch(() => Object.values(db.members[classId] ?? {}).sort((a, b) => a.name.localeCompare(b.name)), cb)
    },
    async removeMember(classId, uid) {
      const m = db.members[classId]?.[uid]
      if (m?.companyId) await backend.leaveCompany(classId, m.companyId, uid)
      delete db.members[classId][uid]
      const u = db.users[uid]
      if (u) u.classIds = u.classIds.filter((c) => c !== classId)
      save()
    },

    watchCompanies(classId, cb) {
      return watch(() => Object.values(db.companies[classId] ?? {}).sort((a, b) => a.createdAt - b.createdAt), cb)
    },
    async createCompany(classId, data) {
      await tick()
      const u = me()
      const member = db.members[classId][u.uid]
      if (member.companyId) throw new Error('You are already in a company.')
      const c: Company = {
        id: id(),
        classId,
        ...data,
        memberIds: [u.uid],
        memberNames: { [u.uid]: u.name },
        inviteCode: makeCode(5),
        choices: {},
        quizzes: {},
        createdAt: Date.now(),
      }
      db.companies[classId][c.id] = c
      member.companyId = c.id
      save()
      return c
    },
    async joinCompany(classId, inviteCode) {
      await tick()
      const u = me()
      const c = Object.values(db.companies[classId]).find((x) => x.inviteCode === inviteCode.trim().toUpperCase())
      if (!c) throw new Error('No company found with that invite code.')
      const max = db.classes[classId].settings.maxCompanySize
      if (c.memberIds.length >= max) throw new Error(`That company is full (max ${max} people).`)
      if (!c.memberIds.includes(u.uid)) c.memberIds.push(u.uid)
      c.memberNames[u.uid] = u.name
      db.members[classId][u.uid].companyId = c.id
      save()
      return c
    },
    async leaveCompany(classId, companyId, uid) {
      const who = uid ?? me().uid
      const c = db.companies[classId][companyId]
      if (!c) return
      c.memberIds = c.memberIds.filter((m) => m !== who)
      delete c.memberNames[who]
      const m = db.members[classId][who]
      if (m) m.companyId = null
      if (c.memberIds.length === 0) delete db.companies[classId][companyId]
      save()
    },
    async updateCompany(classId, companyId, patch) {
      Object.assign(db.companies[classId][companyId], patch)
      save()
    },
    async chooseBranch(classId, companyId, branchId, lessonId) {
      const c = db.companies[classId][companyId]
      if (lessonId) c.choices[branchId] = lessonId
      else delete c.choices[branchId]
      save()
    },
    async recordQuiz(classId, companyId, lessonId, uid, result) {
      const c = db.companies[classId][companyId]
      const byUser = (c.quizzes[lessonId] ??= {})
      if (isBetter(byUser[uid], result)) byUser[uid] = result
      save()
    },
    async savePlan(classId, companyId, lessonId, plan) {
      const c = db.companies[classId][companyId]
      c.plans = { ...(c.plans ?? {}), [lessonId]: plan }
      save()
    },

    watchSubmissions(classId, companyId, cb) {
      return watch(
        () =>
          Object.values(db.submissions[classId] ?? {})
            .filter((s) => !companyId || s.companyId === companyId)
            .sort((a, b) => b.submittedAt - a.submittedAt),
        cb,
      )
    },
    async submit(classId, company, sub) {
      await tick()
      const u = me()
      const s: Submission = {
        id: id(),
        classId,
        companyId: company.id,
        companyName: company.name,
        ...sub,
        status: 'pending',
        feedback: '',
        bonusApproved: false,
        submittedBy: u.uid,
        submittedByName: u.name,
        submittedAt: Date.now(),
        reviewedAt: null,
      }
      db.submissions[classId][s.id] = s
      save()
    },
    async review(classId, submissionId, review) {
      Object.assign(db.submissions[classId][submissionId], review, { reviewedAt: Date.now() })
      save()
    },

    watchApprovals(classId, cb) {
      return watch(() => {
        const out: Record<string, Approval> = {}
        const all = Object.values(db.submissions[classId] ?? {}).sort((a, b) => a.submittedAt - b.submittedAt)
        for (const sub of all) {
          if (sub.status !== 'approved') continue
          const solo = !!getLesson(sub.lessonId)?.individual
          const aid = approvalId(sub.companyId, sub.lessonId, solo ? sub.submittedBy : undefined)
          out[aid] = {
            id: aid,
            companyId: sub.companyId,
            lessonId: sub.lessonId,
            ...(solo ? { uid: sub.submittedBy } : {}),
            bonus: sub.bonusApproved || !!out[aid]?.bonus,
            at: sub.reviewedAt ?? sub.submittedAt,
          }
        }
        return Object.values(out)
      }, cb)
    },

    listUsers() {
      return Object.values(db.users)
    },
    switchUser(uid) {
      currentUid = uid
      try {
        if (uid) localStorage.setItem(SESSION_KEY, uid)
        else localStorage.removeItem(SESSION_KEY)
      } catch {
        /* ignore */
      }
      emit()
    },
    createUser(name, role) {
      const u: UserProfile = { uid: id(), name, role, classIds: [] }
      db.users[u.uid] = u
      save()
      return u.uid
    },
    reset() {
      db = seed()
      save()
      backend.switchUser(null)
    },
  }
  return backend
}

function safeGet(k: string) {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}

// ---------------------------------------------------------------- seed data

function seed(): DB {
  const day = 86_400_000
  const now = Date.now()
  const db: DB = { version: VERSION, users: {}, classes: {}, members: {}, companies: {}, submissions: {} }
  const teacher: UserProfile = { uid: 'demo-teacher', name: 'Demo Teacher', role: 'teacher', classIds: ['demo-class'] }
  db.users[teacher.uid] = teacher
  db.classes['demo-class'] = {
    id: 'demo-class',
    name: 'Period 3 · App Development',
    teacherId: teacher.uid,
    teacherName: teacher.name,
    joinCode: 'DEMO42',
    createdAt: now - 30 * day,
    settings: { ...DEFAULT_SETTINGS },
  }
  db.members['demo-class'] = {}
  db.companies['demo-class'] = {}
  db.submissions['demo-class'] = {}

  const student = (uid: string, name: string, companyId: string | null) => {
    db.users[uid] = { uid, name, role: 'student', classIds: ['demo-class'] }
    db.members['demo-class'][uid] = { uid, name, companyId, joinedAt: now - 29 * day }
  }

  type Seed = {
    id: string
    name: string
    tagline: string
    logo: Company['logo']
    people: [string, string][]
    choices: Record<string, string>
    done: string[]
    pending?: string
    returned?: string
    quizOnly?: string[]
    plan?: { lessonId: string; plan: Company['plans'] extends Record<string, infer P> | undefined ? P : never }
  }
  const seeds: Seed[] = [
    {
      id: 'co-pirates',
      name: 'Pixel Pirates',
      tagline: 'Games worth the plunder',
      logo: { shape: 'shield', bg: '#1d3557', fg: '#ffffff', ring: '#e63946', icon: '🏴‍☠️', initials: 'PP', pattern: 'stripes' },
      people: [['s-ava', 'Ava'], ['s-liam', 'Liam']],
      choices: { mini: 'mini-quiz', path: 'games-sprites' },
      done: ['core-hello', 'core-events', 'side-design', 'core-variables', 'core-conditionals', 'mini-quiz', 'core-loops', 'core-lists', 'core-procedures', 'games-sprites'],
      quizOnly: ['games-motion'],
    },
    {
      id: 'co-snap',
      name: 'Snap Studio',
      tagline: 'Every moment, remixed',
      logo: { shape: 'circle', bg: '#7b2cbf', fg: '#ffffff', ring: '#ffd166', icon: '📸', initials: 'SS', pattern: 'dots' },
      people: [['s-mia', 'Mia'], ['s-noah', 'Noah']],
      choices: { mini: 'mini-sound', path: 'media-camera' },
      done: ['core-hello', 'core-events', 'core-variables', 'core-conditionals', 'side-debug', 'mini-sound', 'core-loops', 'core-lists', 'core-procedures'],
      pending: 'media-camera',
    },
    {
      id: 'co-byte',
      name: 'ByteSize Tools',
      tagline: 'Small apps, big help',
      logo: { shape: 'hex', bg: '#06d6a0', fg: '#073b4c', ring: '#073b4c', icon: '🛠️', initials: 'BT', pattern: 'none' },
      people: [['s-zoe', 'Zoe'], ['s-eli', 'Eli']],
      choices: { mini: 'mini-convert' },
      done: ['core-hello', 'core-events', 'core-variables', 'core-conditionals', 'mini-convert'],
      returned: 'core-loops',
    },
    {
      id: 'co-llama',
      name: 'Neon Llama',
      tagline: 'Glow up your phone',
      logo: { shape: 'star', bg: '#ff006e', fg: '#ffffff', ring: '#3a86ff', icon: '🦙', initials: 'NL', pattern: 'split' },
      people: [['s-sam', 'Sam'], ['s-jordan', 'Jordan'], ['s-kai', 'Kai']],
      choices: {},
      done: ['core-hello', 'core-events'],
      pending: 'core-variables',
    },
    {
      id: 'co-orbit',
      name: 'Orbit Apps',
      tagline: 'Tools that keep you on track',
      logo: { shape: 'diamond', bg: '#073b4c', fg: '#ffffff', ring: '#11b39e', icon: '🛸', initials: 'OA', pattern: 'dots' },
      people: [['s-maya', 'Maya'], ['s-leo', 'Leo']],
      choices: { mini: 'mini-convert', path: 'tools-forms' },
      done: ['core-hello', 'core-events', 'core-variables', 'core-conditionals', 'mini-convert', 'core-loops', 'core-lists', 'core-procedures', 'tools-forms', 'tools-tinydb', 'tools-sensors'],
      plan: {
        lessonId: 'tools-capstone',
        plan: {
          idea: 'Practice Log for the school band',
          pitch: 'Our app lets band students log practice minutes so that the director can see who needs help.',
          must: ['Add today\'s minutes with a date', 'See a list of past practice', 'Weekly total'],
          nice: ['A goal for the week', 'A metronome sound'],
          roles: { 's-maya': 'Builds the TinyDB saving and the list', 's-leo': 'Builds the weekly total and designs the screen' },
          approved: false,
          feedback: '',
          updatedAt: Date.now() - 3 * 3_600_000,
        },
      },
    },
  ]

  const fakeReport = (lessonId: string, pass = true): Submission['aia'] => {
    const lesson = getLesson(lessonId)
    return {
      fileName: `${lessonId}.aia`,
      projectName: lesson?.project.name.replace(/\W/g, '') ?? 'MyApp',
      screens: ['Screen1'],
      components: { Form: 1, Button: 2, Label: 1 },
      blocks: { component_event: 2 },
      events: ['Button.Click'],
      methods: [],
      screenProps: { AppName: 'MyApp' },
      totalBlocks: 18,
      checks: (lesson?.checks ?? []).map((c, i) => ({ label: c.label, passed: pass || i > 0 })),
    }
  }

  let t = now - 25 * day
  for (const s of seeds) {
    s.people.forEach(([uid, name]) => student(uid, name, s.id))
    const company: Company = {
      id: s.id,
      classId: 'demo-class',
      name: s.name,
      tagline: s.tagline,
      logo: s.logo,
      memberIds: s.people.map((p) => p[0]),
      memberNames: Object.fromEntries(s.people),
      inviteCode: makeCode(5),
      choices: s.choices,
      quizzes: {},
      createdAt: t,
    }
    db.companies['demo-class'][s.id] = company
    const [firstUid, firstName] = s.people[0]
    const addSub = (lessonId: string, status: Submission['status'], at: number, extra: Partial<Submission> = {}) => {
      const sid = `${s.id}-${lessonId}-${status}`
      db.submissions['demo-class'][sid] = {
        id: sid,
        classId: 'demo-class',
        companyId: s.id,
        companyName: s.name,
        lessonId,
        link: '',
        notes: status === 'pending' ? 'We added an extra feature! Check out the second button.' : '',
        claimsBonus: status === 'pending',
        aia: fakeReport(lessonId, status !== 'returned'),
        status,
        feedback: status === 'approved' ? 'Nice work! 🎉' : '',
        bonusApproved: false,
        submittedBy: firstUid,
        submittedByName: firstName,
        submittedAt: at,
        reviewedAt: status === 'pending' ? null : at + day / 4,
        ...extra,
      }
    }
    // Every member takes each quiz. `onlyFirst` leaves the partner(s) still to do it.
    const quiz = (lessonId: string, at: number, onlyFirst = false) => {
      const total = getLesson(lessonId)?.quiz.length ?? 4
      company.quizzes[lessonId] = {}
      s.people.forEach(([uid, name], i) => {
        if (onlyFirst && i > 0) return
        company.quizzes[lessonId][uid] = { score: Math.max(3, total - ((lessonId.length + i) % 2)), total, by: uid, byName: name, at: at + i * 3_600_000 }
      })
    }
    s.done.forEach((lessonId, i) => {
      const at = t + i * 1.6 * day
      quiz(lessonId, at)
      addSub(lessonId, 'approved', at + day / 3, { bonusApproved: i % 3 === 0 })
    })
    s.quizOnly?.forEach((l) => quiz(l, now - day, true))
    if (s.pending) {
      quiz(s.pending, now - day)
      addSub(s.pending, 'pending', now - day / 6)
    }
    if (s.plan) company.plans = { [s.plan.lessonId]: s.plan.plan }
    if (s.returned) {
      quiz(s.returned, now - 2 * day)
      addSub(s.returned, 'returned', now - 2 * day, {
        feedback: 'Your countdown never stops at 0. Add an if block that sets Clock1.TimerEnabled to false when the count reaches 0, then resubmit!',
      })
    }
    t += day / 2
  }
  student('s-riley', 'Riley', null)
  return db
}
