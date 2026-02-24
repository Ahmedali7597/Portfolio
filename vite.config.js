// Vite config - React plugin and base path for GitHub Pages

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // React plugin for JSX and hot reload
  plugins: [react()],
  
  base: '/Portfolio/',
})
