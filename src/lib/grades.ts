import type { Company } from '../types'
import type { CompanyProgress } from './progress'
import type { GradeUpdate } from '../data/backend'

/**
 * How an AppVenture lesson becomes a Classroom grade, per student:
 *   30% × the student's OWN best quiz score (an excused quiz counts as full credit)
 * + 70% if the build is approved (the company's build, or the student's own on solo lessons)
 * + 10% extra credit if the bonus quest was approved
 * Students with no quiz attempt and no approved build are skipped (left blank in Classroom).
 */
export const GRADE_WEIGHTS = { quiz: 0.3, build: 0.7, bonus: 0.1 }

export function gradesFor(
  lessonId: string,
  maxPoints: number,
  companies: Company[],
  progress: Map<string, CompanyProgress>,
  individual: boolean,
): GradeUpdate[] {
  const out: GradeUpdate[] = []
  for (const c of companies) {
    const lp = progress.get(c.id)?.lessons[lessonId]
    if (!lp) continue
    for (const m of lp.quizBy) {
      const quiz = m.excused ? 1 : m.pct !== null ? m.pct / 100 : 0
      const built = individual ? lp.soloApproved.includes(m.uid) : lp.buildApproved
      if (m.pct === null && !m.excused && !built) continue
      const score = GRADE_WEIGHTS.quiz * quiz + (built ? GRADE_WEIGHTS.build : 0) + (built && lp.bonusApproved ? GRADE_WEIGHTS.bonus : 0)
      out.push({ lessonId, uid: m.uid, points: Math.round(score * maxPoints * 10) / 10 })
    }
  }
  return out
}
