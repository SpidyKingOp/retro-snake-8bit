// Web Audio API Synthesizer for Authentic 8-Bit Retro Sounds

class RetroAudioSynthesizer {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false
  private storageKey = 'retro_snake_muted'

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey)
      this.isMuted = saved === 'true'
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, String(muted))
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted)
    return this.isMuted
  }

  /**
   * Subtle 8-bit woodblock movement tick
   */
  public playMoveTick(): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.02)

      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.02)
    } catch {
      // Audio context might be restricted before first interaction
    }
  }

  /**
   * Classic two-tone bite chime (C5 -> E5)
   */
  public playEatChime(): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'square'
      // Note 1: C5 (523.25Hz)
      osc.frequency.setValueAtTime(523.25, now)
      // Note 2: E5 (659.25Hz)
      osc.frequency.setValueAtTime(659.25, now + 0.06)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.setValueAtTime(0.15, now + 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.15)
    } catch {}
  }

  /**
   * Rapid 4-note ascending arcade arpeggio for bonus bug pickup
   */
  public playBonusChime(): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      const stepDuration = 0.07

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const start = ctx.currentTime + idx * stepDuration

        osc.type = 'square'
        osc.frequency.setValueAtTime(freq, start)

        gain.gain.setValueAtTime(0.18, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + stepDuration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + stepDuration)
      })
    } catch {}
  }

  /**
   * Chirping announcement when a bonus bug appears
   */
  public playBonusSpawn(): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(587.33, now) // D5
      osc.frequency.setValueAtTime(880.00, now + 0.08) // A5

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.18)
    } catch {}
  }

  /**
   * Harsh collision buzz
   */
  public playCrash(): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(180, now)
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.22)

      gain.gain.setValueAtTime(0.25, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.24)
    } catch {}
  }

  /**
   * Sad 4-note descending 8-bit game over cadence
   */
  public playGameOver(): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      // G4, F4, E4, C4
      const notes = [392.00, 349.23, 329.63, 261.63]
      const stepDuration = 0.16

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const start = ctx.currentTime + idx * stepDuration
        const duration = idx === notes.length - 1 ? 0.35 : stepDuration

        osc.type = 'square'
        osc.frequency.setValueAtTime(freq, start)

        gain.gain.setValueAtTime(0.16, start)
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(start)
        osc.stop(start + duration)
      })
    } catch {}
  }

  /**
   * Tactile button press blip
   */
  public playButtonClick(): void {
    if (this.isMuted) return
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(900, ctx.currentTime)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.03)
    } catch {}
  }
}

export const soundManager = new RetroAudioSynthesizer()
