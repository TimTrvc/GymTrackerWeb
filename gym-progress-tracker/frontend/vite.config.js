
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

/**
 * Vite configuration for the frontend project.
 * - Sets up path alias for '@/src'.
 * - Adds React and Tailwind CSS plugins.
 * @see {@link https://vite.dev/config/}
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
});
