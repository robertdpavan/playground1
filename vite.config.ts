import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    // Expose the dev server on your LAN so other devices (e.g. your phone
    // on the same Wi-Fi) can reach it via the printed Network URL.
    host: true,
  },
})
