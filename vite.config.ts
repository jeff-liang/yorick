import fs from "fs";
import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const publicFiles = fs.readdirSync(path.resolve(__dirname, "public"));
const publicFilesRegex = publicFiles
  .map((f) => f.replace(/\./g, "\\."))
  .join("|");

export default defineConfig({
  base: "/yorick/",
  plugins: [react()],
  build: {
    outDir: "build",
    minify: false,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "./index.html"),
        load: path.resolve(__dirname, "./load.html"),
      },
    },
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    port: 3000,
    proxy: {
      [`^/(?!yorick/|src/|node_modules/|@react-refresh|@vite|${publicFilesRegex}).*(?<!.js.map)$`]:
        {
          target: "http://127.0.0.1:60080",
          changeOrigin: true,
          secure: false,
        },
    },
  },
});
