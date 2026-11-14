import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Viteの設定
export default defineConfig({
  // ReactとTailwind CSSの両方を有効にする
  plugins: [react(), tailwindcss()],
})
