import type { PaletteConfig, PaletteId } from '../types/game'

export const PALETTES: Record<PaletteId, PaletteConfig> = {
  'classic-green': {
    id: 'classic-green',
    name: 'Classic Green',
    subtitle: 'Nokia / Game Boy DMG',
    screenBg: '#879b29',
    pixelOff: 'rgba(15, 56, 15, 0.08)',
    pixelOn: '#0f380f',
    eyeColor: '#879b29',
    foodColor: '#0f380f',
    bugColor: '#0f380f',
    obstacleColor: '#0f380f',
    // >> Playable Game Area Border (frames the 28x18 active game grid) <<
    playableBorderColor: '#0f380f',
    // Chassis background for overall cabinet/page surrounding the console
    chassisBg: '#12140f',
    // Outer chassis bezel border (the frame surrounding the LCD display)
    bezelBorder: '#3b4329',
    accentColor: '#879b29'
  },
  'monochrome': {
    id: 'monochrome',
    name: 'Monochrome B&W',
    subtitle: 'Vintage Pocket LCD',
    screenBg: '#c3ccb5',
    pixelOff: 'rgba(20, 24, 18, 0.07)',
    pixelOn: '#151914',
    eyeColor: '#c3ccb5',
    foodColor: '#151914',
    bugColor: '#151914',
    obstacleColor: '#151914',
    playableBorderColor: '#151914',
    chassisBg: '#18191b',
    bezelBorder: '#42454a',
    accentColor: '#9ba393'
  },
  'cyber-amber': {
    id: 'cyber-amber',
    name: 'Cyber Amber',
    subtitle: 'Phosphor CRT Terminal',
    screenBg: '#1a0e02',
    pixelOff: 'rgba(255, 176, 0, 0.06)',
    pixelOn: '#ffb000',
    eyeColor: '#1a0e02',
    foodColor: '#ffb000',
    bugColor: '#ffd24d',
    obstacleColor: '#ffb000',
    playableBorderColor: '#ffb000',
    glow: '0 0 12px rgba(255, 176, 0, 0.45)',
    chassisBg: '#140c04',
    bezelBorder: '#523412',
    accentColor: '#ffb000'
  },
  'ice-blue': {
    id: 'ice-blue',
    name: 'Ice Blue',
    subtitle: 'Backlit Cobalt Matrix',
    screenBg: '#081724',
    pixelOff: 'rgba(0, 240, 255, 0.06)',
    pixelOn: '#00f0ff',
    eyeColor: '#081724',
    foodColor: '#00f0ff',
    bugColor: '#34d399',
    obstacleColor: '#00f0ff',
    playableBorderColor: '#00f0ff',
    glow: '0 0 12px rgba(0, 240, 255, 0.45)',
    chassisBg: '#081017',
    bezelBorder: '#1c3e5a',
    accentColor: '#00f0ff'
  }
}

export const DEFAULT_PALETTE: PaletteId = 'classic-green'
