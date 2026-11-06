import type { Approval, Company, Submission, TreeNode } from '../types'
import { TREE } from '../curriculum/tree'
import { getLesson } from '../curriculum'

export type NodeStatus =
  | 'locked'
  | 'available'
  | 'in-progress'
  | 'review'
  | 'returned'
  | 'complete'
  | 'not-taken'

/** One member's quiz standing on a lesson. */
export interface MemberQuiz {
  uid: string
  name: string
  pct: number | null
  passed: boolean
  excused: boolean
}

export interface LessonProgress {
  status: NodeStatus
  /** True when EVERY member has passed (or was excused by the teacher). */
  quizPassed: boolean
  /** Lowest best score among members who took it (percent). */
  quizBest: number | null
  /** Each member's quiz standing. */
  quizBy: MemberQuiz[]
  /** Solo lessons: uids whose own build is approved. */
  soloApproved: string[]
  buildApproved: boolean
  bonusApproved: boolean
  latest: Submission | null
  xp: number
}

export interface Level {
  index: number
  name: string
  min: number
  next: number | null
}

export const LEVELS: { name: string; min: number; icon: string }[] = [
  { name: 'Garage Startup', min: 0, icon: '🔧' },
  { name: 'Prototype', min: 150, icon: '🧪' },
  { name: 'Seed Round', min: 400, icon: '🌱' },
  { name: 'Series A', min: 800, icon: '🚀' },
  { name: 'Growth Stage', min: 1300, icon: '📈' },
  { name: 'Unicorn', min: 2000, icon: '🦄' },
  { name: 'Tech Giant', min: 2700, icon: '🏙️' },
]

export function levelFor(xp: number): Level & { icon: string } {
  let i = 0
  while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].min) i++
  return {
    index: i,
    name: LEVELS[i].name,
    icon: LEVELS[i].icon,
    min: LEVELS[i].min,
    next: i + 1 < LEVELS.length ? LEVELS[i + 1].min : null,
  }
}

export interface Badge {
  id: string
  icon: string
  name: string
  desc: string
}

export interface CompanyProgress {
  lessons: Record<string, LessonProgress>
  xp: number
  level: ReturnType<typeof levelFor>
  /** Where the company's logo sits on the tree: a lessonId, or "fork:<branchId>". */
  position: string
  completedCount: number
  requiredCount: number
  badges: Badge[]
  pathName: string | null
}

const isPrereqMet = (node: TreeNode, done: (id: string) => boolean) => {
  if (node.prereqs.length === 0) return true
  return node.prereqMode === 'all' ? node.prereqs.every(done) : node.prereqs.some(done)
}

export function computeProgress(
  company: Company,
  submissions: Submission[],
  approvals: Approval[],
  passPercent = 70,
): CompanyProgress {
  const mineApprovals = approvals.filter((a) => a.companyId === company.id)
  const approved = new Map(mineApprovals.filter((a) => !a.uid).map((a) => [a.lessonId, a]))
  const members = company.memberIds.map((uid) => ({ uid, name: company.memberNames[uid] ?? 'Member' }))
  const size = Math.max(1, members.length)
  const mine = submissions
    .filter((s) => s.companyId === company.id)
    .sort((a, b) => b.submittedAt - a.submittedAt)

  const lessons: Record<string, LessonProgress> = {}

  // First pass: per-lesson facts that don't depend on the tree.
  for (const node of TREE) {
    const lesson = getLesson(node.lessonId)
    const byUser = company.quizzes[node.lessonId] ?? {}
    const quizBy: MemberQuiz[] = members.map(({ uid, name }) => {
      const r = byUser[uid]
      const pct = r && !r.excused ? Math.round((r.score / Math.max(1, r.total)) * 100) : null
      return { uid, name, pct, excused: !!r?.excused, passed: !!r?.excused || (pct !== null && pct >= passPercent) }
    })
    const scores = quizBy.map((m) => m.pct).filter((p): p is number => p !== null)
    const pct = scores.length ? Math.min(...scores) : null
    const passedCount = quizBy.filter((m) => m.passed).length
    const quizPassed = passedCount === size
    const subs = mine.filter((s) => s.lessonId === node.lessonId)
    let buildOk: boolean
    let buildShare: number
    let bonus: boolean
    let soloApproved: string[] = []
    if (lesson?.individual) {
      // Solo lessons: every member needs their own approved build.
      const soloAppr = mineApprovals.filter((a) => a.lessonId === node.lessonId && a.uid)
      soloApproved = [...new Set([...soloAppr.map((a) => a.uid!), ...subs.filter((s) => s.status === 'approved').map((s) => s.submittedBy)])].filter((u) =>
        company.memberIds.includes(u),
      )
      buildShare = soloApproved.length / size
      buildOk = soloApproved.length === size
      bonus = soloAppr.some((a) => a.bonus) || subs.some((s) => s.status === 'approved' && s.bonusApproved)
    } else {
      const appr = approved.get(node.lessonId)
      buildOk = !!appr || subs.some((s) => s.status === 'approved')
      buildShare = buildOk ? 1 : 0
      bonus = !!appr?.bonus || subs.some((s) => s.status === 'approved' && s.bonusApproved)
    }
    // Quiz and solo XP fill in as each member finishes.
    const xp = lesson
      ? Math.round(lesson.xp.quiz * (passedCount / size)) + Math.round(lesson.xp.build * buildShare) + (bonus ? lesson.xp.bonus : 0)
      : 0
    lessons[node.lessonId] = {
      status: 'locked',
      quizPassed,
      quizBest: pct,
      quizBy,
      soloApproved,
      buildApproved: buildOk,
      bonusApproved: bonus,
      latest: subs[0] ?? null,
      xp,
    }
  }

  const done = (id: string) => {
    const p = lessons[id]
    return !!p && p.quizPassed && p.buildApproved
  }

  // Second pass: statuses (tree order guarantees prereqs come first).
  const ordered = [...TREE].sort((a, b) => a.row - b.row || a.col - b.col)
  for (const node of ordered) {
    const p = lessons[node.lessonId]
    const choice = node.branchId ? company.choices[node.branchId] : undefined
    if (done(node.lessonId)) p.status = 'complete'
    else if (choice && choice !== node.lessonId) p.status = 'not-taken'
    else if (!isPrereqMet(node, done)) {
      // A lesson on a path not taken is shown as such, not as "locked".
      const notTaken = node.prereqs.length > 0 && node.prereqs.every((pid) => lessons[pid]?.status === 'not-taken')
      p.status = notTaken ? 'not-taken' : 'locked'
    } else if (p.latest?.status === 'pending') p.status = 'review'
    else if (p.latest?.status === 'returned' && !p.buildApproved) p.status = 'returned'
    else if (p.quizBy.some((m) => m.passed || m.pct !== null) || p.latest || p.buildApproved) p.status = 'in-progress'
    else p.status = 'available'
  }

  const xp = Object.values(lessons).reduce((sum, p) => sum + p.xp, 0)

  // Position: first active required lesson in tree order.
  let position = 'solo-build'
  const active = ordered.find(
    (n) => !n.optional && ['available', 'in-progress', 'review', 'returned'].includes(lessons[n.lessonId].status),
  )
  if (active) {
    position =
      active.branchId && !company.choices[active.branchId] ? `fork:${active.branchId}` : active.lessonId
  }

  // 7 core + 1 first product + 4 studio lessons + launch day + solo challenge, whichever path is chosen.
  const requiredCount = 14
  const completedCount = ordered.filter((n) => !n.optional && lessons[n.lessonId].status === 'complete').length

  const pathChoice = company.choices.path
  const pathName =
    pathChoice === 'games-sprites'
      ? 'Game Studio'
      : pathChoice === 'media-camera'
        ? 'Media House'
        : pathChoice === 'tools-forms'
          ? 'Tool Works'
          : null

  return {
    lessons,
    xp,
    level: levelFor(xp),
    position,
    completedCount,
    requiredCount,
    badges: computeBadges(company, lessons, pathName),
    pathName,
  }
}

