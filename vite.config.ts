import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // plugins: [vue(), vueDevTools(), tailwindcss()],
  plugins: [vue(), tailwindcss()],
  server: {
    port: 3000,
    host: true, // Allows access from other devices on the network
    strictPort: true, // Ensures the server will not start if the port is already in use
    open: false, // Opens the browser automatically
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/wedemarkteamopen/2025'),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
