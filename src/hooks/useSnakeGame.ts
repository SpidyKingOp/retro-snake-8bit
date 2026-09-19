import { useState, useEffect, useRef, useCallback } from 'react'
import type { Direction, GameMode, GameState, Point, BonusBug } from '../types/game'
import { GRID_WIDTH, GRID_HEIGHT, getMazeObstacles, isObstacle } from '../constants/mazes'
import { getSpeedConfig, DEFAULT_SPEED_LEVEL } from '../constants/speeds'
import { soundManager } from '../utils/audio'
import { getHighScore, saveHighScore } from '../utils/storage'

const INITIAL_SNAKE: Point[] = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
  { x: 5, y: 9 },
]

export function useSnakeGame() {
  const [gameState, setGameState] = useState<GameState>('IDLE')
  const [gameMode, setGameMode] = useState<GameMode>('classic')
  const [speedLevel, setSpeedLevel] = useState<number>(DEFAULT_SPEED_LEVEL)
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE)
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [food, setFood] = useState<Point>({ x: 18, y: 9 })
  const [bonusBug, setBonusBug] = useState<BonusBug | null>(null)
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(() => getHighScore('classic'))
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false)
  const [foodCount, setFoodCount] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted())

  // References for fast tick access without closure staleness
  const directionRef = useRef<Direction>('RIGHT')
  const inputQueueRef = useRef<Direction[]>([])
  const snakeRef = useRef<Point[]>(INITIAL_SNAKE)
  const gameStateRef = useRef<GameState>('IDLE')
  const gameModeRef = useRef<GameMode>('classic')
  const speedLevelRef = useRef<number>(DEFAULT_SPEED_LEVEL)
  const foodRef = useRef<Point>({ x: 18, y: 9 })
  const bonusBugRef = useRef<BonusBug | null>(null)
  const scoreRef = useRef<number>(0)
  const foodCountRef = useRef<number>(0)
  const tickTimerRef = useRef<number | null>(null)
  const bugTimerRef = useRef<number | null>(null)

  // Keep refs synced with states
  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  useEffect(() => {
    snakeRef.current = snake
  }, [snake])

  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  useEffect(() => {
    gameModeRef.current = gameMode
    setHighScore(getHighScore(gameMode))
  }, [gameMode])

  useEffect(() => {
    speedLevelRef.current = speedLevel
  }, [speedLevel])

  useEffect(() => {
    foodRef.current = food
  }, [food])

  useEffect(() => {
    bonusBugRef.current = bonusBug
  }, [bonusBug])

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    foodCountRef.current = foodCount
  }, [foodCount])

  // Generate valid random location not overlapping snake, obstacles, or other items
  const generateRandomPosition = useCallback((
    currentSnake: Point[], 
    currentMode: GameMode, 
    extraObstacle?: Point | null
  ): Point => {
    const obstacles = getMazeObstacles(currentMode)
    const occupied = new Set<string>()

    currentSnake.forEach(p => occupied.add(`${p.x},${p.y}`))
    obstacles.forEach(p => occupied.add(`${p.x},${p.y}`))
    if (extraObstacle) {
      occupied.add(`${extraObstacle.x},${extraObstacle.y}`)
    }

    const available: Point[] = []
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_HEIGHT; y++) {
        if (!occupied.has(`${x},${y}`)) {
          available.push({ x, y })
        }
      }
    }

    if (available.length === 0) {
      return { x: 0, y: 0 } // Grid fully conquered
    }

    const randomIndex = Math.floor(Math.random() * available.length)
    return available[randomIndex]
  }, [])

  // Spawn bonus bug
  const spawnBonusBug = useCallback(() => {
    const bugPos = generateRandomPosition(snakeRef.current, gameModeRef.current, foodRef.current)
    const bug: BonusBug = {
      position: bugPos,
      spawnTime: Date.now(),
      durationMs: 8000,
      remainingMs: 8000,
      maxPoints: 500,
      currentPoints: 500
    }
    setBonusBug(bug)
    bonusBugRef.current = bug
    soundManager.playBonusSpawn()
  }, [generateRandomPosition])

  // End Game
  const triggerGameOver = useCallback(() => {
    setGameState('GAME_OVER')
    gameStateRef.current = 'GAME_OVER'
    soundManager.playCrash()

    const currentScore = scoreRef.current
    const currentMode = gameModeRef.current
    const isNewBest = saveHighScore(currentMode, currentScore)

    if (isNewBest) {
      setHighScore(currentScore)
      setIsNewHighScore(true)
    }

    // Delay sad tune slightly after collision buzz
    setTimeout(() => {
      soundManager.playGameOver()
    }, 280)

    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current)
      tickTimerRef.current = null
    }
  }, [])

  // Core Game Loop Tick
  const gameStep = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING') return

    // Consume next valid direction from queue
    let nextDir = directionRef.current
    while (inputQueueRef.current.length > 0) {
      const candidate = inputQueueRef.current.shift()!
      const isOpposite = 
        (candidate === 'UP' && nextDir === 'DOWN') ||
        (candidate === 'DOWN' && nextDir === 'UP') ||
        (candidate === 'LEFT' && nextDir === 'RIGHT') ||
        (candidate === 'RIGHT' && nextDir === 'LEFT')

      if (!isOpposite) {
        nextDir = candidate
        break
      }
    }

    setDirection(nextDir)
    directionRef.current = nextDir

    const head = snakeRef.current[0]
    let newX = head.x
    let newY = head.y

    switch (nextDir) {
      case 'UP': newY -= 1; break
      case 'DOWN': newY += 1; break
      case 'LEFT': newX -= 1; break
      case 'RIGHT': newX += 1; break
    }

    const currentMode = gameModeRef.current
    const obstacles = getMazeObstacles(currentMode)

    // Check Wall Collisions
    if (currentMode === 'no-walls') {
      newX = (newX + GRID_WIDTH) % GRID_WIDTH
      newY = (newY + GRID_HEIGHT) % GRID_HEIGHT
    } else {
      // Solid outer walls in Classic & Maze modes
      if (newX < 0 || newX >= GRID_WIDTH || newY < 0 || newY >= GRID_HEIGHT) {
        triggerGameOver()
        return
      }
    }

    // Check Maze Obstacle Collision
    if (isObstacle(newX, newY, obstacles)) {
      triggerGameOver()
      return
    }

    // Check Self-Collision (exclude tail tip if snake doesn't grow)
    const isEatingFood = newX === foodRef.current.x && newY === foodRef.current.y
    const checkLength = isEatingFood ? snakeRef.current.length : snakeRef.current.length - 1
    for (let i = 0; i < checkLength; i++) {
      if (snakeRef.current[i].x === newX && snakeRef.current[i].y === newY) {
        triggerGameOver()
        return
      }
    }

    const newHead: Point = { x: newX, y: newY }
    const newSnake = [newHead, ...snakeRef.current]

    // Play subtle movement tick
    soundManager.playMoveTick()

    // Check eating regular food
    if (isEatingFood) {
      soundManager.playEatChime()
      const pts = 10 * speedLevelRef.current
      const nextScore = scoreRef.current + pts
      setScore(nextScore)
      scoreRef.current = nextScore

      const nextFoodCount = foodCountRef.current + 1
      setFoodCount(nextFoodCount)
      foodCountRef.current = nextFoodCount

      // Spawn new regular food
      const newFoodPos = generateRandomPosition(newSnake, currentMode, bonusBugRef.current?.position)
      setFood(newFoodPos)
      foodRef.current = newFoodPos

      // Spawn bonus bug every 5 food items
      if (nextFoodCount % 5 === 0 && !bonusBugRef.current) {
        spawnBonusBug()
      }
    } else {
      // Normal movement: pop tail
      newSnake.pop()
    }

    // Check eating bonus bug
    if (bonusBugRef.current && newHead.x === bonusBugRef.current.position.x && newHead.y === bonusBugRef.current.position.y) {
      soundManager.playBonusChime()
      const bonusPts = bonusBugRef.current.currentPoints
      const nextScore = scoreRef.current + bonusPts
      setScore(nextScore)
      scoreRef.current = nextScore
      setBonusBug(null)
      bonusBugRef.current = null
    }

    setSnake(newSnake)
    snakeRef.current = newSnake
  }, [generateRandomPosition, spawnBonusBug, triggerGameOver])

  // Timer loop for game ticks
  useEffect(() => {
    if (gameState === 'PLAYING') {
      const { intervalMs } = getSpeedConfig(speedLevel)
      tickTimerRef.current = window.setInterval(() => {
        gameStep()
      }, intervalMs)
    } else {
      if (tickTimerRef.current) {
        clearInterval(tickTimerRef.current)
        tickTimerRef.current = null
      }
    }

    return () => {
      if (tickTimerRef.current) {
        clearInterval(tickTimerRef.current)
        tickTimerRef.current = null
      }
    }
  }, [gameState, speedLevel, gameStep])

  // Bonus Bug countdown timer loop
  useEffect(() => {
    if (gameState === 'PLAYING' && bonusBug) {
      bugTimerRef.current = window.setInterval(() => {
        setBonusBug(prev => {
          if (!prev) return null
          const elapsed = Date.now() - prev.spawnTime
          const remaining = Math.max(0, prev.durationMs - elapsed)
          if (remaining <= 0) {
            return null
          }
          const currentPoints = Math.max(50, Math.ceil((remaining / prev.durationMs) * prev.maxPoints))
          return {
            ...prev,
            remainingMs: remaining,
            currentPoints
          }
        })
      }, 100)
    } else {
      if (bugTimerRef.current) {
        clearInterval(bugTimerRef.current)
        bugTimerRef.current = null
      }
    }

    return () => {
      if (bugTimerRef.current) {
        clearInterval(bugTimerRef.current)
        bugTimerRef.current = null
      }
    }
  }, [gameState, bonusBug !== null])

  // Direction Input Handler with buffering
  const changeDirection = useCallback((newDir: Direction) => {
    // If game is IDLE, start game on first direction press
    if (gameStateRef.current === 'IDLE') {
      setGameState('PLAYING')
      gameStateRef.current = 'PLAYING'
    }

    if (gameStateRef.current !== 'PLAYING') return

    const lastQueued = inputQueueRef.current.length > 0 
      ? inputQueueRef.current[inputQueueRef.current.length - 1] 
      : directionRef.current

    const isOpposite = 
      (newDir === 'UP' && lastQueued === 'DOWN') ||
      (newDir === 'DOWN' && lastQueued === 'UP') ||
      (newDir === 'LEFT' && lastQueued === 'RIGHT') ||
      (newDir === 'RIGHT' && lastQueued === 'LEFT')

    if (!isOpposite && inputQueueRef.current.length < 2) {
      inputQueueRef.current.push(newDir)
      // Provide light haptic vibration if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(10) } catch {}
      }
    }
  }, [])

  // Start / Restart Game
  const startGame = useCallback(() => {
    const freshSnake = [...INITIAL_SNAKE]
    setSnake(freshSnake)
    snakeRef.current = freshSnake
    setDirection('RIGHT')
    directionRef.current = 'RIGHT'
    inputQueueRef.current = []
    setScore(0)
    scoreRef.current = 0
    setFoodCount(0)
    foodCountRef.current = 0
    setIsNewHighScore(false)
    setBonusBug(null)
    bonusBugRef.current = null

    const initialFood = generateRandomPosition(freshSnake, gameModeRef.current, null)
    setFood(initialFood)
    foodRef.current = initialFood

    setGameState('PLAYING')
    gameStateRef.current = 'PLAYING'
    soundManager.playButtonClick()
  }, [generateRandomPosition])

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (gameStateRef.current === 'PLAYING') {
      setGameState('PAUSED')
      gameStateRef.current = 'PAUSED'
      soundManager.playButtonClick()
    } else if (gameStateRef.current === 'PAUSED') {
      setGameState('PLAYING')
      gameStateRef.current = 'PLAYING'
      soundManager.playButtonClick()
    } else if (gameStateRef.current === 'IDLE' || gameStateRef.current === 'GAME_OVER') {
      startGame()
    }
  }, [startGame])

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const muted = soundManager.toggleMute()
    setIsMuted(muted)
  }, [])

  // Change Game Mode (resets game to IDLE)
  const selectGameMode = useCallback((mode: GameMode) => {
    soundManager.playButtonClick()
    setGameMode(mode)
    setHighScore(getHighScore(mode))
    const freshSnake = [...INITIAL_SNAKE]
    setSnake(freshSnake)
    snakeRef.current = freshSnake
    setDirection('RIGHT')
    directionRef.current = 'RIGHT'
    inputQueueRef.current = []
    setScore(0)
    scoreRef.current = 0
    setBonusBug(null)
    bonusBugRef.current = null
    const newFood = generateRandomPosition(freshSnake, mode, null)
    setFood(newFood)
    foodRef.current = newFood
    setGameState('IDLE')
    gameStateRef.current = 'IDLE'
  }, [generateRandomPosition])

  // Change Speed Level
  const selectSpeedLevel = useCallback((lvl: number) => {
    soundManager.playButtonClick()
    setSpeedLevel(Math.max(1, Math.min(9, lvl)))
  }, [])

  // Global Keyboard Controls (always active in windowed and fullscreen mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default page scrolling when steering or pausing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection('UP')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection('DOWN')
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection('LEFT')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection('RIGHT')
          break
        case ' ':
        case 'p':
        case 'P':
          togglePause()
          break
        case 'Enter':
          if (gameStateRef.current === 'GAME_OVER' || gameStateRef.current === 'IDLE') {
            startGame()
          } else {
            togglePause()
          }
          break
        case 'm':
        case 'M':
          toggleMute()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [changeDirection, togglePause, startGame, toggleMute])

  return {
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
    selectSpeedLevel
  }
}
