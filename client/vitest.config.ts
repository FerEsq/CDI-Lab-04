import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.type.ts',
        '**/*.css',
        '*.css',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/index.css',
        'src/App.css',
        'src/navigations/', // Routing config
        'src/store/store.ts', // Redux store config
        'src/store/api/types.ts', // Type definitions
        'src/store/middleware/', // Middleware
        'src/store/api/api-slice.ts', // API auto-generated
        'src/pages/Files.tsx', // Complex UI logic
        'src/pages/Verify.tsx', // Complex verification logic  
      ],
      include: ['src/**/*.{ts,tsx}'], // Solo incluir código fuente
      all: false, // No incluir archivos no importados
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});


