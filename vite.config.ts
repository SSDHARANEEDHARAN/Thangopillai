import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { birthdayAccess } from './vite-plugin-birthday-access.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), birthdayAccess()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
