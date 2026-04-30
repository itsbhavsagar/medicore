import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const compatModules = [
  'get',
  'isPlainObject',
  'last',
  'maxBy',
  'minBy',
  'omit',
  'range',
  'sortBy',
  'sumBy',
  'throttle',
  'uniqBy',
]

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: compatModules.map((moduleName) => ({
      find: `es-toolkit/compat/${moduleName}`,
      replacement: fileURLToPath(
        new URL(`./src/vendor/es-toolkit-compat/${moduleName}.js`, import.meta.url),
      ),
    })),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
