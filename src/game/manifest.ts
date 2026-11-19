import { ALL_LESSONS } from '../curriculum'
import { BADGES, LEVELS, PARTS, POWERUPS, SLOTS, XP } from './catalog'
import type { Manifest } from './types'

/**
 * Everything the rules need to know, as plain data. The page builds it from the source;
 * the server loads the same thing from apps-script/manifest.json (made by `npm run sync:server`).
 */
export function buildManifest(): Manifest {
  const slotDefaults: Record<string, string> = {}
  for (const slot of SLOTS) slotDefaults[slot] = PARTS.find((p) => p.slot === slot && p.rule.type === 'none')!.id
  return {
    v: 1,
    lessons: Object.fromEntries(
      ALL_LESSONS.map((l) => [l.id, { title: l.title, steps: l.steps.length + (l.remix ? 1 : 0), quiz: l.quiz.map((q) => q.answer), individual: !!l.individual }]),
    ),
    xp: XP,
    levels: LEVELS,
    badges: BADGES,
    slots: [...SLOTS],
    slotDefaults,
    parts: Object.fromEntries(PARTS.map((p) => [`${p.slot}:${p.id}`, p])),
    powerups: POWERUPS,
  }
}

export const MANIFEST: Manifest = buildManifest()
