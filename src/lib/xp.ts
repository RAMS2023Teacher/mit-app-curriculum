import type { ClassSettings, Lesson } from '../types'

/** A lesson's XP in this class: the teacher's values if set, otherwise the lesson's defaults. */
export function xpOf(lesson: Lesson, settings?: ClassSettings | null): Lesson['xp'] {
  return settings?.xp?.[lesson.id] ?? lesson.xp
}

/** The lesson with this class's XP values swapped in. */
export function withXp(lesson: Lesson, settings?: ClassSettings | null): Lesson {
  const xp = xpOf(lesson, settings)
  return xp === lesson.xp ? lesson : { ...lesson, xp }
}
