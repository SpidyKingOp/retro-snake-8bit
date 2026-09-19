import { useState, useEffect } from 'react'
import { useSnakeGame } from './hooks/useSnakeGame'
import { LcdScreen } from './components/LcdScreen'
import { StatusBar } from './components/StatusBar'
import { Controls } from './components/Controls'
import { SettingsBar } from './components/SettingsBar'
import { HelpModal } from './components/HelpModal'
import { PALETTES, DEFAULT_PALETTE } from './constants/palettes'
import type { PaletteId } from './types/game'
import { Gamepad2, Volume2, VolumeX, HelpCircle, Maximize, Minimize } from 'lucide-react'

export function App() {
  const [currentPaletteId, setCurrentPaletteId] = useState<PaletteId>(DEFAULT_PALETTE)
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [showFullscreenDpad, setShowFullscreenDpad] = useState<boolean>(false)

  const palette = PALETTES[currentPaletteId]

  const {
    gameState,
    gameMode,
    speedLevel,
    snake,
    direction,
    food,
    bonusBug,
    score,
    highScore,
    isNewHighScore,
    isMuted,
    changeDirection,
    startGame,
    togglePause,
    toggleMute,
    selectGameMode,
    selectSpeedLevel,
  } = useSnakeGame()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(() => {
        setIsFullscreen(prev => !prev)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch(() => {
        setIsFullscreen(false)
      })
    }
  }

  // Synchronize fullscreen state with browser changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  // Global key listener for F key (Fullscreen)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === 'f' || e.key === 'F') && !isHelpOpen) {
        toggleFullscreen()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isHelpOpen])

  // ==========================================
  // FULL SCREEN VIEW: ONLY GAME SHOWS
  // ==========================================
  if (isFullscreen) {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-y-auto"
        style={{ backgroundColor: palette.chassisBg }}
      >
        {/* Floating Controls Bar */}
        <div className="absolute top-3 inset-x-4 z-50 flex items-center justify-between pointer-events-none">
          {/* Optional Touch/Mouse D-Pad Toggle */}
          <button
            onClick={() => setShowFullscreenDpad(prev => !prev)}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950/85 hover:bg-neutral-900 border-2 border-neutral-700 text-neutral-300 font-retro text-[10px] shadow-[2px_2px_0px_#000] backdrop-blur cursor-pointer transition-colors"
            title="Toggle On-Screen Direction Pad"
          >
            <span>{showFullscreenDpad ? 'HIDE D-PAD' : 'SHOW D-PAD'}</span>
          </button>

          {/* Floating Minimal Exit Button */}
          <button
            onClick={toggleFullscreen}
            className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-neutral-950/85 hover:bg-neutral-900 border-2 border-neutral-700 text-neutral-300 font-retro text-[10px] shadow-[2px_2px_0px_#000] backdrop-blur cursor-pointer transition-colors"
            title="Exit Fullscreen (Esc or F)"
          >
            <Minimize className="w-3.5 h-3.5 text-amber-400" />
            <span>EXIT FULLSCREEN (ESC / F)</span>
          </button>
        </div>

        {/* Scaled Game Container */}
        <div className="w-full max-w-[1020px] flex flex-col items-center justify-center my-auto pt-8">
          {/* Status Bar */}
          <StatusBar
            score={score}
            highScore={highScore}
            speedLevel={speedLevel}
            snakeLength={snake.length}
            gameMode={gameMode}
            bonusBug={bonusBug}
            palette={palette}
          />

          {/* 28x18 Dot-Matrix LCD Canvas */}
          <LcdScreen
            snake={snake}
            direction={direction}
            food={food}
            bonusBug={bonusBug}
            gameMode={gameMode}
            gameState={gameState}
            palette={palette}
            score={score}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            speedLevel={speedLevel}
            onStartOrRestart={() => {
              if (gameState === 'IDLE' || gameState === 'GAME_OVER') {
                startGame()
              }
            }}
            onDirection={changeDirection}
          />

          {/* Optional D-pad in Fullscreen for touch or mouse players */}
          {showFullscreenDpad && (
            <div className="w-full max-w-[840px] mt-2">
              <Controls
                onDirection={changeDirection}
                onTogglePause={togglePause}
                onRestart={startGame}
                onToggleMute={toggleMute}
                onToggleFullscreen={toggleFullscreen}
                isMuted={isMuted}
                isFullscreen={isFullscreen}
                gameState={gameState}
                palette={palette}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==========================================
  // STANDARD VIEW: CONSOLE WITH ALL CONTROLS
  // ==========================================
  return (
    <div 
      className="min-h-screen text-neutral-100 flex flex-col items-center justify-between p-2 sm:p-5 select-none font-sans transition-colors duration-300"
      style={{ backgroundColor: palette.chassisBg }}
    >
      {/* Top Navigation / Branding: Sharp Corners & Industrial Retro Aesthetic */}
      <header className="w-full max-w-[840px] flex items-center justify-between border-b-2 border-neutral-800 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-900 border-2 border-neutral-700 shadow-[2px_2px_0px_#000]">
            <Gamepad2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-retro text-neutral-100 tracking-wider">
              RETRO SNAKE <span className="text-emerald-400">8-BIT</span>
            </h1>
            <p className="text-[11px] font-pixel text-neutral-400 tracking-wider">
              DOT-MATRIX LCD CANVAS • 28x18 GRID
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-neutral-300 shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
            title="Full Screen Mode (F)"
          >
            <Maximize className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Audio Quick Button */}
          <button
            onClick={toggleMute}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-neutral-300 shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
            title="Toggle Sound (M)"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Help Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-neutral-300 shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
            title="Rules & Keybindings"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </header>

      {/* Main Arcade Panel (Pure Web Game Interface — sharp corners throughout) */}
      <main className="w-full max-w-[840px] flex-1 flex flex-col items-center justify-center">
        {/* Status Bar */}
        <StatusBar
          score={score}
          highScore={highScore}
          speedLevel={speedLevel}
          snakeLength={snake.length}
          gameMode={gameMode}
          bonusBug={bonusBug}
          palette={palette}
        />

        {/* 28x18 Dot-Matrix LCD Canvas */}
        <LcdScreen
          snake={snake}
          direction={direction}
          food={food}
          bonusBug={bonusBug}
          gameMode={gameMode}
          gameState={gameState}
          palette={palette}
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          speedLevel={speedLevel}
          onStartOrRestart={() => {
            if (gameState === 'IDLE' || gameState === 'GAME_OVER') {
              startGame()
            }
          }}
          onDirection={changeDirection}
        />

        {/* Tactile Sharp Rectangular D-Pad Controller & Action Buttons */}
        <Controls
          onDirection={changeDirection}
          onTogglePause={togglePause}
          onRestart={startGame}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          isMuted={isMuted}
          isFullscreen={isFullscreen}
          gameState={gameState}
          palette={palette}
        />

        {/* Game Mode, Speed Stepper (1-9), and Retro Palettes */}
        <SettingsBar
          currentMode={gameMode}
          onSelectMode={selectGameMode}
          speedLevel={speedLevel}
          onSelectSpeed={selectSpeedLevel}
          currentPalette={currentPaletteId}
          onSelectPalette={setCurrentPaletteId}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
      </main>

      {/* Footer / Arcade Specs */}
      <footer className="w-full max-w-[840px] border-t-2 border-neutral-800 pt-3 mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500 font-pixel tracking-wider">
        <div>
          SYNTHESIZED WEB AUDIO API • 9 SPEED LEVELS • BONUS BUG ENGINE
        </div>
        <div>
          KEYBOARD: [ARROWS/WASD] STEER • [SPACE] PAUSE • [F] FULLSCREEN • [ENTER] RESTART
        </div>
      </footer>

      {/* Operations Manual Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}

export default App
