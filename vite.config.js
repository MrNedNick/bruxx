import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages serves the site from /<repo>/; local dev stays at /.
// Override with BASE_PATH=/ when the site moves to its own domain.
export default defineConfig(({ command, isPreview }) => ({
  base: process.env.BASE_PATH ?? (command === 'build' || isPreview ? '/bruxx/' : '/'),
  plugins: [vue()],
  test: { environment: 'jsdom' },
}))
