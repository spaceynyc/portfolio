import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

function policyRedirect(req, res, next) {
  const url = new URL(req.url, 'http://localhost');
  if (['/hermes-sms', '/privacy', '/terms'].includes(url.pathname)) {
    res.statusCode = 308;
    res.setHeader('Location', `${url.pathname}/${url.search}`);
    return res.end();
  }
  next();
}

export default defineConfig({
  plugins: [{
    name: 'preserve-policy-routes',
    configureServer(server) { server.middlewares.use(policyRedirect); },
    configurePreviewServer(server) { server.middlewares.use(policyRedirect); },
  }],
  build: {
    rollupOptions: {
      input: Object.fromEntries(['index.html', 'hermes-sms/index.html', 'privacy/index.html', 'terms/index.html'].map(file => [file, fileURLToPath(new URL(file, import.meta.url))])),
    },
  },
});
