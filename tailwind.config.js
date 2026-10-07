/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        page: v('page'),
        surface: v('surface'),
        raised: v('raised'),
        line: v('line'),
        ink: v('ink'),
        sub: v('sub'),
        mute: v('mute'),
        brand: v('brand'),
        'on-brand': v('on-brand'),
        easy: v('easy'),
        medium: v('medium'),
        hard: v('hard'),
        ok: v('ok'),
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"IBM Plex Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Consolas', 'monospace'],
      },
      borderRadius: { card: '12px' },
      maxWidth: { shell: '1200px', read: '720px' },
    },
  },
  plugins: [],
};
