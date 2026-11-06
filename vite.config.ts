import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base: './' lets the site work from any GitHub Pages path (https://user.github.io/repo/).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