function computeBadges(company: Company, lessons: Record<string, LessonProgress>, pathName: string | null): Badge[] {
  const b: Badge[] = []
  const c = (id: string) => lessons[id]?.status === 'complete'
  if (c('core-hello')) b.push({ id: 'first-app', icon: '📱', name: 'First App', desc: 'Shipped your very first app' })
  if (c('core-variables')) b.push({ id: 'memory', icon: '🧠', name: 'Memory Maker', desc: 'Mastered variables' })
  if (c('core-conditionals')) b.push({ id: 'decider', icon: '🔀', name: 'Decision Engine', desc: 'Mastered conditionals' })
  if (c('core-loops')) b.push({ id: 'loop', icon: '🔁', name: 'Loop Legend', desc: 'Mastered loops and timers' })
  if (c('core-lists')) b.push({ id: 'lists', icon: '📋', name: 'List Wrangler', desc: 'Mastered lists' })
  if (c('core-procedures')) b.push({ id: 'proc', icon: '🧩', name: 'Abstraction Ace', desc: 'Mastered procedures' })
  if (c('side-design')) b.push({ id: 'design', icon: '🎨', name: 'Designer', desc: 'Finished the Design Studio side quest' })
  if (c('side-debug')) b.push({ id: 'debug', icon: '🐞', name: 'Bug Squasher', desc: 'Finished the Debug Detective side quest' })
  if (pathName) b.push({ id: 'path', icon: '🏢', name: pathName, desc: `Chose to become a ${pathName}` })
  if (['games-capstone', 'media-capstone', 'tools-capstone'].some(c))
    b.push({ id: 'capstone', icon: '🏆', name: 'Capstone Complete', desc: 'Designed and built an original app' })
  if (c('launch-day')) b.push({ id: 'launch', icon: '🚀', name: 'Launched!', desc: 'Pitched and published your app' })
  if (c('solo-build')) b.push({ id: 'solo', icon: '🧗', name: 'Solo Builder', desc: 'Every partner built an app on their own' })
  const perfect = Object.values(company.quizzes).some((byUser) => Object.values(byUser).some((q) => !q.excused && q.total > 0 && q.score === q.total))
  if (perfect) b.push({ id: 'perfect', icon: '💯', name: 'Perfect Score', desc: 'Got 100% on a quiz' })
  const bonuses = Object.values(lessons).filter((l) => l.bonusApproved).length
  if (bonuses >= 3) b.push({ id: 'over', icon: '⭐', name: 'Overachiever', desc: 'Earned 3+ challenge bonuses' })
  return b
}

export const STATUS_LABEL: Record<NodeStatus, string> = {
  locked: 'Locked',
  available: 'Ready to start',
  'in-progress': 'In progress',
  review: 'Waiting for review',
  returned: 'Needs changes',
  complete: 'Complete',
  'not-taken': 'Path not taken',
}
