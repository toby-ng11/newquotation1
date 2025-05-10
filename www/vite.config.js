import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: 'resources/js', // Your source code directory
  build: {
    outDir: '../../public/build/assets', // Where to output compiled files
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