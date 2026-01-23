import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: (() => {
      const keyPath = path.resolve(new URL('./.certs/local-dev-key.pem', import.meta.url).pathname);
      const certPath = path.resolve(new URL('./.certs/local-dev-cert.pem', import.meta.url).pathname);
      if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        return undefined;
      }
      return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
    })(),
  },
});
