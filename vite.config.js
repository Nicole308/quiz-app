import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv"

dotenv.config({path: ".env"});

// console.log("test .env from vite.config.js: ", process.env.CONNECT_SERVER_API)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080/'
    }
  },
  // esbuild: {
  //   loader: {
  //     '.js': 'jsx',
  //   }
  // },
  plugins: [react()]
})
