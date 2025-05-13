import vue from '@vitejs/plugin-vue';
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  root: 'resources/js', // Your source code directory
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
    },
  },
  build: {
    outDir: '../../public/build', // Where to output compiled files
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'resources/js/p2q.js'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});