import type { SpeedConfig } from '../types/game'

export const SPEED_CONFIGS: SpeedConfig[] = [
  { level: 1, intervalMs: 220, label: 'Easy' },
  { level: 2, intervalMs: 190, label: 'Gentle' },
  { level: 3, intervalMs: 165, label: 'Normal' },
  { level: 4, intervalMs: 140, label: 'Brisk' },
  { level: 5, intervalMs: 120, label: 'Fast' },
  { level: 6, intervalMs: 100, label: 'Rapid' },
  { level: 7, intervalMs: 85, label: 'Hyper' },
  { level: 8, intervalMs: 70, label: 'Extreme' },
  { level: 9, intervalMs: 55, label: 'Turbo' },
]

export const DEFAULT_SPEED_LEVEL = 4

export function getSpeedConfig(level: number): SpeedConfig {
  const clamped = Math.max(1, Math.min(9, level))
  return SPEED_CONFIGS[clamped - 1]
}
