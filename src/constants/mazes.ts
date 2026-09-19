import type { GameMode, Point } from '../types/game'

export const GRID_WIDTH = 28
export const GRID_HEIGHT = 18

export interface MazeInfo {
  mode: GameMode
  name: string
  description: string
}

export const GAME_MODES: MazeInfo[] = [
  { mode: 'classic', name: 'Classic Walls', description: 'Solid outer borders. Don’t hit borders or yourself.' },
  { mode: 'no-walls', name: 'Pass-Through', description: 'Screen borders wrap around seamlessly to the opposite side.' },
  { mode: 'maze-boxes', name: 'Corner Boxes', description: 'Obstacle bunkers in all 4 corners and center block.' },
  { mode: 'maze-gates', name: 'Gate Tunnels', description: 'Divider walls with precision squeeze gates.' },
  { mode: 'maze-pinwheel', name: 'Pinwheel', description: 'Challenging pinwheel barriers requiring tactical turns.' },
]

export function getMazeObstacles(mode: GameMode): Point[] {
  const points: Point[] = []

  if (mode === 'maze-boxes') {
    // Top-left box
    for (let x = 3; x <= 6; x++) points.push({ x, y: 2 })
    for (let y = 3; y <= 5; y++) points.push({ x: 3, y })

    // Top-right box
    for (let x = 21; x <= 24; x++) points.push({ x, y: 2 })
    for (let y = 3; y <= 5; y++) points.push({ x: 24, y })

    // Bottom-left box
    for (let x = 3; x <= 6; x++) points.push({ x, y: 15 })
    for (let y = 12; y <= 14; y++) points.push({ x: 3, y })

    // Bottom-right box
    for (let x = 21; x <= 24; x++) points.push({ x, y: 15 })
    for (let y = 12; y <= 14; y++) points.push({ x: 24, y })

    // Center block
    points.push({ x: 13, y: 8 }, { x: 14, y: 8 }, { x: 13, y: 9 }, { x: 14, y: 9 })
  } else if (mode === 'maze-gates') {
    // Left vertical divider with center passage
    for (let y = 2; y <= 6; y++) points.push({ x: 8, y })
    for (let y = 11; y <= 15; y++) points.push({ x: 8, y })

    // Right vertical divider with center passage
    for (let y = 2; y <= 6; y++) points.push({ x: 19, y })
    for (let y = 11; y <= 15; y++) points.push({ x: 19, y })

    // Center horizontal beam
    for (let x = 12; x <= 15; x++) {
      points.push({ x, y: 4 })
      points.push({ x, y: 13 })
    }
  } else if (mode === 'maze-pinwheel') {
    // Top arm hook
    for (let y = 2; y <= 6; y++) points.push({ x: 14, y })
    for (let x = 15; x <= 19; x++) points.push({ x, y: 2 })

    // Right arm hook
    for (let x = 19; x <= 24; x++) points.push({ x, y: 11 })
    for (let y = 12; y <= 15; y++) points.push({ x: 24, y })

    // Bottom arm hook
    for (let y = 11; y <= 15; y++) points.push({ x: 13, y })
    for (let x = 8; x <= 12; x++) points.push({ x, y: 15 })

    // Left arm hook
    for (let x = 3; x <= 8; x++) points.push({ x, y: 5 })
    for (let y = 2; y <= 4; y++) points.push({ x: 3, y })
  }

  return points
}

export function isObstacle(x: number, y: number, obstacles: Point[]): boolean {
  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].x === x && obstacles[i].y === y) return true
  }
  return false
}
