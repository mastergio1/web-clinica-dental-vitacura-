import { defineConfig } from 'vite';

// Configuración mínima de Vite para un sitio estático vanilla.
// El entry point es index.html en la raíz.
export default defineConfig({
  build: {
    target: 'es2018',
    cssMinify: true,
  },
});
