import type { Lesson } from '../types'
import { CORE_LESSONS } from './lessons-core'
import { SIDE_LESSONS } from './lessons-side'
import { MINI_LESSONS } from './lessons-mini'
import { GAMES_LESSONS } from './lessons-games'
import { MEDIA_LESSONS } from './lessons-media'
import { TOOLS_LESSONS } from './lessons-tools'
import { LAUNCH_LESSONS } from './lessons-launch'
import { SOLO_LESSONS } from './lessons-solo'
import { TREE } from './tree'

export const ALL_LESSONS: Lesson[] = [
  ...CORE_LESSONS,
  ...SIDE_LESSONS,
  ...MINI_LESSONS,
  ...GAMES_LESSONS,
  ...MEDIA_LESSONS,
  ...TOOLS_LESSONS,
  ...LAUNCH_LESSONS,
  ...SOLO_LESSONS,
]

const byId = new Map(ALL_LESSONS.map((l) => [l.id, l]))

export const getLesson = (id: string): Lesson | undefined => byId.get(id)

/** Lessons in tree order (top to bottom, left to right). */
export const LESSONS_IN_ORDER: Lesson[] = [...TREE]
  .sort((a, b) => a.row - b.row || a.col - b.col)
  .map((n) => byId.get(n.lessonId))
  .filter((l): l is Lesson => !!l)

export const TRACK_INFO: Record<Lesson['track'], { label: string; color: string }> = {
  core: { label: 'Core Skills', color: 'var(--core)' },
  side: { label: 'Side Quest', color: 'var(--side)' },
  mini: { label: 'First Product', color: 'var(--mini)' },
  games: { label: 'Game Studio', color: 'var(--games)' },
  media: { label: 'Media House', color: 'var(--media)' },
  tools: { label: 'Tool Works', color: 'var(--tools)' },
  launch: { label: 'Launch', color: 'var(--launch)' },
}
