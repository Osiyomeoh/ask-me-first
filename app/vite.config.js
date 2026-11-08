import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// In dev, /api goes to the Node server (live on 3002 by default; API_PORT=3001 for sample mode).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy: { "/api": `http://localhost:${process.env.API_PORT || 3002}` } },
});
