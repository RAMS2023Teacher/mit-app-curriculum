import { backend } from '../data'
import { useWatch } from '../data/hooks'
import type { Player, PlayerCard } from './types'

/** The signed-in student's own game record (undefined while loading or when the game isn't available). */
export const usePlayer = (classId?: string) =>
  useWatch<Player>(classId && backend.game ? (cb) => backend.game!.watchPlayer(classId, cb) : null, [classId])

export const usePlayers = (classId?: string) =>
  useWatch<PlayerCard[]>(classId && backend.game ? (cb) => backend.game!.watchPlayers(classId, cb) : null, [classId])
