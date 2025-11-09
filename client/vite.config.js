import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".", // this ensures vite looks in client/
  build: {
    outDir: "../server/public", // build output goes into server/public
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
