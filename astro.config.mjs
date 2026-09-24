import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://spaceynyc.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [react(), sitemap()],
  server: { host: '127.0.0.1' },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
