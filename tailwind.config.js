/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aura: { purple: '#7C5CFC', blue: '#4B9FFF', cyan: '#00D4FF' },
        surface: { 1: '#0A0A0F', 2: '#111118', 3: '#16161F', 4: '#1C1C28' },
        sui: '#4B9FFF',
        walrus: '#7C5CFC'
      },
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow-ring': 'glowRing 3s ease-in-out infinite alternate',
        'orbit': 'orbit 6s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'tick': 'tick 1s ease-in-out infinite',
      },
      keyframes: {
        glowRing: { '0%': { filter: 'drop-shadow(0 0 8px rgba(124,92,252,0.6))' }, '100%': { filter: 'drop-shadow(0 0 25px rgba(124,92,252,1)) drop-shadow(0 0 50px rgba(124,92,252,0.4))' } },
        orbit: { '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' }, '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-10px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        tick: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } }
      }
    }
  },
  plugins: []
}
