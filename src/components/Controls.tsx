import React, { useState, useEffect } from 'react'
import type { Direction, GameState, PaletteConfig } from '../types/game'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

interface ControlsProps {
  onDirection: (direction: Direction) => void
  onTogglePause: () => void
  onRestart: () => void
  onToggleMute: () => void
  onToggleFullscreen?: () => void
  isMuted: boolean
  isFullscreen?: boolean
  gameState: GameState
  palette: PaletteConfig
}

export const Controls: React.FC<ControlsProps> = ({
  onDirection,
  onTogglePause,
  onRestart,
  onToggleMute,
  onToggleFullscreen,
  isMuted,
  isFullscreen,
  gameState,
}) => {
  const [pressedKey, setPressedKey] = useState<Direction | 'CENTER' | null>(null)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setPressedKey('UP')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          setPressedKey('DOWN')
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setPressedKey('LEFT')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPressedKey('RIGHT')
          break
        case ' ':
        case 'p':
        case 'P':
          setPressedKey('CENTER')
          break
        case 'f':
        case 'F':
          onToggleFullscreen?.()
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W', 'ArrowDown', 's', 'S', 'ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D', ' ', 'p', 'P'].includes(e.key)) {
        setPressedKey(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [onDirection, onTogglePause, onRestart, onToggleMute, onToggleFullscreen, gameState])

  const handlePadPress = (dir: Direction) => {
    setPressedKey(dir)
    onDirection(dir)
  }

  const handlePadRelease = () => {
    setPressedKey(null)
  }

  return (
    <div className="w-full max-w-[840px] mx-auto mt-4 px-1 select-none">
      <div className="bg-neutral-900 border-4 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Action Buttons with Matching Retro Stone Bevel Aesthetic */}
          <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-48 order-2 md:order-1">
            {/* Play / Pause */}
            <button
              onClick={onTogglePause}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#787c82] hover:bg-[#868a90] text-black font-retro text-[10px] sm:text-[11px] font-bold border-3 border-black border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-transform cursor-pointer"
              title="Spacebar / P"
            >
              {gameState === 'PLAYING' ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-black fill-black shrink-0" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-black fill-black shrink-0" />
                  <span>{gameState === 'PAUSED' ? 'RESUME' : 'START'}</span>
                </>
              )}
            </button>

            {/* Restart */}
            <button
              onClick={onRestart}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#787c82] hover:bg-[#868a90] text-black font-retro text-[10px] sm:text-[11px] font-bold border-3 border-black border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-transform cursor-pointer"
              title="Enter key"
            >
              <RotateCcw className="w-3.5 h-3.5 text-black shrink-0 stroke-[2.5]" />
              <span>RESTART</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleMute}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 font-retro text-[10px] sm:text-[11px] font-bold border-3 border-black shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-transform cursor-pointer ${
                isMuted
                  ? 'bg-[#5a5c62] text-neutral-400 border-t-[#74767c] border-l-[#74767c] border-b-[#323438] border-r-[#323438]'
                  : 'bg-[#787c82] hover:bg-[#868a90] text-black border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50]'
              }`}
              title="M key"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-black shrink-0 stroke-[2.5]" />
                  <span>MUTED</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-black shrink-0 stroke-[2.5]" />
                  <span>AUDIO</span>
                </>
              )}
            </button>

            {/* Fullscreen Toggle */}
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#787c82] hover:bg-[#868a90] text-black font-retro text-[10px] sm:text-[11px] font-bold border-3 border-black border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-transform cursor-pointer"
                title="Fullscreen Mode (F)"
              >
                {isFullscreen ? (
                  <>
                    <Minimize className="w-3.5 h-3.5 text-black shrink-0 stroke-[2.5]" />
                    <span>WINDOW</span>
                  </>
                ) : (
                  <>
                    <Maximize className="w-3.5 h-3.5 text-black shrink-0 stroke-[2.5]" />
                    <span>FULLSCREEN</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* 5-Square Retro Cross D-Pad (Freestanding cross without enclosing square border) */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2">
            <div className="grid grid-cols-3 gap-1 p-1">
              {/* Row 1, Col 1: Empty */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-17 md:h-17 pointer-events-none" />

              {/* Row 1, Col 2: UP Square Button */}
              <button
                onPointerDown={() => handlePadPress('UP')}
                onPointerUp={handlePadRelease}
                onPointerLeave={handlePadRelease}
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-17 md:h-17 flex items-center justify-center border-3 border-black transition-all cursor-pointer ${
                  pressedKey === 'UP'
                    ? 'bg-[#5e6166] border-t-[#383a3e] border-l-[#383a3e] border-b-[#8c9096] border-r-[#8c9096] translate-x-[2px] translate-y-[2px] shadow-none'
                    : 'bg-[#787c82] hover:bg-[#85898f] border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000]'
                }`}
                aria-label="Up"
              >
                {/* 8-Bit Pixelated Up Arrow */}
                <svg viewBox="0 0 16 16" className="w-7 h-7 sm:w-8 sm:h-8 fill-black" shapeRendering="crispEdges">
                  <rect x="7" y="3" width="2" height="2" />
                  <rect x="6" y="5" width="4" height="2" />
                  <rect x="5" y="7" width="6" height="2" />
                  <rect x="4" y="9" width="8" height="2" />
                  <rect x="3" y="11" width="10" height="2" />
                </svg>
              </button>

              {/* Row 1, Col 3: Empty */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-17 md:h-17" />

              {/* Row 2, Col 1: LEFT Square Button */}
              <button
                onPointerDown={() => handlePadPress('LEFT')}
                onPointerUp={handlePadRelease}
                onPointerLeave={handlePadRelease}
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-17 md:h-17 flex items-center justify-center border-3 border-black transition-all cursor-pointer ${
                  pressedKey === 'LEFT'
                    ? 'bg-[#5e6166] border-t-[#383a3e] border-l-[#383a3e] border-b-[#8c9096] border-r-[#8c9096] translate-x-[2px] translate-y-[2px] shadow-none'
                    : 'bg-[#787c82] hover:bg-[#85898f] border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000]'
                }`}
                aria-label="Left"
              >
                {/* 8-Bit Pixelated Left Arrow */}
                <svg viewBox="0 0 16 16" className="w-7 h-7 sm:w-8 sm:h-8 fill-black" shapeRendering="crispEdges">
                  <rect x="3" y="7" width="2" height="2" />
                  <rect x="5" y="6" width="2" height="4" />
                  <rect x="7" y="5" width="2" height="6" />
                  <rect x="9" y="4" width="2" height="8" />
                  <rect x="11" y="3" width="2" height="10" />
                </svg>
              </button>

              {/* Row 2, Col 2: CENTER Square Button */}
              <button
                onClick={onTogglePause}
                onPointerDown={() => setPressedKey('CENTER')}
                onPointerUp={() => setPressedKey(null)}
                onPointerLeave={() => setPressedKey(null)}
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-17 md:h-17 flex items-center justify-center border-3 border-black transition-all cursor-pointer ${
                  pressedKey === 'CENTER'
                    ? 'bg-[#5e6166] border-t-[#383a3e] border-l-[#383a3e] border-b-[#8c9096] border-r-[#8c9096] translate-x-[2px] translate-y-[2px] shadow-none'
                    : 'bg-[#787c82] hover:bg-[#85898f] border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000]'
                }`}
                title="Pause / Resume"
                aria-label="Center Action"
              >
                {/* 8-Bit Pixelated Center Icon from Reference Image */}
                <svg viewBox="0 0 16 16" className="w-6 h-6 sm:w-7 sm:h-7 fill-black" shapeRendering="crispEdges">
                  <rect x="5" y="4" width="6" height="2" />
                  <rect x="6" y="6" width="4" height="4" />
                  <rect x="4" y="10" width="8" height="2" />
                </svg>
              </button>

              {/* Row 2, Col 3: RIGHT Square Button */}
              <button
                onPointerDown={() => handlePadPress('RIGHT')}
                onPointerUp={handlePadRelease}
                onPointerLeave={handlePadRelease}
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-17 md:h-17 flex items-center justify-center border-3 border-black transition-all cursor-pointer ${
                  pressedKey === 'RIGHT'
                    ? 'bg-[#5e6166] border-t-[#383a3e] border-l-[#383a3e] border-b-[#8c9096] border-r-[#8c9096] translate-x-[2px] translate-y-[2px] shadow-none'
                    : 'bg-[#787c82] hover:bg-[#85898f] border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000]'
                }`}
                aria-label="Right"
              >
                {/* 8-Bit Pixelated Right Arrow */}
                <svg viewBox="0 0 16 16" className="w-7 h-7 sm:w-8 sm:h-8 fill-black" shapeRendering="crispEdges">
                  <rect x="3" y="3" width="2" height="10" />
                  <rect x="5" y="4" width="2" height="8" />
                  <rect x="7" y="5" width="2" height="6" />
                  <rect x="9" y="6" width="2" height="4" />
                  <rect x="11" y="7" width="2" height="2" />
                </svg>
              </button>

              {/* Row 3, Col 1: Empty */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-17 md:h-17" />

              {/* Row 3, Col 2: DOWN Square Button */}
              <button
                onPointerDown={() => handlePadPress('DOWN')}
                onPointerUp={handlePadRelease}
                onPointerLeave={handlePadRelease}
                className={`w-14 h-14 sm:w-16 sm:h-16 md:w-17 md:h-17 flex items-center justify-center border-3 border-black transition-all cursor-pointer ${
                  pressedKey === 'DOWN'
                    ? 'bg-[#5e6166] border-t-[#383a3e] border-l-[#383a3e] border-b-[#8c9096] border-r-[#8c9096] translate-x-[2px] translate-y-[2px] shadow-none'
                    : 'bg-[#787c82] hover:bg-[#85898f] border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000]'
                }`}
                aria-label="Down"
              >
                {/* 8-Bit Pixelated Down Arrow */}
                <svg viewBox="0 0 16 16" className="w-7 h-7 sm:w-8 sm:h-8 fill-black" shapeRendering="crispEdges">
                  <rect x="3" y="3" width="10" height="2" />
                  <rect x="4" y="5" width="8" height="2" />
                  <rect x="5" y="7" width="6" height="2" />
                  <rect x="6" y="9" width="4" height="2" />
                  <rect x="7" y="11" width="2" height="2" />
                </svg>
              </button>

              {/* Row 3, Col 3: Empty */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-17 md:h-17" />
            </div>

            <span className="text-[10px] font-pixel text-neutral-400 tracking-widest mt-2 uppercase">
              5-SQUARE CROSS PAD • ARROWS / WASD
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
