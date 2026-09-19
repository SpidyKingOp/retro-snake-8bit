import { useState, useEffect, useRef } from 'react'
import { useSnakeGame } from './hooks/useSnakeGame'
import { LcdScreen } from './components/LcdScreen'
import { StatusBar } from './components/StatusBar'
import { Controls } from './components/Controls'
import { SettingsModal } from './components/SettingsModal'
import { HelpModal } from './components/HelpModal'
import { PALETTES, DEFAULT_PALETTE } from './constants/palettes'
import type { PaletteId } from './types/game'
import { Volume2, VolumeX, HelpCircle, Maximize, Minimize } from 'lucide-react'

export function App() {
  const [currentPaletteId, setCurrentPaletteId] = useState<PaletteId>(DEFAULT_PALETTE)
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [showFullscreenDpad, setShowFullscreenDpad] = useState<boolean>(false)

  const palette = PALETTES[currentPaletteId]

  const {
    gridWidth,
    gridHeight,
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
  } = useSnakeGame({ isModalOpen: isHelpOpen || isSettingsOpen })

  const toggleFullscreen = () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const doc = document as any
    const docEl = document.documentElement as any

    const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement)
    const requestFs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen
    const exitFs = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen

    if (!isFs) {
      if (requestFs) {
        try {
          const res = requestFs.call(docEl)
          if (res && typeof res.then === 'function') {
            res.then(() => setIsFullscreen(true)).catch(() => setIsFullscreen(prev => !prev))
          } else {
            setIsFullscreen(true)
          }
        } catch {
          setIsFullscreen(prev => !prev)
        }
      } else {
        // Fallback for browsers like iOS Safari that do not support element fullscreen
        setIsFullscreen(prev => !prev)
      }
    } else {
      if (exitFs) {
        try {
          const res = exitFs.call(doc)
          if (res && typeof res.then === 'function') {
            res.then(() => setIsFullscreen(false)).catch(() => setIsFullscreen(false))
          } else {
            setIsFullscreen(false)
          }
        } catch {
          setIsFullscreen(false)
        }
      } else {
        setIsFullscreen(false)
      }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  // Synchronize fullscreen state with browser changes (standard and webkit)
  useEffect(() => {
    const handleFsChange = () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const doc = document as any
      const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement)
      setIsFullscreen(isFs)
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange)
      document.removeEventListener('webkitfullscreenchange', handleFsChange)
    }
  }, [])

  // Auto-scroll on mobile load / resize to guarantee score + game + dpad are completely visible
  useEffect(() => {
    if (typeof window === 'undefined') return
    const ensureVisible = () => {
      if (window.innerWidth < 640) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    }
    ensureVisible()
    const timer = setTimeout(ensureVisible, 120)
    window.addEventListener('resize', ensureVisible)
    window.addEventListener('orientationchange', ensureVisible)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', ensureVisible)
      window.removeEventListener('orientationchange', ensureVisible)
    }
  }, [])

  // Global key listener for F key (Fullscreen)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === 'f' || e.key === 'F') && !isHelpOpen && !isSettingsOpen) {
        toggleFullscreen()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isHelpOpen, isSettingsOpen])

  const fsTouchOriginRef = useRef<{ x: number; y: number } | null>(null)

  const handleFsTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || isSettingsOpen || isHelpOpen) return
    if (e.touches.length > 0) {
      fsTouchOriginRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }
  }

  const handleFsTouchMove = (e: React.TouchEvent) => {
    if (!fsTouchOriginRef.current || e.touches.length === 0 || isSettingsOpen || isHelpOpen) return
    const curX = e.touches[0].clientX
    const curY = e.touches[0].clientY
    const dx = curX - fsTouchOriginRef.current.x
    const dy = curY - fsTouchOriginRef.current.y

    const minSwipe = 18
    if (Math.abs(dx) > minSwipe || Math.abs(dy) > minSwipe) {
      if (Math.abs(dx) > Math.abs(dy)) {
        changeDirection(dx > 0 ? 'RIGHT' : 'LEFT')
      } else {
        changeDirection(dy > 0 ? 'DOWN' : 'UP')
      }
      fsTouchOriginRef.current = { x: curX, y: curY }
    }
  }

  const handleFsTouchEnd = () => {
    fsTouchOriginRef.current = null
  }

  // ==========================================
  // FULL SCREEN VIEW: ONLY GAME SHOWS
  // ==========================================
  if (isFullscreen) {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-y-auto overflow-x-hidden touch-none"
        style={{ backgroundColor: palette.chassisBg }}
        onTouchStart={handleFsTouchStart}
        onTouchMove={handleFsTouchMove}
        onTouchEnd={handleFsTouchEnd}
        onTouchCancel={handleFsTouchEnd}
      >
        {/* Scaled Game Container */}
        <div className={`w-full ${gridWidth === gridHeight ? 'max-w-[min(420px,calc(100dvh-180px))]' : 'max-w-[1020px]'} flex flex-col items-center justify-center my-auto`}>
          {/* In-Flow Fullscreen Control Bar (Eliminates overlap with StatusBar) */}
          <div className="w-full flex items-center justify-between pb-2 mb-2 border-b-2 border-neutral-800 shrink-0">
            <div className="flex items-center gap-2">
              {/* Optional Touch/Mouse D-Pad Toggle (Mobile only) */}
              <button
                onClick={() => setShowFullscreenDpad(prev => !prev)}
                className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-neutral-300 font-retro text-[9px] sm:text-[10px] shadow-[2px_2px_0px_#000] cursor-pointer transition-colors rounded-none"
                title="Toggle On-Screen Direction Pad"
              >
                <span>{showFullscreenDpad ? 'HIDE D-PAD' : 'SHOW D-PAD'}</span>
              </button>

              {/* 3-Dot Settings Menu Button in Fullscreen */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-neutral-300 font-retro text-[9px] sm:text-[10px] shadow-[2px_2px_0px_#000] cursor-pointer transition-colors rounded-none"
                title="Game Settings: Mode, Speed, Theme"
              >
                <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="6" y="2" width="4" height="3" />
                  <rect x="6" y="7" width="4" height="3" />
                  <rect x="6" y="12" width="4" height="3" />
                </svg>
                <span>SETTINGS</span>
              </button>
            </div>

            {/* Minimal Exit Button */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-neutral-300 font-retro text-[9px] sm:text-[10px] shadow-[2px_2px_0px_#000] cursor-pointer transition-colors rounded-none"
              title="Exit Fullscreen (Esc or F)"
            >
              <Minimize className="w-3.5 h-3.5 text-amber-400" />
              <span>EXIT</span>
              <span className="hidden sm:inline text-neutral-400 font-pixel text-[9px]">(ESC/F)</span>
            </button>
          </div>

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

          {/* Dot-Matrix LCD Canvas */}
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
            gridWidth={gridWidth}
            gridHeight={gridHeight}
            onStartOrRestart={() => {
              if (gameState === 'IDLE' || gameState === 'GAME_OVER') {
                startGame()
              }
            }}
            onTogglePause={togglePause}
            onDirection={changeDirection}
          />

          {/* Optional Freestanding D-pad in Fullscreen (clean cross, no card frame or action buttons, mobile only) */}
          {showFullscreenDpad && (
            <div className="sm:hidden w-full mt-2">
              <Controls
                dpadOnly={true}
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

        {/* Settings Modal (Accessible from Fullscreen) */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentMode={gameMode}
          onSelectMode={selectGameMode}
          speedLevel={speedLevel}
          onSelectSpeed={selectSpeedLevel}
          currentPalette={currentPaletteId}
          onSelectPalette={setCurrentPaletteId}
          onOpenHelp={() => {
            setIsSettingsOpen(false)
            setIsHelpOpen(true)
          }}
        />
      </div>
    )
  }

  // ==========================================
  // STANDARD VIEW: CONSOLE WITH ALL CONTROLS
  // ==========================================
  return (
    <div 
      className="min-h-[100dvh] h-[100dvh] sm:h-auto sm:min-h-screen text-neutral-100 flex flex-col items-center justify-between p-2 sm:p-5 select-none font-sans transition-colors duration-300 overflow-y-auto sm:overflow-visible overflow-x-hidden w-full max-w-[100vw]"
      style={{ backgroundColor: palette.chassisBg }}
    >
      {/* Top Navigation / Branding: Sharp Corners & Industrial Retro Aesthetic */}
      <header className="w-full max-w-[min(420px,calc(100dvh-235px))] sm:max-w-[840px] mx-auto flex items-center justify-between border-b-2 border-neutral-800 pb-1.5 sm:pb-2.5 mb-1 sm:mb-2.5 shrink-0">
        <div className="min-w-0 flex-1 pr-1.5">
          <h1 className="text-[11px] min-[360px]:text-xs sm:text-base font-retro text-neutral-100 tracking-wider truncate">
            RETRO SNAKE <span className="text-emerald-400">8-BIT</span>
          </h1>
          <p className="text-[8px] min-[360px]:text-[9px] sm:text-[11px] font-pixel text-neutral-400 tracking-wider truncate">
            DOT-MATRIX LCD CANVAS • {gridWidth}x{gridHeight} GRID
          </p>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-neutral-300 shadow-[2px_2px_0px_#000] transition-colors cursor-pointer rounded-none"
            title="Full Screen Mode (F)"
          >
            <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </button>

          {/* Audio Quick Button */}
          <button
            onClick={toggleMute}
            className="p-1.5 sm:p-2 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-neutral-300 shadow-[2px_2px_0px_#000] transition-colors cursor-pointer rounded-none"
            title="Toggle Sound (M)"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            )}
          </button>

          {/* Help Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-1.5 sm:p-2 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-neutral-300 shadow-[2px_2px_0px_#000] transition-colors cursor-pointer rounded-none"
            title="Rules & Keybindings (?)"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
          </button>

          {/* 3-Dot Settings Menu Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 sm:p-2 bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-700 text-neutral-300 shadow-[2px_2px_0px_#000] transition-colors cursor-pointer rounded-none"
            title="Game Settings: Mode, Speed, Theme"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" viewBox="0 0 16 16" fill="currentColor">
              <rect x="6" y="2" width="4" height="3" />
              <rect x="6" y="7" width="4" height="3" />
              <rect x="6" y="12" width="4" height="3" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Arcade Panel (Pure Web Game Interface — sharp corners throughout) */}
      <main className={`w-full ${gridWidth === gridHeight ? 'max-w-[480px] sm:max-w-[840px]' : 'max-w-[840px]'} flex-1 min-h-0 flex flex-col items-center justify-between sm:justify-center`}>
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

        {/* Dot-Matrix LCD Canvas */}
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
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          onStartOrRestart={() => {
            if (gameState === 'IDLE' || gameState === 'GAME_OVER') {
              startGame()
            }
          }}
          onTogglePause={togglePause}
          onDirection={changeDirection}
        />

        {/* Tactile Sharp Rectangular D-Pad Controller (Mobile only — completely hidden on PC) */}
        <div className="sm:hidden w-full shrink-0 mt-0.5 sm:mt-2">
          <Controls
            dpadOnly={true}
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
      </main>

      {/* Footer / Arcade Specs (Clean on PC, hidden on mobile) */}
      <footer className="hidden sm:flex w-full max-w-[840px] border-t-2 border-neutral-800 pt-3 mt-4 flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500 font-pixel tracking-wider shrink-0">
        <div>
          SYNTHESIZED WEB AUDIO API • 9 SPEED LEVELS • BONUS BUG ENGINE
        </div>
        <div>
          KEYBOARD: [ARROWS/WASD] STEER • [SPACE] PAUSE • [F] FULLSCREEN • [ENTER] RESTART
        </div>
      </footer>

      {/* Operations Manual Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* 3-Dot Settings Modal (Mode, Speed, Theme) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentMode={gameMode}
        onSelectMode={selectGameMode}
        speedLevel={speedLevel}
        onSelectSpeed={selectSpeedLevel}
        currentPalette={currentPaletteId}
        onSelectPalette={setCurrentPaletteId}
        onOpenHelp={() => {
          setIsSettingsOpen(false)
          setIsHelpOpen(true)
        }}
      />
    </div>
  )
}

export default App
