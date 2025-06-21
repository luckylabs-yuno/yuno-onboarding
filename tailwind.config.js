/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Yuno Dark Theme Brand Colors
        yuno: {
          'blue-primary': '#2563eb',
          'blue-light': '#3b82f6',
          'blue-dark': '#1d4ed8',
          'cyan-primary': '#06b6d4',
          'cyan-light': '#22d3ee',
          'cyan-dark': '#0891b2',
        },
        // Background Colors
        'yuno-bg': {
          'primary': '#111827',
          'secondary': '#1f2937',
          'tertiary': '#0f172a',
        },
        // Text Colors
        'yuno-text': {
          'primary': '#ffffff',
          'secondary': '#e5e7eb',
          'muted': '#9ca3af',
          'placeholder': '#6b7280',
        },
        // Status Colors
        'yuno-success': {
          'primary': '#10b981',
          'light': '#34d399',
        },
        'yuno-warning': {
          'primary': '#f59e0b',
          'light': '#fbbf24',
        },
        'yuno-error': {
          'primary': '#ef4444',
          'light': '#f87171',
        },
      },
      backgroundImage: {
        'yuno-gradient-main': 'linear-gradient(to right, #2563eb, #06b6d4)',
        'yuno-gradient-hover': 'linear-gradient(to right, #1d4ed8, #0891b2)',
        'yuno-gradient-hero': 'linear-gradient(to bottom right, #111827, #1e293b, #1e3a8a)',
        'yuno-gradient-section': 'linear-gradient(to bottom right, #1f2937, #374151, #4b5563)',
        'yuno-gradient-icon': 'linear-gradient(to bottom right, #3b82f6, #22d3ee)',
        'yuno-gradient-text': 'linear-gradient(to right, #60a5fa, #22d3ee)',
      },
      backdropBlur: {
        'yuno': '20px',
      },
      boxShadow: {
        'yuno-glass': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'yuno-glass-hover': '0 25px 50px -12px rgba(37, 99, 235, 0.3)',
        'yuno-primary': 'rgba(37, 99, 235, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}