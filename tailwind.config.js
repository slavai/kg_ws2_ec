/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Cyberpunk font families
      fontFamily: {
        'cyber': ['var(--font-family-cyber)', 'Orbitron', 'Courier New', 'monospace'],
        'mono': ['var(--font-family-mono)', 'Fira Code', 'JetBrains Mono', 'monospace'],
      },
      
      // Animation extensions for cyberpunk effects
      animation: {
        'glitch': 'glitch 0.3s ease-in-out infinite alternate',
        'glitch-text': 'glitch-text 2s ease-in-out infinite',
        'data-stream': 'data-stream 3s linear infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'cyber-scan': 'cyber-scan 3s linear infinite',
      },
      
      keyframes: {
        'glitch': {
          '0%': { 
            transform: 'translate(0)',
            filter: 'hue-rotate(0deg)' 
          },
          '20%': { 
            transform: 'translate(-2px, 2px)',
            filter: 'hue-rotate(90deg)' 
          },
          '40%': { 
            transform: 'translate(-2px, -2px)',
            filter: 'hue-rotate(180deg)' 
          },
          '60%': { 
            transform: 'translate(2px, 2px)',
            filter: 'hue-rotate(270deg)' 
          },
          '80%': { 
            transform: 'translate(2px, -2px)',
            filter: 'hue-rotate(360deg)' 
          },
          '100%': { 
            transform: 'translate(0)',
            filter: 'hue-rotate(0deg)' 
          },
        },
        
        'glitch-text': {
          '0%, 100%': { 
            textShadow: '0 0 5px var(--color-neon-cyan), 0 0 10px var(--color-neon-cyan)'
          },
          '25%': {
            textShadow: '-2px 0 var(--color-glitch-red), 2px 0 var(--color-glitch-blue)'
          },
          '50%': {
            textShadow: '2px 0 var(--color-glitch-red), -2px 0 var(--color-glitch-blue)'
          },
          '75%': {
            textShadow: '0 -2px var(--color-glitch-red), 0 2px var(--color-glitch-blue)'
          },
        },
        
        'data-stream': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '10%': {
            opacity: '1'
          },
          '90%': {
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(100vh)',
            opacity: '0'
          },
        },
        
        'neon-pulse': {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor'
          },
          '100%': { 
            boxShadow: '0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor'
          },
        },
        
        'cyber-scan': {
          '0%': {
            transform: 'translateY(-100%)'
          },
          '100%': {
            transform: 'translateY(100vh)'
          },
        },
      },
      
      // Custom spacing for cyberpunk design
      spacing: {
        'cyber': '0.125rem',
      },
      
      // Sharp corners for cyberpunk aesthetic
      borderRadius: {
        'cyber': '2px',
      },
      
      // Custom shadows for glow effects
      boxShadow: {
        'neon-cyan': '0 0 20px var(--color-neon-cyan)',
        'neon-pink': '0 0 20px var(--color-neon-pink)',
        'neon-purple': '0 0 20px var(--color-neon-purple)',
        'neon-yellow': '0 0 20px var(--color-neon-yellow)',
        'neon-green': '0 0 20px var(--color-neon-green)',
        'cyber-border': 'inset 0 0 0 1px var(--color-neon-cyan)',
      },
      
      // Text shadows for neon effects
      textShadow: {
        'neon-cyan': '0 0 10px var(--color-neon-cyan)',
        'neon-pink': '0 0 10px var(--color-neon-pink)',
        'neon-purple': '0 0 10px var(--color-neon-purple)',
        'glitch': '-2px 0 var(--color-glitch-red), 2px 0 var(--color-glitch-blue)',
      },
      
      // Custom gradient stops for cyberpunk gradients
      gradientColorStops: {
        'cyber-gradient': {
          '0%': 'var(--color-cyber-black)',
          '50%': 'var(--color-cyber-dark)',
          '100%': 'var(--color-cyber-gray)',
        }
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    
    // Custom plugin for cyberpunk utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Neon glow utilities
        '.neon-glow-cyan': {
          boxShadow: `0 0 5px var(--color-neon-cyan), 
                      0 0 10px var(--color-neon-cyan), 
                      0 0 15px var(--color-neon-cyan), 
                      0 0 20px var(--color-neon-cyan)`,
        },
        '.neon-glow-pink': {
          boxShadow: `0 0 5px var(--color-neon-pink), 
                      0 0 10px var(--color-neon-pink), 
                      0 0 15px var(--color-neon-pink), 
                      0 0 20px var(--color-neon-pink)`,
        },
        '.neon-glow-purple': {
          boxShadow: `0 0 5px var(--color-neon-purple), 
                      0 0 10px var(--color-neon-purple), 
                      0 0 15px var(--color-neon-purple), 
                      0 0 20px var(--color-neon-purple)`,
        },
        
        // Neon text utilities
        '.neon-text-cyan': {
          color: 'var(--color-neon-cyan)',
          textShadow: `0 0 5px var(--color-neon-cyan), 
                       0 0 10px var(--color-neon-cyan), 
                       0 0 15px var(--color-neon-cyan)`,
        },
        '.neon-text-pink': {
          color: 'var(--color-neon-pink)',
          textShadow: `0 0 5px var(--color-neon-pink), 
                       0 0 10px var(--color-neon-pink), 
                       0 0 15px var(--color-neon-pink)`,
        },
        
        // Glitch effects
        '.glitch': {
          animation: 'glitch 0.3s ease-in-out infinite alternate',
        },
        '.glitch-text': {
          animation: 'glitch-text 2s ease-in-out infinite',
        },
        '.glitch-hover:hover': {
          animation: 'glitch 0.3s ease-in-out infinite alternate',
        },
        
        // Cyberpunk borders
        '.cyber-border': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '-2px',
            background: 'linear-gradient(45deg, var(--color-neon-cyan), var(--color-neon-pink), var(--color-neon-purple), var(--color-neon-cyan))',
            borderRadius: 'inherit',
            padding: '2px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            opacity: '0',
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: '1',
          },
        },
        
        // Scanlines effect
        '.scanlines': {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '0',
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 255, 0.03) 2px,
              rgba(0, 255, 255, 0.03) 4px
            )`,
            pointerEvents: 'none',
            zIndex: '1',
          },
        },
        
        // CRT screen effect
        '.crt-screen': {
          position: 'relative',
          background: 'var(--color-cyber-black)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            background: `
              radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.3) 100%),
              repeating-linear-gradient(
                0deg,
                rgba(0, 255, 255, 0.05) 0px,
                transparent 1px,
                transparent 3px,
                rgba(0, 255, 255, 0.05) 4px
              )
            `,
            pointerEvents: 'none',
            zIndex: '1',
          },
        },
      }

      addUtilities(newUtilities)
    },
  ],
}
