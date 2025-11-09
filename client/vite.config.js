import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname), // make sure Vite starts from client folder
  build: {
    outDir: path.resolve(__dirname, "../server/public"), // build output goes to server/public
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
