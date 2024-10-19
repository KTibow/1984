import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  base: "",
  root: "src",
  publicDir: "../static",
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
  plugins: [
    svelte({
      preprocess: [vitePreprocess()],
    }),
  ],
});
