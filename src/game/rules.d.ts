import type { GameEvent, GameOutcome, Manifest, Player } from './types'

export function newPlayer(uid: string): Player
export function levelOf(xp: number, m: Manifest): { n: number; title: string; min: number; next: number | null }
export function spendable(p: Player): number
export function hasBadge(p: Player, id: string): boolean
export function stats(p: Player): { steps: number; lessons: number; perfect: number; first: number; bonus: number; shipped: number; team: number }
export function applyEvent(p: Player, ev: GameEvent, m: Manifest, ctx: { now: number; passPercent?: number; team?: boolean; trusted?: boolean }): GameOutcome
export function unlocked(p: Player, key: string, m: Manifest): boolean
export function howToGet(key: string, m: Manifest): string
export function buy(p: Player, item: string, m: Manifest, now: number): { price: number; label: string }
export function defaultAvatar(m: Manifest): Record<string, string>
export function setAvatar(p: Player, avatar: Record<string, string>, m: Manifest): void
