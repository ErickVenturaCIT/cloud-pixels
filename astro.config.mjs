// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    // Configuración para ISR si es necesario
    isr: {
      // Cache por defecto de 1 día
      expiration: 60 * 60 * 24,
    }
  }),
  // Configuración para assets estáticos
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    }
  }
});