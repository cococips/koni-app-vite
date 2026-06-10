import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// [PRESENTASI: ORANG 1] Import plugin Tailwind v4 untuk Vite
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    // [PRESENTASI: ORANG 1] Mendaftarkan plugin Tailwind di konfigurasi Vite
    tailwindcss(),
  ],
})