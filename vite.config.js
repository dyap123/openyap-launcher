import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from the GitHub Pages project subpath. `base` makes every emitted
// asset URL resolve under /openyap-launcher/. Public assets referenced from
// JSX must go through import.meta.env.BASE_URL (a bare /cars/x.png would 404).
export default defineConfig({
  base: '/openyap-launcher/',
  plugins: [react()],
  // No extra rollup inputs: public/core.html + public/diagnostics.html ride
  // along verbatim via the public/ folder — Vite never parses or rewrites them.
})
