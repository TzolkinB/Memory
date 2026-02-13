import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic", // use automatic JSX runtime for React 17+
    }),
  ],
  publicDir: "public", // where static assets are located
});
