import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  // Lee el .env.local para saber a qué URL proxy las llamadas /api y /uploads
  // En XAMPP: http://localhost/NombreDelProyecto  (sin barra al final)
  const env = loadEnv(mode, process.cwd(), '')
  const phpBase = env.VITE_PHP_BASE ?? 'http://localhost'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      port: 3000,
      proxy: {
        '/api':     { target: phpBase, changeOrigin: true },
        '/uploads': { target: phpBase, changeOrigin: true },
      },
    },
    build: { outDir: 'dist', sourcemap: false },
  }
})
