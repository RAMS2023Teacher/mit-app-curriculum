import type { Approval, ClassRoom, Company, Member, Submission, UserProfile } from '../types'
import type { Backend, Unsub } from './backend'
import { getLesson } from '../curriculum'

/** Backend that talks to apps-script/Code.gs through google.script.run.
 *  Data lives in a Google Sheet in the teacher's school Drive. */

interface GoogleScriptRun {
  withSuccessHandler(fn: (v: string) => void): GoogleScriptRun
  withFailureHandler(fn: (e: Error) => void): GoogleScriptRun
  api(method: string, argsJson: string): void
}
declare global {
  interface Window {
    google?: {
      script: {
        run: GoogleScriptRun
        url?: { getLocation(cb: (loc: { hash: string }) => void): void }
      }
    }
  }
}

// Classroom assignment links point at …/exec#/class/<id>/lesson/<id>. The app runs inside
// Google's frame, so read the outer page's hash once and jump there.
try {
  window.google?.script.url?.getLocation((loc) => {
    if (loc.hash && loc.hash.startsWith('/') && !window.location.hash.slice(1).startsWith('/class')) window.location.hash = loc.hash
  })
} catch {
  /* not inside Apps Script */
}

const POLL_MS = 20_000 // class data
const SLOW_POLL_MS = 120_000 // my account and class list change rarely

/** Messages that mean "Google is busy, try again", not "you did something wrong". */
const BUSY_RE =
  /BUSY:|simultaneous invocations|invoked too many times|Lock timeout|could not obtain lock|server error occurred|Service (error|unavailable)|Timed out|NetworkError|HTTP 0|try again later/i
const MAX_TRIES = 6 // the first try plus up to 5 retries

export const isBusy = (e: unknown) => BUSY_RE.test(String((e as Error)?.message ?? e))

function callOnce<T>(method: string, argsJson: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const run = window.google?.script.run
    if (!run) return reject(new Error('AppVenture must be opened from its Google Apps Script link.'))
    run
      .withSuccessHandler((v) => resolve((v ? JSON.parse(v) : undefined) as T))
      .withFailureHandler((e) => {
        const msg = String(e?.message ?? e).replace(/^(Exception|Error):\s*/, '')
        reject(
          new Error(
            /^Unknown action/.test(msg)
              ? 'This needs the newer server file. Paste the latest apps-script/Code.gs into your script, then Deploy → Manage deployments → Edit → New version (see DEPLOY.md).'
              : msg,
          ),
        )
      })
      .api(method, argsJson)
  })
}

// ---- "Busy… saving your work" note (shown only while a request is being retried)
let busyNote: HTMLElement | null = null
function showBusy(on: boolean) {
  if (on && !busyNote) {
    busyNote = document.createElement('div')
    busyNote.className = 'busy-note'
    busyNote.setAttribute('role', 'status')
    busyNote.textContent = '⏳ Busy… saving your work'
    document.body.appendChild(busyNote)
  } else if (!on && busyNote) {
    busyNote.remove()
    busyNote = null
  }
}

// ---- one request at a time per browser; identical waiting requests share one call
let chain: Promise<unknown> = Promise.resolve()
const waiting = new Map<string, Promise<unknown>>()
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function withRetries<T>(method: string, argsJson: string): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      const out = await callOnce<T>(method, argsJson)
      showBusy(false)
      return out
    } catch (e) {
      if (!isBusy(e) || attempt >= MAX_TRIES) {
        showBusy(false)
        throw isBusy(e) ? new Error('The app is very busy right now. Your work so far is safe. Wait a moment and try again.') : e
      }
      showBusy(true)
      // Growing, randomised waits so a whole class doesn't retry at the same instant.
      await sleep(Math.min(8000, 400 * 2 ** attempt) * (0.6 + Math.random() * 0.8))
    }
  }
}

function call<T>(method: string, ...args: unknown[]): Promise<T> {
  const argsJson = JSON.stringify(args)
  const key = method + argsJson
  const same = waiting.get(key)
  if (same) return same as Promise<T>
  const p = chain.then(() => withRetries<T>(method, argsJson))
  chain = p.catch(() => undefined)
  waiting.set(key, p)
  const done = () => {
    if (waiting.get(key) === p) waiting.delete(key)
  }
  p.then(done, done)
  return p
}

const requestId = () => Math.random().toString(36).slice(2, 12) + Date.now().toString(36)

interface Snapshot {
  cls: ClassRoom | null
  members: Member[]
  companies: Company[]
  submissions: Submission[]
  approvals: Approval[]
}

/** A polled value shared by every subscriber. */
class Polled<T> {
  private value: T | undefined
  private last = ''
  private subs = new Set<(v: T) => void>()
  private timer: ReturnType<typeof setInterval> | null = null
  private inflight: Promise<void> | null = null
  private load: () => Promise<T>
  private every: number
  constructor(load: () => Promise<T>, every = POLL_MS) {
    this.load = load
    this.every = every
  }

  get current(): T | undefined {
    return this.value
  }

