import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'spa-404',
          closeBundle() {
            const outDir = resolve('dist')
            const html = readFileSync(join(outDir, 'index.html'), 'utf8')
            // 404.html 会被 GitHub Pages 用于任意深层路径，资源必须用绝对路径
            const fixed = html.replace(/(src|href)="\.\//g, '$1="/piano-studio/')
            writeFileSync(join(outDir, '404.html'), fixed)
          },
        },
      ],
    },
  },
})
