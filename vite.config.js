// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Si vous appelez axios.post("/api/…"), Vite redirigera automatiquement vers http://localhost:8080/api/…
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        // rewrite n’est pas strictement nécessaire si vous gardez "/api" au début
        // rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
