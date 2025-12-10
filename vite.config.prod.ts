import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Production-specific Vite config
export default defineConfig({
  plugins: [react()],
  // Ensure staticwebapp.config.json is copied to dist folder
  publicDir: "public",
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: undefined, // Let Vite handle chunk splitting
      },
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  base: "/", // Adjust if deploying to a sub-path
});
