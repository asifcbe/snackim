import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Same proxy for `vite` (dev) and `vite preview` (production build), so /api works in both.
const proxy = {
  '/api': 'http://localhost:5003',
  '/uploads': 'http://localhost:5003'
};

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true, proxy },
  preview: { port: 4173, host: true, proxy }
});
