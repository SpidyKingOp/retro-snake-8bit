import React from 'react'
import type { GameMode, PaletteId } from '../types/game'
import { PALETTES } from '../constants/palettes'
import { GAME_MODES } from '../constants/mazes'
import { SPEED_CONFIGS } from '../constants/speeds'
import { Gauge, HelpCircle, Palette, Layers } from 'lucide-react'

interface SettingsBarProps {
  currentMode: GameMode
  onSelectMode: (mode: GameMode) => void
  speedLevel: number
  onSelectSpeed: (level: number) => void
  currentPalette: PaletteId
  onSelectPalette: (paletteId: PaletteId) => void
  onOpenHelp: () => void
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
  currentMode,
  onSelectMode,
  speedLevel,
  onSelectSpeed,
  currentPalette,
  onSelectPalette,
  onOpenHelp,
}) => {
  return (
    <div className="w-full max-w-[840px] mx-auto mt-4 px-1 select-none">
      <div className="bg-neutral-900 border-2 border-neutral-700 p-4 sm:p-5 shadow-[4px_4px_0px_#000] space-y-4">
        {/* Row 1: Game Mode Selector: Sharp Cornered Rectangular Tabs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-retro text-neutral-400">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>GAME MODE</span>
            </div>
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 text-xs font-retro text-neutral-400 hover:text-white transition-colors cursor-pointer border border-neutral-750 px-2 py-1 bg-neutral-950 shadow-[2px_2px_0px_#000]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>HELP</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {GAME_MODES.map((item) => {
              const isSelected = currentMode === item.mode
              return (
                <button
                  key={item.mode}
                  onClick={() => onSelectMode(item.mode)}
                  className={`px-2.5 py-2.5 text-xs font-retro border-2 transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-950/70 text-emerald-300 shadow-[3px_3px_0px_#000] font-bold'
                      : 'border-neutral-750 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <div className="truncate">{item.name}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Row 2: Speed Level Stepper (1 to 9): Sharp Rectangular Keys */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-retro text-neutral-400">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>SPEED LEVEL (1 - 9)</span>
            </div>
            <span className="text-xs font-pixel text-amber-400 tracking-wider">
              {SPEED_CONFIGS[speedLevel - 1]?.label.toUpperCase()} ({SPEED_CONFIGS[speedLevel - 1]?.intervalMs}ms)
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {SPEED_CONFIGS.map((config) => {
              const isSelected = speedLevel === config.level
              return (
                <button
                  key={config.level}
                  onClick={() => onSelectSpeed(config.level)}
                  className={`flex-1 py-2 text-xs font-retro border-2 transition-all flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/70 text-amber-300 font-bold shadow-[3px_3px_0px_#000]'
                      : 'border-neutral-750 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <span>{config.level}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Row 3: Color Palette Picker: Sharp Border Cards */}
        <div>
          <div className="flex items-center gap-2 text-xs font-retro text-neutral-400 mb-2">
            <Palette className="w-4 h-4 text-sky-400" />
            <span>RETRO PALETTES</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(PALETTES).map((pal) => {
              const isSelected = currentPalette === pal.id
              return (
                <button
                  key={pal.id}
                  onClick={() => onSelectPalette(pal.id)}
                  className={`px-3 py-2.5 border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-400 bg-neutral-850 shadow-[3px_3px_0px_#000]'
                      : 'border-neutral-750 bg-neutral-950 hover:bg-neutral-850 shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <div
                    className="w-5 h-5 border border-black flex items-center justify-center shrink-0"
                    style={{ backgroundColor: pal.screenBg }}
                  >
                    <div
                      className="w-2.5 h-2.5"
                      style={{ backgroundColor: pal.pixelOn }}
                    />
                  </div>
                  <div className="text-left overflow-hidden">
                    <div className="text-xs font-retro font-bold text-neutral-100 truncate">
                      {pal.name}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {pal.subtitle}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
