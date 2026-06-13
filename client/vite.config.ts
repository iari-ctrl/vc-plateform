import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@data': fileURLToPath(new URL('../data', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Pin the framework (React + Router) into a stable, long-cached vendor
        // chunk so it survives app-code deploys. Everything else — content
        // collections, lucide icons — is left to Rollup's per-route splitting,
        // which now keeps each JSON collection out of the entry chunk.
        manualChunks(id) {
          if (
            /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)
          ) {
            return 'react-vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
    fs: {
      // allow importing JSON from the repo-root /data directory
      allow: ['..'],
    },
  },
});
