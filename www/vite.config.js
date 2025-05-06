import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "resources/js", // source files here
  build: {
    outDir: "../../public/build", // compiled output to public
    emptyOutDir: true,
    rollupOptions: {
      input: {
        p2q: path.resolve(__dirname, "resources/js/p2q.ts"),
        p2qInit: path.resolve(__dirname, "resources/js/p2q-init.ts"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
