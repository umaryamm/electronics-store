import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Dev-time convenience: the Admin Dashboard is a separate Vite app
    // running on its own dev server (port 5174). This proxy makes
    // http://localhost:5173/admin transparently forward to it, so you can
    // type /admin in the SAME browser tab/address bar while both `npm run
    // dev` servers are running, without needing the production build.
    proxy: {
      '/admin': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        ws: true
      }
    }
  }
})
