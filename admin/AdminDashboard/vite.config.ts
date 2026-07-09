import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This app is always served under the /admin path (both in dev, via the
// frontend's proxy, and in production, via the backend's static hosting).
// Setting `base` makes sure every built JS/CSS asset URL is generated as
// /admin/assets/... instead of /assets/... so it resolves correctly.
export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
  preview: {
    port: 5174,
    strictPort: true,
  },
});
