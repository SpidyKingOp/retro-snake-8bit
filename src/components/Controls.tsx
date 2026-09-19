import React, { useState } from 'react'
import type { Direction, GameState, PaletteConfig } from '../types/game'

interface ControlsProps {
  onDirection: (direction: Direction) => void
  onTogglePause: () => void
  onRestart?: () => void
  onToggleMute?: () => void
  onToggleFullscreen?: () => void
  isMuted?: boolean
  isFullscreen?: boolean
  gameState: GameState
  palette?: PaletteConfig
  dpadOnly?: boolean
}

export const Controls: React.FC<ControlsProps> = ({
  onDirection,
  onTogglePause,
  gameState,
}) => {
  const [pressedKey, setPressedKey] = useState<Direction | 'CENTER' | null>(null)

  const handlePadPress = (dir: Direction) => {
    setPressedKey(dir)
    onDirection(dir)
  }

  const handlePadRelease = () => {
    setPressedKey(null)
  }

  return (
    <div className="flex flex-col items-center justify-center py-1 select-none">
      <div className="grid grid-cols-3 gap-1 p-1">
        {/* Row 1, Col 1: Empty */}
        <div className="w-11 h-11 min-[370px]:w-12 min-[370px]:h-12 sm:w-14 sm:h-14 pointer-events-none" />

        {/* Row 1, Col 2: UP */}
        <button
          onPointerDown={() => handlePadPress('UP')}
          onPointerUp={handlePadRelease}
          onPointerLeave={handlePadRelease}
          className={`w-11 h-11 min-[370px]:w-12 min-[370px]:h-12 sm:w-14 sm:h-14 flex items-center justify-center border-3 border-black transition-all cursor-pointer rounded-none ${
            pressedKey === 'UP'
              ? 'bg-[#5e6166] border-t-[#383a3e] border-l-[#383a3e] border-b-[#8c9096] border-r-[#8c9096] translate-x-[2px] translate-y-[2px] shadow-none'
              : 'bg-[#787c82] hover:bg-[#85898f] border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000]'
          }`}
          aria-label="Up"
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5 sm:w-7 sm:h-7 fill-black" shapeRendering="crispEdges">
            <rect x="7" y="3" width="2" height="2" />
            <rect x="6" y="5" width="4" height="2" />
            <rect x="5" y="7" width="6" height="2" />
            <rect x="4" y="9" width="8" height="2" />
            <rect x="3" y="11" width="10" height="2" />
          </svg>
        </button>

        {/* Row 1, Col 3: Empty */}
        <div className="w-11 h-11 min-[370px]:w-12 min-[370px]:h-12 sm:w-14 sm:h-14 pointer-events-none" />

        {/* Row 2, Col 1: LEFT */}
        <button
          onPointerDown={() => handlePadPress('LEFT')}
          onPointerUp={handlePadRelease}
          onPointerLeave={handlePadRelease}
          className={`w-11 h-11 min-[370px]:w-12 min-[370px]:h-12 sm:w-14 sm:h-14 flex items-center justify-center border-3 border-black transition-all cursor-pointer rounded-none ${
            pressedKey === 'LEFT'
              ? 'bg-[#5e6166] border-t-[#383a3e] border-l-[#383a3e] border-b-[#8c9096] border-r-[#8c9096] translate-x-[2px] translate-y-[2px] shadow-none'
              : 'bg-[#787c82] hover:bg-[#85898f] border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000]'
          }`}
          aria-label="Left"
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5 sm:w-7 sm:h-7 fill-black" shapeRendering="crispEdges">
            <rect x="3" y="7" width="2" height="2" />
            <rect x="5" y="6" width="2" height="4" />
            <rect x="7" y="5" width="2" height="6" />
            <rect x="9" y="4" width="2" height="8" />
            <rect x="11" y="3" width="2" height="10" />
          </svg>
        </button>

        {/* Row 2, Col 2: CENTER (Pause / Resume Action) */}
        <button
          onClick={onTogglePause}
          onPointerDown={() => setPressedKey('CENTER')}
          onPointerUp={() => setPressedKey(null)}
          onPointerLeave={() => setPressedKey(null)}
          className={`w-11 h-11 min-[370px]:w-12 min-[370px]:h-12 sm:w-14 sm:h-14 flex items-center justify-center border-3 border-black transition-all cursor-pointer rounded-none ${
            pressedKey === 'CENTER'
              ? 'bg-[#5e6166] border-t-[#383a3e] border-l-[#383a3e] border-b-[#8c9096] border-r-[#8c9096] translate-x-[2px] translate-y-[2px] shadow-none'
              : 'bg-[#787c82] hover:bg-[#85898f] border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000]'
          }`}
          title={gameState === 'PLAYING' ? 'Pause' : 'Resume / Start'}
          aria-label="Center Action"
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5 sm:w-6 sm:h-6 fill-black" shapeRendering="crispEdges">
            <rect x="5" y="4" width="6" height="2" />
            <rect x="6" y="6" width="4" height="4" />
            <rect x="4" y="10" width="8" height="2" />
          </svg>
        </button>

        {/* Row 2, Col 3: RIGHT */}
        <button
          onPointerDown={() => handlePadPress('RIGHT')}
          onPointerUp={handlePadRelease}
          onPointerLeave={handlePadRelease}
          className={`w-11 h-11 min-[370px]:w-12 min-[370px]:h-12 sm:w-14 sm:h-14 flex items-center justify-center border-3 border-black transition-all cursor-pointer rounded-none ${
            pressedKey === 'RIGHT'
              ? 'bg-[#5e6166] border-t-[#383a3e] border-l-[#383a3e] border-b-[#8c9096] border-r-[#8c9096] translate-x-[2px] translate-y-[2px] shadow-none'
              : 'bg-[#787c82] hover:bg-[#85898f] border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000]'
          }`}
          aria-label="Right"
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5 sm:w-7 sm:h-7 fill-black" shapeRendering="crispEdges">
            <rect x="3" y="3" width="2" height="10" />
            <rect x="5" y="4" width="2" height="8" />
            <rect x="7" y="5" width="2" height="6" />
            <rect x="9" y="6" width="2" height="4" />
            <rect x="11" y="7" width="2" height="2" />
          </svg>
        </button>

        {/* Row 3, Col 1: Empty */}
        <div className="w-11 h-11 min-[370px]:w-12 min-[370px]:h-12 sm:w-14 sm:h-14 pointer-events-none" />

        {/* Row 3, Col 2: DOWN */}
        <button
          onPointerDown={() => handlePadPress('DOWN')}
          onPointerUp={handlePadRelease}
          onPointerLeave={handlePadRelease}
          className={`w-11 h-11 min-[370px]:w-12 min-[370px]:h-12 sm:w-14 sm:h-14 flex items-center justify-center border-3 border-black transition-all cursor-pointer rounded-none ${
            pressedKey === 'DOWN'
              ? 'bg-[#5e6166] border-t-[#383a3e] border-l-[#383a3e] border-b-[#8c9096] border-r-[#8c9096] translate-x-[2px] translate-y-[2px] shadow-none'
              : 'bg-[#787c82] hover:bg-[#85898f] border-t-[#a8acb2] border-l-[#a8acb2] border-b-[#484b50] border-r-[#484b50] shadow-[3px_3px_0px_#000]'
          }`}
          aria-label="Down"
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5 sm:w-7 sm:h-7 fill-black" shapeRendering="crispEdges">
            <rect x="3" y="3" width="10" height="2" />
            <rect x="4" y="5" width="8" height="2" />
            <rect x="5" y="7" width="6" height="2" />
            <rect x="6" y="9" width="4" height="2" />
            <rect x="7" y="11" width="2" height="2" />
          </svg>
        </button>

        {/* Row 3, Col 3: Empty */}
        <div className="w-11 h-11 min-[370px]:w-12 min-[370px]:h-12 sm:w-14 sm:h-14 pointer-events-none" />
      </div>
    </div>
  )
}
