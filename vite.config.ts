import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Absolute asset paths: pages live at real URLs like /cs/<topic>, not under #/.
  base: '/',
})
