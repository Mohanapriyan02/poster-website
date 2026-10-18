import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './',
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
      '/images/posters': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
    },
  },
  define: {
    'import.meta.env.VITE_ENABLE_ADMIN': JSON.stringify(mode === 'public' ? 'false' : 'true'),
  },
}))


