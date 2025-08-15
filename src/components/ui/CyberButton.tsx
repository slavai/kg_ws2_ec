'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon' | 'glitch' | 'minimal' | 'outline'
  color?: 'cyan' | 'pink' | 'purple' | 'yellow' | 'green'
  size?: 'sm' | 'md' | 'lg'
  glowOnHover?: boolean
  children: React.ReactNode
}

const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(({
  className,
  variant = 'neon',
  color = 'cyan',
  size = 'md',
  glowOnHover = true,
  children,
  disabled,
  ...props
}, ref) => {
  const baseClasses = "relative font-bold uppercase tracking-wider transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-black disabled:opacity-50 disabled:cursor-not-allowed"
  
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  }
  
  const colorClasses = {
    cyan: {
      text: "text-neon-cyan",
      border: "border-neon-cyan",
      focus: "focus:ring-neon-cyan",
      glow: "hover:neon-glow-cyan"
    },
    pink: {
      text: "text-neon-pink", 
      border: "border-neon-pink",
      focus: "focus:ring-neon-pink",
      glow: "hover:neon-glow-pink"
    },
    purple: {
      text: "text-neon-purple",
      border: "border-neon-purple", 
      focus: "focus:ring-neon-purple",
      glow: "hover:neon-glow-purple"
    },
    yellow: {
      text: "text-neon-yellow",
      border: "border-neon-yellow",
      focus: "focus:ring-neon-yellow", 
      glow: "hover:shadow-[0_0_20px_var(--color-neon-yellow)]"
    },
    green: {
      text: "text-neon-green",
      border: "border-neon-green",
      focus: "focus:ring-neon-green",
      glow: "hover:shadow-[0_0_20px_var(--color-neon-green)]"
    }
  }
  
  const variantClasses = {
    neon: `bg-cyber-dark border ${colorClasses[color].border} ${colorClasses[color].text} hover:scale-105`,
    outline: `bg-transparent border ${colorClasses[color].border} ${colorClasses[color].text} hover:bg-cyber-dark hover:scale-105`,
    minimal: `bg-transparent ${colorClasses[color].text} hover:bg-cyber-dark hover:scale-105 border-none`,
    glitch: `bg-cyber-dark border ${colorClasses[color].border} ${colorClasses[color].text} hover:glitch hover:scale-105`
  }
  
  const glowClass = glowOnHover && !disabled ? colorClasses[color].glow : ""
  
  // Cyberpunk clip-path for angled corners
  const clipPath = variant !== 'minimal' ? "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)" : "none"
  
  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        colorClasses[color].focus,
        glowClass,
        className
      )}
      style={{ clipPath }}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Animated background effect */}
      {variant === 'neon' && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 hover:opacity-10 transition-opacity duration-300"
          style={{ clipPath }}
        />
      )}
    </button>
  )
})

CyberButton.displayName = "CyberButton"

export { CyberButton }
export type { CyberButtonProps }
