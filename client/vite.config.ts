import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // NUNCA exponer a la red en desarrollo
    host: false, // Solo localhost
    port: 5173,
    strictPort: true,
    
    // Configuración estricta de sistema de archivos
    fs: {
      strict: true,
      
      // Solo permitir acceso a directorios específicos
      allow: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'public'),
        path.resolve(__dirname, 'node_modules')
      ],
      
      // Denegar acceso a archivos sensibles
      deny: [
        '**/.env',
        '**/.env.*',
        '**/.*',
        '**/*.{key,pem,crt,p12}',
        '**/config/**',
        '/etc/**',
        '/var/**',
        '/home/**',
        '../**'
      ]
    }
  },
  
  // Configuración para preview server
  preview: {
    host: false,
    port: 4173,
    strictPort: true,
    
    // Aplicar mismas restricciones de fs
    fs: {
      strict: true,
      allow: [
        path.resolve(__dirname, 'dist')
      ]
    }
  }
})