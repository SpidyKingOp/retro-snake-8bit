import React, { useEffect, useRef, useState } from 'react'
import type { BonusBug, Direction, GameMode, GameState, PaletteConfig, Point } from '../types/game'
import { GRID_HEIGHT, GRID_WIDTH, getMazeObstacles } from '../constants/mazes'

interface LcdScreenProps {
  snake: Point[]
  direction: Direction
  food: Point
  bonusBug: BonusBug | null
  gameMode: GameMode
  gameState: GameState
  palette: PaletteConfig
  score: number
  highScore: number
  isNewHighScore: boolean
  speedLevel: number
  onStartOrRestart: () => void
  onDirection?: (direction: Direction) => void
}

export const LcdScreen: React.FC<LcdScreenProps> = ({
  snake,
  direction,
  food,
  bonusBug,
  gameMode,
  gameState,
  palette,
  score,
  highScore,
  isNewHighScore,
  speedLevel,
  onStartOrRestart,
  onDirection,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [, setAnimTick] = useState<number>(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const dx = endX - touchStartRef.current.x
    const dy = endY - touchStartRef.current.y
    touchStartRef.current = null

    const minSwipe = 24
    if (Math.abs(dx) > minSwipe || Math.abs(dy) > minSwipe) {
      if (Math.abs(dx) > Math.abs(dy)) {
        onDirection?.(dx > 0 ? 'RIGHT' : 'LEFT')
      } else {
        onDirection?.(dy > 0 ? 'DOWN' : 'UP')
      }
    } else {
      if (gameState === 'IDLE' || gameState === 'GAME_OVER') {
        onStartOrRestart()
      }
    }
  }

  // Periodic redraw trigger for blinking prompts & animated bug legs
  useEffect(() => {
    if (gameState === 'IDLE' || gameState === 'GAME_OVER' || (gameState === 'PLAYING' && bonusBug !== null)) {
      const interval = setInterval(() => {
        setAnimTick(t => (t + 1) % 10000)
      }, 180)
      return () => clearInterval(interval)
    }
  }, [gameState, bonusBug !== null])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Base logical dimensions for 28x18 grid
    const dotSize = 24
    const gap = 3
    const cellSpan = dotSize + gap
    const padding = 14

    const logicalWidth = padding * 2 + GRID_WIDTH * cellSpan - gap
    const logicalHeight = padding * 2 + GRID_HEIGHT * cellSpan - gap

    // Support Retina/HiDPI displays
    const dpr = window.devicePixelRatio || 1
    canvas.width = logicalWidth * dpr
    canvas.height = logicalHeight * dpr
    ctx.resetTransform?.()
    ctx.scale(dpr, dpr)

    // 1. Draw LCD Background
    ctx.fillStyle = palette.screenBg
    ctx.fillRect(0, 0, logicalWidth, logicalHeight)

    // Helper to draw a sharp square dot matrix pixel (authentic 8-bit)
    const drawDot = (
      gx: number,
      gy: number,
      fillColor: string,
      alpha = 1
    ) => {
      const px = padding + gx * cellSpan
      const py = padding + gy * cellSpan

      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = fillColor
      ctx.fillRect(px, py, dotSize, dotSize)
      ctx.restore()
    }

    // 2. Render Inactive Ghost Pixel Grid (authentic passive-matrix LCD look)
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_HEIGHT; y++) {
        drawDot(x, y, palette.pixelOff)
      }
    }

    // 2.5. Render Playable Game Area Perimeter Border
    const gridX = padding - 4
    const gridY = padding - 4
    const gridW = GRID_WIDTH * cellSpan - gap + 8
    const gridH = GRID_HEIGHT * cellSpan - gap + 8

    ctx.save()
    ctx.strokeStyle = palette.playableBorderColor
    ctx.lineWidth = 3
    if (gameMode === 'no-walls') {
      // In Pass-Through mode, draw a dashed boundary line indicating warp portals
      ctx.setLineDash([6, 6])
      ctx.globalAlpha = 0.5
      ctx.strokeRect(gridX, gridY, gridW, gridH)
    } else {
      // In Classic and Maze modes, draw a solid crisp lethal wall border
      ctx.strokeRect(gridX, gridY, gridW, gridH)
    }
    ctx.restore()

    // 3. Render Maze Obstacles (sharp industrial bricks)
    const obstacles = getMazeObstacles(gameMode)
    obstacles.forEach(ob => {
      const px = padding + ob.x * cellSpan
      const py = padding + ob.y * cellSpan

      ctx.save()
      ctx.fillStyle = palette.obstacleColor
      ctx.fillRect(px, py, dotSize, dotSize)

      // Authentic retro crosshatch / concentric border for obstacle bricks
      ctx.fillStyle = palette.screenBg
      ctx.fillRect(px + 3, py + 3, dotSize - 6, dotSize - 6)
      ctx.fillStyle = palette.obstacleColor
      ctx.fillRect(px + 6, py + 6, dotSize - 12, dotSize - 12)
      ctx.restore()
    })

    // 4. Render Bonus Bug (if active)
    if (bonusBug) {
      const { x, y } = bonusBug.position
      const px = padding + x * cellSpan
      const py = padding + y * cellSpan
      const animPhase = Math.floor(Date.now() / 150) % 2

      ctx.save()
      ctx.fillStyle = palette.bugColor

      // Bug Body (sharp block core)
      ctx.fillRect(px + 4, py + 4, dotSize - 8, dotSize - 8)

      // Bug Antennae / Eyes
      ctx.fillRect(px + 6, py + 1, 3, 3)
      ctx.fillRect(px + dotSize - 9, py + 1, 3, 3)

      // Bug Fluttering Legs (animated alternating tick)
      if (animPhase === 0) {
        ctx.fillRect(px + 1, py + 6, 3, 3)
        ctx.fillRect(px + dotSize - 4, py + 6, 3, 3)
        ctx.fillRect(px + 1, py + dotSize - 8, 3, 3)
        ctx.fillRect(px + dotSize - 4, py + dotSize - 8, 3, 3)
      } else {
        ctx.fillRect(px + 2, py + 4, 3, 3)
        ctx.fillRect(px + dotSize - 5, py + 4, 3, 3)
        ctx.fillRect(px + 2, py + dotSize - 6, 3, 3)
        ctx.fillRect(px + dotSize - 5, py + dotSize - 6, 3, 3)
      }

      // Bug inner detail
      ctx.fillStyle = palette.screenBg
      ctx.fillRect(px + 8, py + 9, dotSize - 16, 5)
      ctx.restore()
    }

    // 5. Render Regular Food (pixel apple with sharp retro pixels)
    if (food) {
      const px = padding + food.x * cellSpan
      const py = padding + food.y * cellSpan

      ctx.save()
      ctx.fillStyle = palette.foodColor
      // Apple block body
      ctx.fillRect(px + 3, py + 5, dotSize - 6, dotSize - 7)

      // Apple stem
      ctx.fillRect(px + Math.floor(dotSize / 2) - 1, py + 2, 3, 4)

      // Apple pixel leaf
      ctx.fillRect(px + Math.floor(dotSize / 2) + 2, py + 2, 3, 2)

      // Cutout highlight
      ctx.fillStyle = palette.screenBg
      ctx.fillRect(px + 5, py + 7, 3, 3)
      ctx.restore()
    }

    // 6. Render Snake (sharp corners, segment articulation, directional eyes or X_X dead eyes)
    snake.forEach((segment, index) => {
      const isHead = index === 0
      const px = padding + segment.x * cellSpan
      const py = padding + segment.y * cellSpan

      ctx.save()
      ctx.fillStyle = palette.pixelOn

      if (isHead) {
        // Sharp Head Block
        ctx.fillRect(px, py, dotSize, dotSize)

        // Eyes: if dead (GAME_OVER), render retro 'X' 'X' eyes!
        ctx.fillStyle = palette.eyeColor
        if (gameState === 'GAME_OVER') {
          const drawX = (ex: number, ey: number) => {
            ctx.fillRect(ex, ey, 2, 2)
            ctx.fillRect(ex + 4, ey, 2, 2)
            ctx.fillRect(ex + 2, ey + 2, 2, 2)
            ctx.fillRect(ex, ey + 4, 2, 2)
            ctx.fillRect(ex + 4, ey + 4, 2, 2)
          }
          if (direction === 'RIGHT' || direction === 'LEFT') {
            drawX(px + 4, py + 3)
            drawX(px + 4, py + dotSize - 9)
          } else {
            drawX(px + 3, py + 4)
            drawX(px + dotSize - 9, py + 4)
          }
        } else {
          // Normal direction-facing eyes
          if (direction === 'RIGHT') {
            ctx.fillRect(px + dotSize - 7, py + 4, 3, 3)
            ctx.fillRect(px + dotSize - 7, py + dotSize - 7, 3, 3)
          } else if (direction === 'LEFT') {
            ctx.fillRect(px + 4, py + 4, 3, 3)
            ctx.fillRect(px + 4, py + dotSize - 7, 3, 3)
          } else if (direction === 'UP') {
            ctx.fillRect(px + 4, py + 4, 3, 3)
            ctx.fillRect(px + dotSize - 7, py + 4, 3, 3)
          } else if (direction === 'DOWN') {
            ctx.fillRect(px + 4, py + dotSize - 7, 3, 3)
            ctx.fillRect(px + dotSize - 7, py + dotSize - 7, 3, 3)
          }
        }
      } else {
        // Snake Body Segment: Sharp 1px inset block with inner pixel accent
        ctx.fillRect(px + 1, py + 1, dotSize - 2, dotSize - 2)

        // Inner retro dot texture
        ctx.fillStyle = palette.screenBg
        ctx.fillRect(px + 7, py + 7, dotSize - 14, dotSize - 14)
      }
      ctx.restore()
    })

    // 7. Authentic Retro LCD Overlays (with sharp double-border dialogs)
    const drawRetroDialog = (
      boxW: number,
      boxH: number,
      title: string,
      titleBgInverted: boolean
    ) => {
      const bx = (logicalWidth - boxW) / 2
      const by = (logicalHeight - boxH) / 2

      // Solid background box matching LCD base
      ctx.fillStyle = palette.screenBg
      ctx.fillRect(bx, by, boxW, boxH)

      // Outer heavy border
      ctx.strokeStyle = palette.pixelOn
      ctx.lineWidth = 4
      ctx.strokeRect(bx, by, boxW, boxH)

      // Inner thin border (double-box aesthetic)
      ctx.lineWidth = 1.5
      ctx.strokeRect(bx + 5, by + 5, boxW - 10, boxH - 10)

      // Header Banner Box
      if (titleBgInverted) {
        ctx.fillStyle = palette.pixelOn
        ctx.fillRect(bx + 8, by + 8, boxW - 16, 36)
        ctx.fillStyle = palette.screenBg
        ctx.font = 'bold 15px "Press Start 2P", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(title, logicalWidth / 2, by + 26)
      } else {
        ctx.fillStyle = palette.pixelOn
        ctx.font = 'bold 16px "Press Start 2P", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(title, logicalWidth / 2, by + 28)
      }

      return { bx, by }
    }

    if (gameState === 'IDLE') {
      ctx.save()
      const { by } = drawRetroDialog(460, 240, 'RETRO SNAKE 8-BIT', true)

      ctx.fillStyle = palette.pixelOn
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.font = '11px "Press Start 2P", monospace'
      ctx.fillText(`MODE: ${gameMode.toUpperCase()}`, logicalWidth / 2, by + 75)
      ctx.fillText(`SPEED: LEVEL ${speedLevel}`, logicalWidth / 2, by + 102)

      // Divider line
      ctx.fillRect(logicalWidth / 2 - 160, by + 125, 320, 2)

      // Blinking prompt
      const blink = Math.floor(Date.now() / 450) % 2 === 0
      if (blink) {
        ctx.font = 'bold 12px "Press Start 2P", monospace'
        ctx.fillText('▶ PRESS SPACE TO START ◀', logicalWidth / 2, by + 160)
      }

      ctx.font = '18px "VT323", monospace'
      ctx.fillText('OR TAP ANY D-PAD BUTTON TO PLAY', logicalWidth / 2, by + 195)
      ctx.restore()
    } else if (gameState === 'PAUSED') {
      ctx.save()
      const { by } = drawRetroDialog(380, 180, 'GAME PAUSED', true)

      ctx.fillStyle = palette.pixelOn
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.font = '12px "Press Start 2P", monospace'
      ctx.fillText(`CURRENT SCORE: ${String(score).padStart(5, '0')}`, logicalWidth / 2, by + 80)

      const blink = Math.floor(Date.now() / 450) % 2 === 0
      if (blink) {
        ctx.font = 'bold 11px "Press Start 2P", monospace'
        ctx.fillText('▶ PRESS SPACE TO RESUME ◀', logicalWidth / 2, by + 130)
      }
      ctx.restore()
    } else if (gameState === 'GAME_OVER') {
      ctx.save()
      const { by } = drawRetroDialog(480, 275, '*** GAME OVER ***', true)

      ctx.fillStyle = palette.pixelOn
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'

      const leftColX = logicalWidth / 2 - 180
      const rightColX = logicalWidth / 2 + 180

      // Stats Table with retro dotted leaders
      ctx.font = '11px "Press Start 2P", monospace'

      // Final Score
      ctx.textAlign = 'left'
      ctx.fillText('FINAL SCORE', leftColX, by + 75)
      ctx.textAlign = 'right'
      ctx.fillText(String(score).padStart(5, '0'), rightColX, by + 75)

      // High Score / Record
      ctx.textAlign = 'left'
      ctx.fillText('HIGH RECORD', leftColX, by + 105)
      ctx.textAlign = 'right'
      ctx.fillText(String(highScore).padStart(5, '0'), rightColX, by + 105)

      // Snake Length
      ctx.textAlign = 'left'
      ctx.fillText('SNAKE LENGTH', leftColX, by + 135)
      ctx.textAlign = 'right'
      ctx.fillText(`${snake.length} SEG`, rightColX, by + 135)

      // New Record Badge or Speed Level
      if (isNewHighScore) {
        ctx.textAlign = 'center'
        ctx.fillStyle = palette.bugColor || palette.pixelOn
        ctx.font = 'bold 12px "Press Start 2P", monospace'
        ctx.fillText('★ ★ NEW HIGH RECORD! ★ ★', logicalWidth / 2, by + 172)
      } else {
        ctx.textAlign = 'left'
        ctx.fillText('DIFFICULTY', leftColX, by + 165)
        ctx.textAlign = 'right'
        ctx.fillText(`LVL ${speedLevel}`, rightColX, by + 165)
      }

      // Divider line
      ctx.fillStyle = palette.pixelOn
      ctx.fillRect(logicalWidth / 2 - 190, by + 195, 380, 2)

      // Blinking Action Prompt
      const blink = Math.floor(Date.now() / 450) % 2 === 0
      ctx.textAlign = 'center'
      if (blink) {
        ctx.font = 'bold 12px "Press Start 2P", monospace'
        ctx.fillText('▶ PRESS RESTART / SPACE ◀', logicalWidth / 2, by + 230)
      }
      ctx.restore()
    }
  }, [
    snake,
    direction,
    food,
    bonusBug,
    gameMode,
    gameState,
    palette,
    score,
    highScore,
    isNewHighScore,
    speedLevel,
  ])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[28/18] max-w-[840px] mx-auto overflow-hidden select-none border-4 transition-all duration-300 cursor-pointer"
      style={{
        borderColor: palette.bezelBorder,
        backgroundColor: palette.screenBg,
        boxShadow: palette.glow 
          ? `0 0 25px ${palette.pixelOn}33` 
          : '0 8px 24px rgba(0,0,0,0.8)',
      }}
      onClick={() => {
        if (gameState === 'IDLE' || gameState === 'GAME_OVER') {
          onStartOrRestart()
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block image-rendering-pixelated"
        style={{
          imageRendering: 'pixelated',
        }}
      />

      {/* Retro Scanlines Layer */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Subtle Screen Glare */}
      <div className="absolute inset-0 lcd-glare pointer-events-none" />
    </div>
  )
}
