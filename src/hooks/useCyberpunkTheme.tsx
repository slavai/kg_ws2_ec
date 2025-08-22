'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { cyberpunkColors, cyberpunkEffects, generateDataStreamPosition } from '@/lib/utils'

export type CyberpunkThemeMode = 'cyberpunk' | 'normal'
export type NeonColor = keyof typeof cyberpunkColors.neon

interface CyberpunkThemeConfig {
  mode: CyberpunkThemeMode
  primaryColor: NeonColor
  secondaryColor: NeonColor
  accentColor: NeonColor
  glitchIntensity: number
  dataStreams: boolean
  scanlines: boolean
  crtEffect: boolean
}

const defaultConfig: CyberpunkThemeConfig = {
  mode: 'cyberpunk',
  primaryColor: 'cyan',
  secondaryColor: 'pink', 
  accentColor: 'purple',
  glitchIntensity: 0.3,
  dataStreams: true,
  scanlines: true,
  crtEffect: false
}

export const useCyberpunkTheme = (initialConfig?: Partial<CyberpunkThemeConfig>) => {
  const [config, setConfig] = useState<CyberpunkThemeConfig>({
    ...defaultConfig,
    ...initialConfig
  })
  
  const [dataStreams, setDataStreams] = useState<Array<{
    id: string
    style: React.CSSProperties
  }>>([])

  // Generate data streams
  const generateDataStreams = useCallback(() => {
    if (!config.dataStreams) return
    
    const streams = Array.from({ length: 5 }, (_, i) => ({
      id: `stream-${i}`,
      style: {
        ...generateDataStreamPosition(),
        zIndex: -1
      }
    }))
    
    setDataStreams(streams)
  }, [config.dataStreams])

  // Apply cyberpunk theme to document
  const applyCyberpunkTheme = useCallback(() => {
    const root = document.documentElement
    
    // Apply CSS variables
    root.style.setProperty('--cyberpunk-primary', `var(--color-neon-${config.primaryColor})`)
    root.style.setProperty('--cyberpunk-secondary', `var(--color-neon-${config.secondaryColor})`)
    root.style.setProperty('--cyberpunk-accent', `var(--color-neon-${config.accentColor})`)
    root.style.setProperty('--glitch-intensity', config.glitchIntensity.toString())
    
    // Add/remove body classes
    if (config.mode === 'cyberpunk') {
      document.body.classList.add('cyberpunk-mode')
      if (config.scanlines) document.body.classList.add('scanlines')
      if (config.crtEffect) document.body.classList.add('crt-screen')
    } else {
      document.body.classList.remove('cyberpunk-mode', 'scanlines', 'crt-screen')
    }
    
    generateDataStreams()
  }, [config, generateDataStreams])

  // Theme utilities
  const getThemeClasses = useCallback((element: 'button' | 'card' | 'input' | 'text') => {
    if (config.mode !== 'cyberpunk') return ''
    
    const baseClasses: Record<string, string> = {
      button: `bg-cyber-dark border-${cyberpunkColors.neon[config.primaryColor]} text-${cyberpunkColors.neon[config.primaryColor]}`,
      card: `bg-cyber-dark border-cyber-medium hover:border-${cyberpunkColors.neon[config.primaryColor]}`,
      input: `bg-cyber-dark border-cyber-medium text-${cyberpunkColors.neon[config.primaryColor]} focus:border-${cyberpunkColors.neon[config.primaryColor]}`,
      text: `text-${cyberpunkColors.neon[config.primaryColor]}`
    }
    
    return baseClasses[element] || ''
  }, [config])

  const getGlowEffect = useCallback((color?: NeonColor) => {
    if (config.mode !== 'cyberpunk') return ''
    const glowColor = color || config.primaryColor
    return cyberpunkEffects.glow[glowColor as keyof typeof cyberpunkEffects.glow] || ''
  }, [config])

  // Glitch text effect
  const applyGlitchText = useCallback((text: string, intensity?: number) => {
    if (config.mode !== 'cyberpunk') return text
    
    const glitchChars = '!@#$%^&*(){}[]|\\:;"\'<>,.?/~`█▓▒░'
    const effectIntensity = intensity || config.glitchIntensity
    
    if (Math.random() > 1 - effectIntensity) {
      return text
        .split('')
        .map(char => {
          if (Math.random() > 0.85 && char !== ' ') {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          }
          return char
        })
        .join('')
    }
    
    return text
  }, [config])

  // Theme switcher
  const toggleTheme = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      mode: prev.mode === 'cyberpunk' ? 'normal' : 'cyberpunk'
    }))
  }, [])

  const updateThemeConfig = useCallback((newConfig: Partial<CyberpunkThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }, [])

  // Color palette for current theme
  const palette = {
    primary: cyberpunkColors.neon[config.primaryColor],
    secondary: cyberpunkColors.neon[config.secondaryColor], 
    accent: cyberpunkColors.neon[config.accentColor],
    background: cyberpunkColors.cyber.black,
    surface: cyberpunkColors.cyber.dark,
    text: cyberpunkColors.neon[config.primaryColor]
  }

  // Apply theme on config changes
  useEffect(() => {
    applyCyberpunkTheme()
  }, [applyCyberpunkTheme])

  // Auto-regenerate data streams periodically
  useEffect(() => {
    if (!config.dataStreams) return
    
    const interval = setInterval(generateDataStreams, 8000)
    return () => clearInterval(interval)
  }, [generateDataStreams, config.dataStreams])

  return {
    config,
    palette,
    dataStreams,
    
    // Theme functions
    toggleTheme,
    updateThemeConfig,
    applyCyberpunkTheme,
    
    // Utility functions  
    getThemeClasses,
    getGlowEffect,
    applyGlitchText,
    
    // Theme state
    isCyberpunkMode: config.mode === 'cyberpunk',
    
    // Pre-built class combinations
    buttonClasses: `${getThemeClasses('button')} hover:${getGlowEffect()} transition-all duration-300`,
    cardClasses: `${getThemeClasses('card')} hover:${getGlowEffect()} transition-all duration-300`,
    inputClasses: `${getThemeClasses('input')} focus:${getGlowEffect()} transition-all duration-300`
  }
}

// React component for data streams
export const CyberpunkDataStreams: React.FC<{
  streams: Array<{ id: string; style: React.CSSProperties }>
}> = ({ streams }) => {
  return (
    <React.Fragment>
      {streams.map((stream) => (
        <div
          key={stream.id}
          className="data-stream"
          style={stream.style}
        />
      ))}
    </React.Fragment>
  )
}

// Higher-order component for cyberpunk theming
export const withCyberpunkTheme = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function CyberpunkThemedComponent(props: P) {
    const theme = useCyberpunkTheme()
    
    return (
      <div className={theme.isCyberpunkMode ? 'cyberpunk-container' : ''}>
        {theme.dataStreams.length > 0 && (
          <CyberpunkDataStreams streams={theme.dataStreams} />
        )}
        <Component {...props} />
      </div>
    )
  }
}
