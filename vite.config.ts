import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative paths for static file server compatibility
  base: "/",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // Properly handle SVGs
  assetsInclude: ["**/*.svg"],
  // Copy staticwebapp.config.json to dist folder
  publicDir: "public",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          "fluent-ui": ["@fluentui/react-components", "@fluentui/react-icons"],
        },
      },
    },
  },
});
