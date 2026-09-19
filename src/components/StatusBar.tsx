import React from 'react'
import type { BonusBug, GameMode, PaletteConfig } from '../types/game'
import { Zap, Trophy, ShieldAlert, Sparkles } from 'lucide-react'

interface StatusBarProps {
  score: number
  highScore: number
  speedLevel: number
  snakeLength: number
  gameMode: GameMode
  bonusBug: BonusBug | null
  palette: PaletteConfig
}

export const StatusBar: React.FC<StatusBarProps> = ({
  score,
  highScore,
  speedLevel,
  snakeLength,
  gameMode,
  bonusBug,
  palette,
}) => {
  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'classic': return 'CLASSIC'
      case 'no-walls': return 'NO-WALLS'
      case 'maze-boxes': return 'BOXES'
      case 'maze-gates': return 'GATES'
      case 'maze-pinwheel': return 'PINWHEEL'
    }
  }

  return (
    <div className="w-full max-w-[840px] mx-auto mb-2 select-none">
      {/* Top LCD Data Readouts: Sharp Borders */}
      <div 
        className="px-4 py-2 border-x-4 border-t-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-retro uppercase transition-all duration-300"
        style={{
          backgroundColor: palette.screenBg,
          borderColor: palette.bezelBorder,
          color: palette.pixelOn,
        }}
      >
        {/* Current Score */}
        <div className="flex items-center gap-2">
          <span className="opacity-75 text-[10px] sm:text-xs">SCORE</span>
          <span className="font-bold text-sm sm:text-base tracking-wider">
            {String(score).padStart(5, '0')}
          </span>
        </div>

        {/* High Score */}
        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 opacity-80" />
          <span className="opacity-75 text-[10px] sm:text-xs">HI</span>
          <span className="font-bold text-sm sm:text-base tracking-wider">
            {String(highScore).padStart(5, '0')}
          </span>
        </div>

        {/* Speed Level */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 opacity-80" />
          <span className="opacity-75 text-[10px] sm:text-xs">LVL</span>
          <span className="font-bold">{speedLevel}</span>
        </div>

        {/* Snake Length */}
        <div className="flex items-center gap-1.5">
          <span className="opacity-75 text-[10px] sm:text-xs">LEN</span>
          <span className="font-bold">{snakeLength}</span>
        </div>

        {/* Mode Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 border-2 border-current opacity-90 text-[10px]">
          <ShieldAlert className="w-3 h-3" />
          <span>{getModeLabel(gameMode)}</span>
        </div>
      </div>

      {/* Bonus Bug Countdown Bar (when active): Sharp Progress Bar */}
      {bonusBug && (
        <div 
          className="px-4 py-1.5 border-x-4 flex items-center justify-between text-[11px] font-retro transition-all duration-200 animate-pulse"
          style={{
            backgroundColor: palette.screenBg,
            borderColor: palette.bezelBorder,
            color: palette.pixelOn,
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BONUS BUG ACTIVE:</span>
            <span className="font-bold">+{bonusBug.currentPoints} PTS</span>
          </div>

          <div className="w-28 sm:w-44 bg-black/25 h-2.5 border border-current">
            <div 
              className="h-full transition-all duration-100 ease-linear"
              style={{
                width: `${(bonusBug.remainingMs / bonusBug.durationMs) * 100}%`,
                backgroundColor: palette.pixelOn,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
