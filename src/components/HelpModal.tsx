import React from 'react'
import { X, Keyboard, Bug, Trophy, Zap, Shield } from 'lucide-react'

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-neutral-900 border-4 border-neutral-600 shadow-[8px_8px_0px_#000] p-5 sm:p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-700 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xs sm:text-sm font-retro text-neutral-100 uppercase tracking-wider">
              OPERATIONS MANUAL & RULES
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white hover:border-neutral-500 shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-neutral-300 text-xs font-sans leading-relaxed">
          {/* Controls */}
          <div>
            <div className="flex items-center gap-2 font-retro text-amber-400 text-xs mb-2">
              <Keyboard className="w-4 h-4" />
              <span>CONTROLS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-950 p-3 border-2 border-neutral-800 shadow-[2px_2px_0px_#000]">
              <div><span className="text-white font-mono font-bold">Arrow Keys / WASD</span>: Turn Snake</div>
              <div><span className="text-white font-mono font-bold">Spacebar / P</span>: Pause / Resume</div>
              <div><span className="text-white font-mono font-bold">Enter</span>: Restart Game</div>
              <div><span className="text-white font-mono font-bold">M</span>: Mute Audio</div>
              <div className="col-span-2 text-neutral-400 text-[10px] mt-1 border-t border-neutral-800 pt-1">
                ★ Touchscreens: Use tactile sharp-edge rectangular D-Pad buttons below screen.
              </div>
            </div>
          </div>

          {/* Bonus Bug System */}
          <div>
            <div className="flex items-center gap-2 font-retro text-emerald-400 text-xs mb-2">
              <Bug className="w-4 h-4" />
              <span>BONUS BUG SYSTEM</span>
            </div>
            <p className="bg-neutral-950 p-3 border-2 border-neutral-800 shadow-[2px_2px_0px_#000] text-[11px]">
              Every <strong className="text-white">5 regular food items</strong> eaten, an animated bonus insect appears with a fluttering leg matrix and an 8-second countdown timer. Catch it before time expires for up to <strong className="text-emerald-400">500 bonus points</strong>!
            </p>
          </div>

          {/* Modes */}
          <div>
            <div className="flex items-center gap-2 font-retro text-sky-400 text-xs mb-2">
              <Shield className="w-4 h-4" />
              <span>GAME MODES</span>
            </div>
            <ul className="space-y-1.5 bg-neutral-950 p-3 border-2 border-neutral-800 shadow-[2px_2px_0px_#000] text-[11px]">
              <li><strong className="text-white">Classic Mode:</strong> Perimeter walls are solid. Colliding with borders or snake body ends the game.</li>
              <li><strong className="text-white">Pass-Through Mode:</strong> Snake warps smoothly through screen borders to the opposite edge.</li>
              <li><strong className="text-white">Mazes (Boxes, Gates, Pinwheel):</strong> Solid retro obstacles inside the 28x18 grid. Precision navigation required.</li>
            </ul>
          </div>

          {/* Speed & Scoring */}
          <div>
            <div className="flex items-center gap-2 font-retro text-amber-300 text-xs mb-2">
              <Zap className="w-4 h-4" />
              <span>SPEEDS & SCORING</span>
            </div>
            <p className="bg-neutral-950 p-3 border-2 border-neutral-800 shadow-[2px_2px_0px_#000] text-[11px]">
              9 adjustable speeds (Level 1 Easy to Level 9 Turbo). Food value = <strong className="text-white">10 × Speed Level</strong>. High scores are automatically saved to your browser’s local storage!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t-2 border-neutral-700 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-600 text-neutral-100 font-retro text-xs shadow-[3px_3px_0px_#000] cursor-pointer"
          >
            CLOSE & RETURN TO GAME
          </button>
        </div>
      </div>
    </div>
  )
}
