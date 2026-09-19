export type Point = {
  x: number
  y: number
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export type GameMode = 
  | 'classic'
  | 'no-walls'
  | 'maze-boxes'
  | 'maze-gates'
  | 'maze-pinwheel'

export type PaletteId = 
  | 'classic-green'
  | 'monochrome'
  | 'cyber-amber'
  | 'ice-blue'

export type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'

export interface BonusBug {
  position: Point
  spawnTime: number
  durationMs: number
  remainingMs: number
  maxPoints: number
  currentPoints: number
}

export interface PaletteConfig {
  id: PaletteId
  name: string
  subtitle: string
  screenBg: string
  pixelOff: string
  pixelOn: string
  eyeColor: string
  foodColor: string
  bugColor: string
  obstacleColor: string
  playableBorderColor: string // Color of the border framing the 28x18 playable game grid
  glow?: string
  chassisBg: string
  bezelBorder: string
  accentColor: string
}

export interface SpeedConfig {
  level: number
  intervalMs: number
  label: string
}
