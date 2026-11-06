import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// base: './' lets the site work from any GitHub Pages path (https://user.github.io/repo/).
// `vite build --mode appsscript` makes the Google Apps Script build (no Firebase SDK).
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react()],
  define: mode === 'appsscript' ? { 'import.meta.env.VITE_BACKEND': JSON.stringify('appsscript') } : {},
  resolve: {
    alias:
      mode === 'appsscript'
        ? [{ find: /^\.\/firebase$/, replacement: fileURLToPath(new URL('./src/data/firebase-stub.ts', import.meta.url)) }]
        : [],
  },
  build: {
    outDir: mode === 'appsscript' ? 'dist-appsscript' : 'dist',
    chunkSizeWarningLimit: 1200,
  },
}))
