import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  clearScreen: false,

  server: {
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },

  plugins: [
    react(),
    tailwindcss(),
  ],
});