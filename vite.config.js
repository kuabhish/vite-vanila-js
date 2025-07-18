import { defineConfig } from "vite";

export default defineConfig({
  root: ".", // Project root
  build: {
    outDir: "dist", // Output directory
    assetsDir: "assets", // Directory for assets like CSS
  },
  server: {
    open: true, // Open browser on dev server start
  },
  base: "/",
});
