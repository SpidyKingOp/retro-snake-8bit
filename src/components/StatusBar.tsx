import React from 'react'
import type { BonusBug, GameMode, PaletteConfig } from '../types/game'
import { Zap, Trophy, ShieldAlert } from 'lucide-react'

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
    <div className="w-full max-w-[min(420px,calc(100dvh-235px))] sm:max-w-[840px] mx-auto mb-1.5 sm:mb-2 select-none shrink-0">
      {/* Top LCD Data Readouts: Sharp Borders */}
      <div 
        className="px-2.5 py-1.5 sm:px-4 sm:py-2 border-2 sm:border-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 text-xs sm:text-sm font-retro uppercase transition-all duration-300"
        style={{
          backgroundColor: palette.screenBg,
          borderColor: palette.bezelBorder,
          color: palette.pixelOn,
        }}
      >
        {/* Row 1 on mobile: Score & High Score */}
        <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="opacity-75 text-[9px] sm:text-xs">SCORE</span>
            <span className="font-bold text-xs sm:text-base tracking-wider">
              {String(score).padStart(5, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Trophy className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${score > highScore && highScore > 0 ? 'text-amber-400 animate-pulse' : 'opacity-80'}`} />
            <span className="opacity-75 text-[9px] sm:text-xs">HI</span>
            <span className={`font-bold text-xs sm:text-base tracking-wider ${score > highScore && highScore > 0 ? 'text-amber-400 font-extrabold' : ''}`}>
              {String(Math.max(highScore, score)).padStart(5, '0')}
            </span>
          </div>
        </div>

        {/* Row 2 on mobile: Speed Level, Snake Length, Mode Badge */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 border-t sm:border-t-0 border-current/25 pt-1 sm:pt-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80" />
            <span className="opacity-75 text-[9px] sm:text-xs">LVL</span>
            <span className="font-bold text-[10px] sm:text-sm">{speedLevel}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="opacity-75 text-[9px] sm:text-xs">LEN</span>
            <span className="font-bold text-[10px] sm:text-sm">{snakeLength}</span>
          </div>

          <div className="flex items-center gap-1 px-1.5 py-0.5 border border-current opacity-90 text-[9px] sm:text-[10px]">
            <ShieldAlert className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>{getModeLabel(gameMode)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
