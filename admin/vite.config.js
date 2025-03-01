import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  preview: {
    port: 3010,
    strictPort: true,
  },
  server: {
    port: 3010,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:3010",
  },
});
