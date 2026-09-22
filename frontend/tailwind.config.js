/** @type {import('tailwindcss').Config} */.
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void:    '#04070f',
        deep:    '#070d1a',
        panel:   '#0a1220',
        card:    '#0d1829',
        elevated:'#111f35',
        hover:   '#162440',
        border:  '#142035',
        'border-bright': '#1e3550',

        green:  { DEFAULT: '#00ff9d', dim: '#00cc7a', dark: '#006633' },
        blue:   { DEFAULT: '#0088ff', dim: '#0066cc' },
        purple: { DEFAULT: '#7c5cfc', dim: '#5a3ed4' },
        red:    { DEFAULT: '#ff3b5c', dim: '#cc2240' },
        amber:  { DEFAULT: '#ffaa00', dim: '#cc8800' },
      },
      fontFamily: {
        sans:  ['Rajdhani', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'ticker':   'scrollTicker 40s linear infinite',
        'pulse-dot':'pulseDot 1.5s ease-in-out infinite',
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        scrollTicker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '0.4', transform: 'scale(0.85)' },
        },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
