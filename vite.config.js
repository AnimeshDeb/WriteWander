import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'src/App.jsx',
      external: ['react-router-dom'],
    },
    outDir: 'dist',
    assetsDir: 'static',
  },
  server: {
    port: 3000,
    cors: true
  }
});