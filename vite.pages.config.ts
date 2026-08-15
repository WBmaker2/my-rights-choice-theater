import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "pages",
  base: "/my-rights-choice-theater/",
  plugins: [react()],
  build: {
    outDir: "../dist-pages",
    emptyOutDir: true,
  },
});
