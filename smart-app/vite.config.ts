// smart-app/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: 'localhost', // 🟢 Ensures server binds to local network
    port: 5173,         // 🟢 Optional: Explicit port
    open: true,         // 🟢 Auto-open browser on dev start
    strictPort: true,   // 🟢 Fail if port is taken
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '/api'),
      },
    },
  },
});
