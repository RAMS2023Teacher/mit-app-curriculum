import type { Approval, CapstonePlan, ClassBoard, ClassRoom, ClassSettings, Company, LogoSpec, Member, QuizResult, Role, Submission, UserProfile } from '../types'

export type Unsub = () => void

export interface NewSubmission {
  lessonId: string
  link: string
  notes: string
  claimsBonus: boolean
  aia: Submission['aia']
  contributions?: Record<string, string>
}

export interface Review {
  status: 'approved' | 'returned'
  feedback: string
  bonusApproved: boolean
}

/** Everything the UI needs from storage. Implemented by the demo (localStorage)
 *  backend and the Firebase backend, so the UI never knows which is running. */
export interface Backend {
  mode: 'demo' | 'firebase' | 'appsscript'
  /** Why sign-in failed, if it did (Apps Script: wrong account). */
  authProblem?: () => string

  onAuth(cb: (user: UserProfile | null) => void): Unsub
  signIn(): Promise<void>
  signOut(): Promise<void>
  setRole(role: Role): Promise<void>
  setName(name: string): Promise<void>

  createClass(name: string): Promise<ClassRoom>
  joinClass(code: string): Promise<ClassRoom>
  updateClass(classId: string, patch: { name?: string; settings?: ClassSettings; board?: ClassBoard }): Promise<void>
  deleteClass(classId: string): Promise<void>
  watchClass(classId: string, cb: (c: ClassRoom | null) => void): Unsub
  watchMyClasses(cb: (c: ClassRoom[]) => void): Unsub
  watchMembers(classId: string, cb: (m: Member[]) => void): Unsub
  removeMember(classId: string, uid: string): Promise<void>

  watchCompanies(classId: string, cb: (c: Company[]) => void): Unsub
  createCompany(classId: string, data: { name: string; tagline: string; logo: LogoSpec }): Promise<Company>
  joinCompany(classId: string, inviteCode: string): Promise<Company>
  leaveCompany(classId: string, companyId: string, uid?: string): Promise<void>
  updateCompany(classId: string, companyId: string, patch: { name?: string; tagline?: string; logo?: LogoSpec }): Promise<void>
  chooseBranch(classId: string, companyId: string, branchId: string, lessonId: string | null): Promise<void>
  /** Store a student's quiz result (keeps their best). Teachers pass excused results for a student. */
  recordQuiz(classId: string, companyId: string, lessonId: string, uid: string, result: QuizResult): Promise<void>
  savePlan(classId: string, companyId: string, lessonId: string, plan: CapstonePlan): Promise<void>

  /** Teacher: all submissions in the class. Student: their company's submissions. */
  watchSubmissions(classId: string, companyId: string | null, cb: (s: Submission[]) => void): Unsub
  submit(classId: string, company: Company, sub: NewSubmission): Promise<void>
  review(classId: string, submissionId: string, review: Review): Promise<void>
  /** Approved builds for every company in the class (drives XP, tree and leaderboard). */
  watchApprovals(classId: string, cb: (a: Approval[]) => void): Unsub
}

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const makeCode = (n = 6) =>
  Array.from({ length: n }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('')

export const DEFAULT_SETTINGS: ClassSettings = { maxCompanySize: 3, quizPassPercent: 70 }

export const approvalId = (companyId: string, lessonId: string, uid?: string) =>
  uid ? `${companyId}__${lessonId}__${uid}` : `${companyId}__${lessonId}`

/** Keep a student's best quiz result; a teacher's "excused" never replaces a real pass. */
export const isBetter = (prev: QuizResult | undefined, next: QuizResult) => {
  if (!prev) return true
  if (next.excused) return !prev.excused && prev.score / Math.max(1, prev.total) < 0.7
  if (prev.excused) return true
  return next.score / next.total >= prev.score / prev.total
}
