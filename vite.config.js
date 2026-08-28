import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Caminho base para publicação no GitHub Pages em
  // https://querenteixeira.github.io/book-app/. Em desenvolvimento o Vite
  // ignora esse valor, então `npm run dev` continua servindo na raiz.
  base: '/book-app/',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
})
