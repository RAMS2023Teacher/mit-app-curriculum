import type { Approval, ClassRoom, ClassSettings, Company, LogoSpec, Member, QuizResult, Role, Submission, UserProfile } from '../types'

export type Unsub = () => void

export interface NewSubmission {
  lessonId: string
  link: string
  notes: string
  claimsBonus: boolean
  aia: Submission['aia']
}

export interface Review {
  status: 'approved' | 'returned'
  feedback: string
  bonusApproved: boolean
}

/** Everything the UI needs from storage. Implemented by the demo (localStorage)
 *  backend and the Firebase backend, so the UI never knows which is running. */
export interface Backend {
  mode: 'demo' | 'firebase'

  onAuth(cb: (user: UserProfile | null) => void): Unsub
  signIn(): Promise<void>
  signOut(): Promise<void>
  setRole(role: Role): Promise<void>
  setName(name: string): Promise<void>

  createClass(name: string): Promise<ClassRoom>
  joinClass(code: string): Promise<ClassRoom>
  updateClass(classId: string, patch: { name?: string; settings?: ClassSettings }): Promise<void>
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
  recordQuiz(classId: string, companyId: string, lessonId: string, result: QuizResult): Promise<void>

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
