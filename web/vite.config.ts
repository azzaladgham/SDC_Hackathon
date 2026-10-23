import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // dev: forward API calls to Role B's server (cd server && npm run dev)
  server: { proxy: { '/api': 'http://localhost:3001' } },
})