import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 解决本地开发跨域问题，本地开发时，前端Vue服务和后端Node服务启动在不同的端口上，不符合同源策略，因此会产生跨域问题
      '/reborn/api/': {
        target: 'http://127.0.0.1:2046',
        changeOrigin: true
      },
      // 解决本地开发时部分图片无法加载问题，数据库中存储的图片地址是针对生产环境的相对地址，本地没有这些图片，因此需要做个代理
      '/static/images/': {
        target: 'http://www.yigelangzi.com',
        changeOrigin: true
      }
    }
  }
})
