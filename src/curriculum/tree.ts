import type { Branch, TreeNode } from '../types'

/**
 * The progression tree. Rows go top → bottom. Column 3 is the trunk.
 *
 *            core-hello
 *            core-events ── side-design (optional)
 *            core-variables
 *            core-conditionals ── side-debug (optional)
 *       ┌──────────┼──────────┐          ← Branch 1: first mini project
 *   mini-quiz  mini-sound  mini-convert
 *       └──────────┼──────────┘
 *            core-loops
 *            core-lists
 *            core-procedures
 *       ┌──────────┼──────────┐          ← Branch 2: choose your studio
 *    games-1    media-1    tools-1
 *    games-2    media-2    tools-2
 *    games-3    media-3    tools-3
 *    games-cap  media-cap  tools-cap
 *       └──────────┼──────────┘
 *              launch-day
 */
export const TREE: TreeNode[] = [
  { lessonId: 'core-hello', col: 3, row: 0, prereqs: [], prereqMode: 'all' },
  { lessonId: 'core-events', col: 3, row: 1, prereqs: ['core-hello'], prereqMode: 'all' },
  { lessonId: 'side-design', col: 5, row: 1.5, prereqs: ['core-events'], prereqMode: 'all', optional: true },
  { lessonId: 'core-variables', col: 3, row: 2, prereqs: ['core-events'], prereqMode: 'all' },
  { lessonId: 'core-conditionals', col: 3, row: 3, prereqs: ['core-variables'], prereqMode: 'all' },
  { lessonId: 'side-debug', col: 1, row: 3.5, prereqs: ['core-conditionals'], prereqMode: 'all', optional: true },

  { lessonId: 'mini-quiz', col: 1, row: 4.6, prereqs: ['core-conditionals'], prereqMode: 'all', branchId: 'mini' },
  { lessonId: 'mini-sound', col: 3, row: 4.6, prereqs: ['core-conditionals'], prereqMode: 'all', branchId: 'mini' },
  { lessonId: 'mini-convert', col: 5, row: 4.6, prereqs: ['core-conditionals'], prereqMode: 'all', branchId: 'mini' },

  { lessonId: 'core-loops', col: 3, row: 6, prereqs: ['mini-quiz', 'mini-sound', 'mini-convert'], prereqMode: 'any' },
  { lessonId: 'core-lists', col: 3, row: 7, prereqs: ['core-loops'], prereqMode: 'all' },
  { lessonId: 'core-procedures', col: 3, row: 8, prereqs: ['core-lists'], prereqMode: 'all' },

  { lessonId: 'games-sprites', col: 1, row: 9.6, prereqs: ['core-procedures'], prereqMode: 'all', branchId: 'path' },
  { lessonId: 'games-motion', col: 1, row: 10.6, prereqs: ['games-sprites'], prereqMode: 'all' },
  { lessonId: 'games-state', col: 1, row: 11.6, prereqs: ['games-motion'], prereqMode: 'all' },
  { lessonId: 'games-capstone', col: 1, row: 12.6, prereqs: ['games-state'], prereqMode: 'all' },

  { lessonId: 'media-camera', col: 3, row: 9.6, prereqs: ['core-procedures'], prereqMode: 'all', branchId: 'path' },
  { lessonId: 'media-paint', col: 3, row: 10.6, prereqs: ['media-camera'], prereqMode: 'all' },
  { lessonId: 'media-sound', col: 3, row: 11.6, prereqs: ['media-paint'], prereqMode: 'all' },
  { lessonId: 'media-capstone', col: 3, row: 12.6, prereqs: ['media-sound'], prereqMode: 'all' },

  { lessonId: 'tools-forms', col: 5, row: 9.6, prereqs: ['core-procedures'], prereqMode: 'all', branchId: 'path' },
  { lessonId: 'tools-tinydb', col: 5, row: 10.6, prereqs: ['tools-forms'], prereqMode: 'all' },
  { lessonId: 'tools-sensors', col: 5, row: 11.6, prereqs: ['tools-tinydb'], prereqMode: 'all' },
  { lessonId: 'tools-capstone', col: 5, row: 12.6, prereqs: ['tools-sensors'], prereqMode: 'all' },

  { lessonId: 'launch-day', col: 3, row: 14, prereqs: ['games-capstone', 'media-capstone', 'tools-capstone'], prereqMode: 'any' },
]

export const BRANCHES: Record<string, Branch> = {
  mini: {
    id: 'mini',
    label: 'Your first product',
    description:
      'Your company ships its first small product. Pick ONE: a game, a media app, or a tool. All three practice variables and conditionals, so choose the one your team is most excited about.',
  },
  path: {
    id: 'path',
    label: 'Choose your studio',
    description:
      'Time to specialize! Your company becomes a Game Studio, a Media House, or a Tool Works. Each path has three skill lessons and a capstone app that your company designs from scratch.',
  },
}

export const PATH_NAMES: Record<string, { name: string; color: string }> = {
  'games-sprites': { name: 'Game Studio', color: 'var(--games)' },
  'media-camera': { name: 'Media House', color: 'var(--media)' },
  'tools-forms': { name: 'Tool Works', color: 'var(--tools)' },
}

export const nodeById = (id: string) => TREE.find((n) => n.lessonId === id)
