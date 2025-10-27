import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://www.duolingo.com/2017-06-30",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
        headers: { "User-Agent": "Mozilla/5.0" },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
