import React, { useEffect } from 'react'
import type { GameMode, PaletteId } from '../types/game'
import { PALETTES } from '../constants/palettes'
import { GAME_MODES } from '../constants/mazes'
import { SPEED_CONFIGS } from '../constants/speeds'
import { Gauge, Palette, Layers, X, Check } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  currentMode: GameMode
  onSelectMode: (mode: GameMode) => void
  speedLevel: number
  onSelectSpeed: (level: number) => void
  currentPalette: PaletteId
  onSelectPalette: (paletteId: PaletteId) => void
  onOpenHelp: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  speedLevel,
  onSelectSpeed,
  currentPalette,
  onSelectPalette,
  onOpenHelp,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-neutral-900 border-4 border-neutral-600 shadow-[8px_8px_0px_#000] p-5 sm:p-6 overflow-y-auto max-h-[90vh] rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-700 pb-3 mb-4">
          <div className="flex items-center gap-3">
            {/* 3-Dot Pixel Icon */}
            <div className="p-1.5 bg-neutral-950 border-2 border-neutral-700 shadow-[2px_2px_0px_#000]">
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 16 16" fill="currentColor">
                <rect x="6" y="2" width="4" height="3" />
                <rect x="6" y="7" width="4" height="3" />
                <rect x="6" y="12" width="4" height="3" />
              </svg>
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-retro text-neutral-100 uppercase tracking-wider">
                ARCADE SETTINGS & MODES
              </h2>
              <p className="text-[10px] font-pixel text-neutral-400 tracking-wider">
                CUSTOMIZE GAMEPLAY, DIFFICULTY & DISPLAY
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border-2 border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-500 shadow-[2px_2px_0px_#000] cursor-pointer rounded-none"
            title="Close Settings (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Section 1: Game Mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-retro text-emerald-400">
                <Layers className="w-4 h-4" />
                <span>GAME MODE</span>
              </div>
              <span className="text-[10px] font-pixel text-neutral-400 tracking-wider">
                {GAME_MODES.find(m => m.mode === currentMode)?.name.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GAME_MODES.map((item) => {
                const isSelected = currentMode === item.mode
                return (
                  <button
                    key={item.mode}
                    onClick={() => onSelectMode(item.mode)}
                    className={`p-2.5 text-xs font-retro border-2 transition-all text-left cursor-pointer rounded-none ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-[3px_3px_0px_#000] font-bold'
                        : 'border-neutral-750 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{item.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Speed Level (1 to 9) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-retro text-amber-400">
                <Gauge className="w-4 h-4" />
                <span>SPEED LEVEL (1 - 9)</span>
              </div>
              <span className="text-[11px] font-pixel text-amber-400 tracking-wider">
                LVL {speedLevel}: {SPEED_CONFIGS[speedLevel - 1]?.label.toUpperCase()} ({SPEED_CONFIGS[speedLevel - 1]?.intervalMs}ms)
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {SPEED_CONFIGS.map((config) => {
                const isSelected = speedLevel === config.level
                return (
                  <button
                    key={config.level}
                    onClick={() => onSelectSpeed(config.level)}
                    className={`flex-1 py-2.5 text-xs font-retro border-2 transition-all flex flex-col items-center justify-center cursor-pointer rounded-none ${
                      isSelected
                        ? 'border-amber-400 bg-amber-950/80 text-amber-300 font-bold shadow-[3px_3px_0px_#000]'
                        : 'border-neutral-750 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <span>{config.level}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 3: Theme & Color Palette */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-retro text-sky-400">
                <Palette className="w-4 h-4" />
                <span>RETRO COLOR THEME</span>
              </div>
              <span className="text-[10px] font-pixel text-neutral-400 tracking-wider">
                {PALETTES[currentPalette]?.name.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(PALETTES).map((pal) => {
                const isSelected = currentPalette === pal.id
                return (
                  <button
                    key={pal.id}
                    onClick={() => onSelectPalette(pal.id)}
                    className={`px-3 py-2.5 border-2 flex items-center gap-3 transition-all cursor-pointer rounded-none ${
                      isSelected
                        ? 'border-sky-400 bg-neutral-800 shadow-[3px_3px_0px_#000]'
                        : 'border-neutral-750 bg-neutral-950 hover:bg-neutral-850 shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    {/* Palette preview dot matrix square */}
                    <div
                      className="w-6 h-6 border-2 border-neutral-700 flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000]"
                      style={{ backgroundColor: pal.screenBg }}
                    >
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: pal.pixelOn }}
                      />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-xs font-retro font-bold text-neutral-100 truncate">
                        {pal.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        {pal.subtitle}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer Actions inside Modal */}
          <div className="pt-3 border-t-2 border-neutral-800 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose()
                onOpenHelp()
              }}
              className="px-3 py-2 border-2 border-neutral-700 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white font-retro text-[10px] shadow-[2px_2px_0px_#000] cursor-pointer rounded-none transition-colors"
            >
              RULES & HELP (?)
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-2 border-2 border-emerald-500 bg-emerald-600 hover:bg-emerald-500 text-black font-retro font-bold text-xs shadow-[3px_3px_0px_#000] cursor-pointer rounded-none transition-all"
            >
              APPLY & RESUME
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
