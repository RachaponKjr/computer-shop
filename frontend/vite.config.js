import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  preview: {
    port: 3011,
    strictPort: true,
  },
  server: {
    port: 3011,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:3011",
  },
  plugins: [react()],
})
