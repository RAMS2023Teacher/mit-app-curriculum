import type { Approval, CapstonePlan, ClassBoard, ClassRoom, ClassroomCourse, Desk, HelpRequest, HelpWhere, ClassSettings, Company, LogoSpec, Member, QuizResult, Role, Submission, UserProfile } from '../types'
import type { GameEvent, GameResult, Player, PlayerCard } from '../game/types'

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
  /** `answers` (the option picked for each question) lets the server mark the quiz itself and pay personal XP. */
  recordQuiz(classId: string, companyId: string, lessonId: string, uid: string, result: QuizResult & { answers?: number[] }): Promise<GameResult | null | void>
  savePlan(classId: string, companyId: string, lessonId: string, plan: CapstonePlan): Promise<void>

  /** Teacher: all submissions in the class. Student: their company's submissions. */
  watchSubmissions(classId: string, companyId: string | null, cb: (s: Submission[]) => void): Unsub
  submit(classId: string, company: Company, sub: NewSubmission): Promise<void>
  review(classId: string, submissionId: string, review: Review): Promise<void>
  /** Approved builds for every company in the class (drives XP, tree and leaderboard). */
  watchApprovals(classId: string, cb: (a: Approval[]) => void): Unsub

  /** ✋ Help requests and idle markers (not in the Firebase version). */
  help?: HelpApi

  /** Personal XP, levels, badges, shop and avatar (not in the Firebase version). */
  game?: GameApi

  /** Where the class data lives and its backups (Google Apps Script version only). */
  storage?: { info(): Promise<DataInfo>; backupNow(): Promise<DataInfo> }

  /** Google Classroom (only in the Google Apps Script version, and a pretend version in demo mode). */
  classroom?: ClassroomApi
}

export interface NewAssignment {
  lessonId: string
  title: string
  description: string
  points: number
}

export interface GradeUpdate {
  lessonId: string
  uid: string
  points: number
}

export interface ClassroomApi {
  listCourses(): Promise<ClassroomCourse[]>
  /** Create a new class from a course (classId omitted) or link an existing class, then import the roster. */
  importCourse(courseId: string, classId?: string): Promise<{ classId: string; added: number; total: number }>
  syncRoster(classId: string): Promise<{ added: number; total: number }>
  createAssignments(classId: string, items: NewAssignment[], publish: boolean): Promise<{ lessonId: string; ok: boolean; error?: string }[]>
  /** Write draft grades; the teacher returns them in Classroom. */
  pushGrades(classId: string, grades: GradeUpdate[]): Promise<{ updated: number; unchanged: number; skipped: number; errors: string[] }>
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

export interface HelpApi {
  /** The student's own request (checked every 30 s). */
  watchMine(classId: string, cb: (r: HelpRequest | null) => void): Unsub
  /** Teacher: everyone who needs help or is idle (checked every 10 s). */
  watchDesk(classId: string, cb: (d: Desk) => void): Unsub
  ask(classId: string, where: HelpWhere, note: string): Promise<void>
  cancel(classId: string): Promise<void>
  done(classId: string, uid: string): Promise<void>
  /** A student's page says it has been quiet for 2 minutes (true) or is active again (false). */
  idle(classId: string, on: boolean): Promise<void>
}

export interface GameApi {
  watchPlayer(classId: string, cb: (p: Player) => void): Unsub
  /** Classmates' public game info: XP and avatar. */
  watchPlayers(classId: string, cb: (p: PlayerCard[]) => void): Unsub
  earn(classId: string, events: GameEvent[]): Promise<GameResult>
  buy(classId: string, item: string): Promise<GameResult>
  saveAvatar(classId: string, avatar: Record<string, string>): Promise<GameResult>
  giveBadge(classId: string, uid: string): Promise<{ given: boolean }>
}

export interface DataInfo {
  dataUrl: string
  backupsUrl: string
  students: number
  classes: number
  today: string
  lastBackup: string
  lastBackupAt: number
  backups: string[]
  /** Links to any other data sheets this app has ever used (should be empty). */
  otherData: string[]
}
