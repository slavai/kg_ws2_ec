import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cyberpunk theme utilities
export const cyberpunkColors = {
  neon: {
    cyan: 'neon-cyan',
    pink: 'neon-pink', 
    purple: 'neon-purple',
    yellow: 'neon-yellow',
    green: 'neon-green',
    blue: 'neon-blue',
    orange: 'neon-orange'
  },
  cyber: {
    black: 'cyber-black',
    dark: 'cyber-dark',
    gray: 'cyber-gray',
    medium: 'cyber-medium',
    light: 'cyber-light',
    lighter: 'cyber-lighter'
  },
  glitch: {
    red: 'glitch-red',
    blue: 'glitch-blue'
  }
} as const

export const cyberpunkEffects = {
  glow: {
    cyan: 'neon-glow-cyan',
    pink: 'neon-glow-pink',
    purple: 'neon-glow-purple'
  },
  text: {
    cyan: 'neon-text-cyan',
    pink: 'neon-text-pink'
  },
  glitch: 'glitch',
  glitchText: 'glitch-text',
  glitchHover: 'glitch-hover',
  scanlines: 'scanlines',
  crtScreen: 'crt-screen',
  cyberBorder: 'cyber-border-cyan',
  dataStream: 'data-stream'
} as const

// Random cyberpunk text effects
export const getRandomGlitchText = (text: string): string => {
  const glitchChars = '!@#$%^&*(){}[]|\\:;"\'<>,.?/~`'
  const shouldGlitch = Math.random() > 0.7
  
  if (!shouldGlitch) return text
  
  return text
    .split('')
    .map(char => {
      if (Math.random() > 0.9 && char !== ' ') {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)]
      }
      return char
    })
    .join('')
}

// Generate random data stream position
export const generateDataStreamPosition = () => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 3}s`,
  animationDuration: `${3 + Math.random() * 2}s`
})

// Color palette helper
export const getCyberpunkColor = (colorKey: string, shade?: string) => {
  if (shade) {
    return `var(--color-${colorKey}-${shade})`
  }
  return `var(--color-${colorKey})`
}

// Dynamic class generator for cyberpunk elements
export const createCyberpunkClasses = (
  element: 'button' | 'card' | 'input' | 'text',
  color: keyof typeof cyberpunkColors.neon = 'cyan',
  effects: (keyof typeof cyberpunkEffects)[] = []
) => {
  const baseClasses: Record<string, string> = {
    button: 'cyber-btn',
    card: 'cyber-card',
    input: 'bg-cyber-dark border border-cyber-medium text-neon-cyan',
    text: 'font-cyber'
  }
  
  const colorClass = `text-${cyberpunkColors.neon[color]} border-${cyberpunkColors.neon[color]}`
  const effectClasses = effects.map(effect => cyberpunkEffects[effect]).join(' ')
  
  return cn(baseClasses[element], colorClass, effectClasses)
}
