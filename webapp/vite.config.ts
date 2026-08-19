import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL ?? 'http://127.0.0.1:8000'

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      proxy: {
        // La API no expone cabeceras CORS: el navegador habla con el mismo
        // origen y Vite reenvía /api al backend configurado en VITE_API_URL.
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
