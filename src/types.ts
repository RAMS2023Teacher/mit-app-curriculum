// ---------- Curriculum ----------

export type Track = 'core' | 'side' | 'mini' | 'games' | 'media' | 'tools' | 'launch'

/** One step in a lesson. `body` supports a tiny markdown subset:
 *  blank-line paragraphs, "- " bullets, "1. " numbered lists, **bold**, `code`.
 *  `blocks` are App Inventor block snippets, one block per line, indented with
 *  2 spaces per nesting level. Lines are color-coded by their first word:
 *  when → event, set → setter, call → method, if/else/for/while → control,
 *  initialize/get → variable, to → procedure. */
/** A block or component that is new on the required path, shown as a callout. */
export interface NewBlock {
  /** e.g. "format as decimal" or "HorizontalArrangement" */
  name: string
  /** where to find it, e.g. "Math drawer" or "Palette → Layout" */
  where: string
  /** one short sentence: what it does */
  what: string
}

export interface LessonStep {
  title: string
  body: string
  /** Blocks. Write ___ for an empty slot the student must fill in themselves. */
  blocks?: string[]
  /** Optional: which App Inventor screen the student should be on. */
  editor?: 'designer' | 'blocks' | 'phone'
  /** Plain-language version of `body`: 1-3 short sentences, everyday words, no idioms. */
  simple?: string
  /** "Test now" checkpoint: what the student should see when this step works. */
  check?: string
  /** "Stuck? Check this" tips: the most common mistakes for this step. */
  stuck?: string[]
  /** This step starts class period N (only on multi-period lessons; omit for day 1). */
  day?: number
  /** New blocks/components introduced in this step. */
  newBlocks?: NewBlock[]
  /** Sentence starters for written or spoken tasks. */
  frames?: string[]
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
  /** Required "you do" task at the end of the build: a new feature described in words only. */
  remix?: { title: string; spec: string; hints: string[] }
  /** "If your device can't…" fallbacks shown to students. */
  devices?: { need: string; fallback: string }[]
  /** Capstone idea cards that are doable with what this path taught. */
  ideas?: { title: string; pitch: string; uses: string[]; stretch: string }[]
  /** Every student submits their own build (Solo Challenge). */
  individual?: boolean
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
  /** lessonId → link to a starter .aia the teacher shared (e.g. Google Drive) */
  starters?: Record<string, string>
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
  /** Set by the teacher to excuse a student from this quiz (e.g. long absence). */
  excused?: boolean
}

/** A company's capstone plan, filled in on the Mission stage. */
export interface CapstonePlan {
  idea: string
  pitch: string
  must: string[]
  nice: string[]
  /** uid → what this person owns / their role */
  roles: Record<string, string>
  approved: boolean
  feedback: string
  updatedAt: number
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
  /** lessonId → uid → that student's best quiz result. Every member takes the quiz. */
  quizzes: Record<string, Record<string, QuizResult>>
  /** lessonId → capstone plan */
  plans?: Record<string, CapstonePlan>
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
  /** uid → what that partner did (capstones and Launch Day) */
  contributions?: Record<string, string>
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
  id: string // `${companyId}__${lessonId}` or, for solo lessons, `${companyId}__${lessonId}__${uid}`
  companyId: string
  lessonId: string
  /** Set for individual (solo) lessons: whose build was approved. */
  uid?: string
  bonus: boolean
  at: number
}
