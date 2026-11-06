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

const POLL_MS = 20_000

function call<T>(method: string, ...args: unknown[]): Promise<T> {
  return new Promise((resolve, reject) => {
    const run = window.google?.script.run
    if (!run) return reject(new Error('AppVenture must be opened from its Google Apps Script link.'))
    run
      .withSuccessHandler((v) => resolve((v ? JSON.parse(v) : undefined) as T))
      .withFailureHandler((e) => {
        const msg = String(e?.message ?? e).replace(/^Exception:\s*/, '')
        reject(
          new Error(
            /^Unknown action/.test(msg)
              ? 'This needs the newer server file. Paste the latest apps-script/Code.gs into your script, then Deploy → Manage deployments → Edit → New version (see DEPLOY.md).'
              : msg,
          ),
        )
      })
      .api(method, JSON.stringify(args))
  })
}

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
  constructor(load: () => Promise<T>) {
    this.load = load
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
      }, POLL_MS)
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
  const meStore = new Polled<Me | null>(() => call<Me>('me').catch((e) => {
    authError = e instanceof Error ? e.message : String(e)
    return null
  }))
  const classesStore = new Polled<ClassRoom[]>(() => call<ClassRoom[]>('myClasses'))
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
    submit: (cid, company, sub) => write('submit', cid, company.id, sub),
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
