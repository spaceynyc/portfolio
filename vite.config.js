import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { railMarkup, stagesMarkup, beltMarkup, countsSentence, beltCount } from './src/render-work.js';

function policyRedirect(req, res, next) {
  const url = new URL(req.url, 'http://localhost');
  if (['/hermes-sms', '/privacy', '/terms'].includes(url.pathname)) {
    res.statusCode = 308;
    res.setHeader('Location', `${url.pathname}/${url.search}`);
    return res.end();
  }
  next();
}

// Renders the work sections from src/portfolio-data.js into index.html, so they exist before any script runs.
const renderWork = {
  name: 'render-work',
  transformIndexHtml(html) {
    return html
      .replace('<!--@rail-->', railMarkup())
      .replace('<!--@stages-->', stagesMarkup())
      .replace('<!--@belt-->', beltMarkup())
      .replace('<!--@belt-count-->', beltCount)
      .replace('<!--@belt-count-lower-->', beltCount.toLowerCase())
      .replace('<!--@counts-->', countsSentence());
  },
};

export default defineConfig({
  plugins: [renderWork, {
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
