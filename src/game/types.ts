export type UnlockRule = { type: 'none' } | { type: 'level'; n: number } | { type: 'badge'; id: string } | { type: 'cost'; n: number }

export type BadgeRule =
  | { type: 'steps' | 'lessons' | 'perfect' | 'first' | 'bonus' | 'shipped'; n: number }
  | { type: 'team' | 'avatar' }
  | { type: 'lesson'; id: string }
  | { type: 'anyLesson' | 'allLessons'; ids: string[] }
  | { type: 'gift'; id: string }

export interface BadgeDef {
  id: string
  icon: string
  name: string
  desc: string
  rule: BadgeRule
}

export interface PartDef {
  slot: string
  id: string
  name: string
  rule: UnlockRule
}

export interface Manifest {
  v: number
  lessons: Record<string, { title: string; steps: number; quiz: number[]; individual: boolean }>
  xp: { start: number; step: number; quiz: number; perfect: number; first: number; bonus: number; ship: number; done: number; badge: number }
  levels: { min: number; title: string }[]
  badges: BadgeDef[]
  slots: string[]
  slotDefaults: Record<string, string>
  parts: Record<string, PartDef>
  powerups: Record<string, { name: string; icon: string; desc: string; prices: number[] }>
}

export interface Player {
  uid: string
  /** All XP ever earned. Levels use this, so they never go down. */
  xp: number
  /** XP spent in the shop. XP to spend = xp − spent. */
  spent: number
  /** award key → XP paid. Each key can only be paid once. */
  awards: Record<string, number>
  log: { at: number; key: string; xp: number; label: string }[]
  quizFirst: Record<string, { score: number; total: number; at: number }>
  owned: Record<string, number>
  powerups: Record<string, number>
  shopLog: { at: number; item: string; price: number; label: string }[]
  avatar: Record<string, string>
  avatarSet: boolean
}

export type GameEvent =
  | { t: 'start'; lesson: string }
  | { t: 'step'; lesson: string; i: number }
  | { t: 'quiz'; lesson: string; answers: number[] }
  | { t: 'ship'; lesson: string; bonus?: boolean }
  | { t: 'gift'; badge: string }

export interface GameOutcome {
  gained: { key: string; xp: number; label: string }[]
  badges: string[]
  now: number
  quiz: { score: number; total: number; passed: boolean } | null
  level: number
  levelUp: boolean
}

/** What the server sends back after something that can earn XP. */
export interface GameResult extends Omit<GameOutcome, 'now'> {
  player: Player
}

/** A classmate's public game info (no email, no award details). */
export interface PlayerCard {
  uid: string
  xp: number
  avatar: Record<string, string>
}
