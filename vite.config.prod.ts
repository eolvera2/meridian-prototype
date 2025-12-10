import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Production-specific Vite config
export default defineConfig({
  plugins: [react()],
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
