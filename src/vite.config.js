import { defineConfig } from 'vite'

//  Конфигурация для GitHub Pages
export default defineConfig({
  base: '/smart-table/', // Название твоего репозитория
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})