  subscribe(cb: (v: T) => void): Unsub {
    this.subs.add(cb)
    if (this.value !== undefined) queueMicrotask(() => cb(this.value as T))
    if (!this.timer) {
      void this.refresh()
      this.timer = setInterval(() => {
        if (document.visibilityState === 'visible') void this.refresh()
      }, this.every)
    }
    return () => {
      this.subs.delete(cb)
      if (this.subs.size === 0 && this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  }

  refresh(): Promise<void> {
    if (this.inflight) return this.inflight
    this.inflight = this.load()
      .then((v) => {
        const s = JSON.stringify(v)
        if (s !== this.last) {
          this.last = s
          this.value = v
          this.subs.forEach((cb) => cb(v))
        }
      })
      .catch((e) => console.error(e))
      .finally(() => {
        this.inflight = null
      })
    return this.inflight
  }
}

type Me = UserProfile & { canTeach: boolean }

export function createAppsScriptBackend(): Backend {
  const meStore: Polled<Me | null> = new Polled<Me | null>(
    () =>
      call<Me>('me').catch((e) => {
        authError = e instanceof Error ? e.message : String(e)
        // Too busy to load the page: say so kindly and try again by itself in a few seconds.
        if (/very busy/.test(authError)) setTimeout(() => void meStore.refresh(), 4000 + Math.random() * 4000)
        return null
      }),
    SLOW_POLL_MS,
  )
  const classesStore = new Polled<ClassRoom[]>(() => call<ClassRoom[]>('myClasses'), SLOW_POLL_MS)
  const snapshots = new Map<string, Polled<Snapshot>>()
  let authError = ''

  const snap = (cid: string) => {
    let s = snapshots.get(cid)
    if (!s) {
      s = new Polled<Snapshot>(() => call<Snapshot>('snapshot', cid))
      snapshots.set(cid, s)
    }
    return s
  }
  const watchSnap = <T,>(cid: string, pick: (s: Snapshot) => T, cb: (v: T) => void) => {
    let last = ''
    return snap(cid).subscribe((s) => {
      const v = pick(s)
      const str = JSON.stringify(v)
      if (str !== last) {
        last = str
        cb(v)
      }
    })
  }
  /** Run a write, then refresh everything that might have changed. */
  const write = async <T,>(method: string, ...args: unknown[]): Promise<T> => {
    const out = await call<T>(method, ...args)
    await Promise.all([meStore.refresh(), classesStore.refresh(), ...[...snapshots.values()].map((s) => s.refresh())])
    return out
  }

  return {
    mode: 'appsscript',
    onAuth(cb) {
      return meStore.subscribe((u) => {
        if (!u && authError) document.title = 'AppVenture: ' + authError
        cb(u)
      })
    },
    async signIn() {
      /* Google handles sign-in before the page loads. */
    },
    async signOut() {
      window.open('https://accounts.google.com/Logout', '_top')
    },
    setRole: (role) => write('setRole', role),
    setName: (name) => write('setName', name),

    createClass: (name) => write('createClass', name),
    joinClass: (code) => write('joinClass', code),
    updateClass: (cid, patch) => write('updateClass', cid, patch),
    deleteClass: (cid) => write('deleteClass', cid),
    watchClass: (cid, cb) => watchSnap(cid, (s) => s.cls, cb),
    watchMyClasses: (cb) => classesStore.subscribe(cb),
    watchMembers: (cid, cb) => watchSnap(cid, (s) => [...(s.members ?? [])].sort((a, b) => a.name.localeCompare(b.name)), cb),
    removeMember: (cid, uid) => write('removeMember', cid, uid),

    watchCompanies: (cid, cb) => watchSnap(cid, (s) => [...(s.companies ?? [])].sort((a, b) => a.createdAt - b.createdAt), cb),
    createCompany: (cid, data) => write('createCompany', cid, data),
    joinCompany: (cid, code) => write('joinCompany', cid, code),
    leaveCompany: (cid, coid, uid) => write('leaveCompany', cid, coid, uid),
    updateCompany: (cid, coid, patch) => write('updateCompany', cid, coid, patch),
    chooseBranch: (cid, coid, branchId, lessonId) => write('chooseBranch', cid, coid, branchId, lessonId),
    recordQuiz: (cid, coid, lessonId, uid, result) => write('recordQuiz', cid, coid, lessonId, uid, result),
    savePlan: (cid, coid, lessonId, plan) => write('savePlan', cid, coid, lessonId, plan),

    // The server already limits students to their own company's submissions.
    watchSubmissions: (cid, _companyId, cb) =>
      watchSnap(cid, (s) => [...(s.submissions ?? [])].sort((a, b) => b.submittedAt - a.submittedAt), cb),
    // The id travels with the request, so a retried save can never store the same build twice.
    submit: (cid, company, sub) => write('submit', cid, company.id, { ...sub, rid: requestId() }),
    storage: {
      info: () => call('dataInfo'),
      backupNow: () => call('backupNow'),
    },
    review: async (cid, sid, review) => {
      // The server doesn't know the curriculum, so tell it whether this is a solo lesson.
      const known = snap(cid).current ?? (await call<Snapshot>('snapshot', cid))
      const sub = known.submissions?.find((x) => x.id === sid)
      const solo = !!(sub && getLesson(sub.lessonId)?.individual)
      return write('review', cid, sid, review, solo)
    },
    authProblem: () => authError,
    watchApprovals: (cid, cb) => watchSnap(cid, (s) => s.approvals ?? [], cb),
    classroom: {
      listCourses: () => call('crListCourses'),
      importCourse: (courseId, classId) => write('crImportCourse', courseId, classId),
      syncRoster: (cid) => write('crSyncRoster', cid),
      createAssignments: (cid, items, publish) => write('crCreateAssignments', cid, items, publish),
      pushGrades: (cid, grades) => write('crPushGrades', cid, grades),
    },
  }
}
