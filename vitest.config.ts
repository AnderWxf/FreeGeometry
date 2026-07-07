// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // 👈 使用 jsdom 模拟浏览器环境
    // 指定测试文件匹配模式
    include: [
      'src/**/__tests__/**/*.{test,spec}.{ts,js}',
    ],
    // 排除某些目录
    exclude: [
      'node_modules',
      'dist',
      'build',
    ],
    // 全局 API
    globals: true,

    // 超时时间
    testTimeout: 10000,

  }

});