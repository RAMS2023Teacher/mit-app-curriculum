// ---------- Curriculum ----------

export type Track = 'core' | 'side' | 'mini' | 'games' | 'media' | 'tools' | 'launch'

/** One step in a lesson. `body` supports a tiny markdown subset:
 *  blank-line paragraphs, "- " bullets, "1. " numbered lists, **bold**, `code`.
 *  `blocks` are App Inventor block snippets, one block per line, indented with
 *  2 spaces per nesting level. Lines are color-coded by their first word:
 *  when → event, set → setter, call → method, if/else/for/while → control,
 *  initialize/get → variable, to → procedure. */
export interface LessonStep {
  title: string
  body: string
  blocks?: string[]
  /** Optional: which App Inventor screen the student should be on. */
  editor?: 'designer' | 'blocks' | 'phone'
}

export interface QuizQuestion {
  q: string
  options: string[]
  /** index into options */
  answer: number
  explain: string
}

/** Automatic checks run against an uploaded .aia project file. */
export type AiaCheck =
  | { kind: 'component'; type: string; label: string; min?: number }
  | { kind: 'anyComponent'; types: string[]; label: string }
  | { kind: 'block'; type: string; label: string; min?: number }
  | { kind: 'anyBlock'; types: string[]; label: string }
  | { kind: 'event'; component: string; event: string; label: string }
  | { kind: 'method'; method: string; label: string }
  | { kind: 'eventCount'; min: number; label: string }
  | { kind: 'screens'; min: number; label: string }
  | { kind: 'totalBlocks'; min: number; label: string }
  | { kind: 'screenProp'; prop: string; label: string }

export interface Lesson {
  id: string
  title: string
  subtitle: string
  icon: string
  track: Track
  /** Programming concepts this lesson teaches (shown as chips). */
  concepts: string[]
  /** Rough number of 45-minute class periods. */
  periods: number
  xp: { quiz: number; build: number; bonus: number }
  project: { name: string; description: string }
  objectives: string[]
  intro: string
  vocab: { term: string; def: string }[]
  steps: LessonStep[]
  challenge: { title: string; body: string }
  quiz: QuizQuestion[]
  checks: AiaCheck[]
  teacherNotes: string
}

export interface TreeNode {
  lessonId: string
  /** column (0..6, 3 = center trunk) */
  col: number
  /** row from the top */
  row: number
  prereqs: string[]
  prereqMode: 'all' | 'any'
  /** Nodes that share a branchId are a "choose one" fork. */
  branchId?: string
  optional?: boolean
}

export interface Branch {
  id: string
  label: string
  description: string
}

// ---------- People & classes ----------

export type Role = 'teacher' | 'student'

export interface UserProfile {
  uid: string
  name: string
  email?: string
  role: Role | null
  classIds: string[]
}

export interface ClassSettings {
  maxCompanySize: number
  quizPassPercent: number
}

export interface ClassRoom {
  id: string
  name: string
  teacherId: string
  teacherName: string
  joinCode: string
  createdAt: number
  settings: ClassSettings
}

export interface Member {
  uid: string
  name: string
  email?: string
  companyId: string | null
  joinedAt: number
}

export type LogoShape = 'circle' | 'shield' | 'hex' | 'square' | 'diamond' | 'star'

export interface LogoSpec {
  shape: LogoShape
  bg: string
  fg: string
  ring: string
  icon: string
  initials: string
  pattern: 'none' | 'stripes' | 'dots' | 'split'
}

export interface QuizResult {
  score: number
  total: number
  by: string
  byName: string
  at: number
}

export interface Company {
  id: string
  classId: string
  name: string
  tagline: string
  logo: LogoSpec
  memberIds: string[]
  memberNames: Record<string, string>
  inviteCode: string
  /** branchId → chosen lessonId */
  choices: Record<string, string>
  /** lessonId → best quiz result */
  quizzes: Record<string, QuizResult>
  createdAt: number
}

// ---------- Submissions ----------

export interface AiaReport {
  fileName: string
  projectName: string
  screens: string[]
  components: Record<string, number>
  blocks: Record<string, number>
  events: string[]
  methods: string[]
  screenProps: Record<string, string>
  totalBlocks: number
  checks: { label: string; passed: boolean }[]
}

export type SubmissionStatus = 'pending' | 'approved' | 'returned'

export interface Submission {
  id: string
  classId: string
  companyId: string
  companyName: string
  lessonId: string
  link: string
  notes: string
  claimsBonus: boolean
  aia: AiaReport | null
  status: SubmissionStatus
  feedback: string
  bonusApproved: boolean
  submittedBy: string
  submittedByName: string
  submittedAt: number
  reviewedAt: number | null
}

/** Public, class-visible record that a company's build was approved (written on review). */
export interface Approval {
  id: string // `${companyId}__${lessonId}`
  companyId: string
  lessonId: string
  bonus: boolean
  at: number
}
