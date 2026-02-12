import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic", // use the classic JSX runtime
    }),
  ],
  publicDir: "public", // where static assets are located
  esbuild: {
    loader: "jsx", // handle .js and .jsx files
    include: /src\/.*\.(js|jsx)$/, // only process files in src
    exclude: /node_modules/, // exclude node_modules
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx", // treat .js files as jsx
      },
    },
  },
});
