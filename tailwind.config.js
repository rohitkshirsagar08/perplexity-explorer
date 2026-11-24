/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dev: {
          bg: '#0B1120',      // Deep darkish blue
          panel: '#0F172A',   // Slate 900
          card: '#1E293B',    // Slate 800
          border: '#334155',  // Slate 700
          text: '#F8FAFC',
          muted: '#94A3B8',
          accent: '#38BDF8',  // Sky 400
          blue: '#2563EB',    // Royal Blue 600
          cyan: '#06B6D4',
          emerald: '#10B981',
        },
        background: {
          main: '#0B1120',
          secondary: '#0F172A',
          card: '#1E293B',
        },
        accent: {
          primary: '#38BDF8',
          secondary: '#2563EB',
          highlight: '#60A5FA',
          cyan: '#06B6D4',
          mint: '#10B981',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        },
        status: {
          success: '#10B981',
          warning: '#FBBF24',
          danger: '#F87171',
        }
      },
      fontFamily: {
        sans: ['"JetBrains Mono"', 'Inter', 'system-ui', 'monospace', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-dev': '0 0 25px -4px rgba(56, 189, 248, 0.35)',
        'glow-blue': '0 0 25px -4px rgba(37, 99, 235, 0.4)',
        'dev-card': '0 10px 30px -5px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}
