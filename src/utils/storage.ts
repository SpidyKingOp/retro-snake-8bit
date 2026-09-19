import type { GameMode } from '../types/game'

const STORAGE_PREFIX = 'retro_snake_highscore_'

export function getHighScore(mode: GameMode): number {
  if (typeof window === 'undefined') return 0
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${mode}`)
    return saved ? parseInt(saved, 10) || 0 : 0
  } catch {
    return 0
  }
}

export function saveHighScore(mode: GameMode, score: number): boolean {
  if (typeof window === 'undefined') return false
  try {
    const currentHigh = getHighScore(mode)
    if (score > currentHigh) {
      localStorage.setItem(`${STORAGE_PREFIX}${mode}`, String(score))
      return true
    }
  } catch {}
  return false
}

export function getAllHighScores(): Record<GameMode, number> {
  const modes: GameMode[] = ['classic', 'no-walls', 'maze-boxes', 'maze-gates', 'maze-pinwheel']
  const result = {} as Record<GameMode, number>
  modes.forEach(m => {
    result[m] = getHighScore(m)
  })
  return result
}
