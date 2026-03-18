import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/3DUniverse/', // GitHub 仓库名称，如果仓库名不同需要修改
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
