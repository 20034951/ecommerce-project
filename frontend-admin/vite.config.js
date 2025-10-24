import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/modules": resolve(__dirname, "./src/modules"),
      "@/api": resolve(__dirname, "./src/api"),
      "@/auth": resolve(__dirname, "./src/auth"),
      "@/hooks": resolve(__dirname, "./src/hooks"),
      "@/utils": resolve(__dirname, "./src/utils"),
      "@/store": resolve(__dirname, "./src/store"),
      "@/layouts": resolve(__dirname, "./src/layouts"),
      "@/routes": resolve(__dirname, "./src/routes"),
    },
  },
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
      intrval: 1000,
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
