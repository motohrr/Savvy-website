import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: './resources/scripts/index.js',
      output: {
        entryFileNames: 'index.js'
      }
    },
    outDir: 'js'
  }
});
