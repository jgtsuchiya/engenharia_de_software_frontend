import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['@rc-component/util'],
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
})
