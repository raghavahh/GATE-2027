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
        dark: {
          bg: '#090909',
          surface: '#101010',
          elevated: '#161616',
          highlight: '#1C1C1C',
          border: '#202020',
          borderSubtle: '#1B1B1B',
          borderActive: '#333333',
        },
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          subtle: 'rgba(59, 130, 246, 0.12)',
        },
        gate: {
          primary: '#F5F5F5',
          secondary: '#8A8A8A',
          muted: '#5A5A5A',
          dim: '#383838',
        },
        status: {
          notStarted: '#404040',
          learning: '#3B82F6',
          practicing: '#F59E0B',
          strong: '#8B5CF6',
          mastered: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
