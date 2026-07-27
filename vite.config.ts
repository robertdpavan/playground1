import { defineConfig, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { execSync } from 'node:child_process'

// Build version: git short SHA when available, else a timestamp fallback.
function resolveVersion(): string {
  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
  } catch {
    return `dev-${Date.now()}`
  }
}

// Serves /version.json { version } — a dev middleware in `vite` and an emitted
// asset in `vite build` — so the running app (which bakes in __APP_VERSION__)
// can compare against the deployed version. Both use the SAME version value.
function versionManifest(version: string): Plugin {
  const body = JSON.stringify({ version })
  return {
    name: 'version-manifest',
    configureServer(server) {
      server.middlewares.use('/version.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        res.end(body)
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: body })
    },
  }
}

const APP_VERSION = resolveVersion()

// https://vite.dev/config/
export default defineConfig({
  define: {
    // Baked into the bundle; compared against /version.json at runtime.
    __APP_VERSION__: JSON.stringify(APP_VERSION),
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    versionManifest(APP_VERSION),
  ],
  server: {
    // Expose the dev server on your LAN so other devices (e.g. your phone
    // on the same Wi-Fi) can reach it via the printed Network URL.
    host: true,
  },
})
