import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Node >=22's experimental Web Storage API defines a `localStorage`
    // global that throws "not available" without --localstorage-file. That
    // shadows jsdom's own window.localStorage, since jsdom only installs its
    // polyfill when the global is absent. Disable it so jsdom's wins.
    execArgv: ['--no-experimental-webstorage'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        statements: 85,
        branches: 75,
        functions: 85,
        lines: 85,
        'src/engine/**': {
          statements: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
  },
});
