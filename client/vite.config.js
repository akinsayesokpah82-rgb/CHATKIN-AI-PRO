import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Vite config for ChatKin AI
export default defineConfig({
  plugins: [react()],
  build: {
    // Output frontend build directly inside the backend public folder
    outDir: '../server/public',
    emptyOutDir: true,
  },
  server: {
    // Allow local dev to talk to backend
    proxy: {
      '/api': 'http://localhost:10000',
    },
  },
});
