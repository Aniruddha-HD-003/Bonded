/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          space: '#0a0a1a',
          deep: '#1a1a3a',
          mid: '#2a2a4a',
          light: '#3a3a5a',
          green: '#00ff88',
          'green-dark': '#00cc6a',
          blue: '#0088ff',
          purple: '#8b5cf6',
          silver: '#c0c0c0',
          white: '#e0e0e0',
          glow: 'rgba(0, 255, 136, 0.3)',
          shadow: 'rgba(0, 255, 136, 0.1)',
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'quantum-pulse': 'quantum-pulse 2s ease-in-out infinite',
        'quantum-float': 'quantum-float 3s ease-in-out infinite',
        'quantum-spin': 'quantum-spin 4s linear infinite',
        'quantum-glow': 'quantum-glow 2s ease-in-out infinite',
        'quantum-teleport': 'quantum-teleport 0.6s ease-in-out',
        'quantum-particles': 'quantum-particles 2s ease-out forwards',
        'gradient': 'gradient 3s ease infinite',
      },
      keyframes: {
        'quantum-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' }
        },
        'quantum-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'quantum-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        'quantum-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' },
          '50%': { boxShadow: '0 0 40px #00ff88' }
        },
        'quantum-teleport': {
          '0%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '0', transform: 'scale(0.8) rotate(180deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(360deg)' }
        },
        'quantum-particles': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(0)', opacity: '0' }
        },
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
} 