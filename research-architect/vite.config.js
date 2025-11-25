import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Belangrijk: build voor subpad /game/ zodat assets kloppen onder /game/index.html
  base: '/game/',
  plugins: [react()],
})
