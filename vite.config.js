import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function mongoApiPlugin() {
  return {
    name: 'mongo-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const { handleApiRequest } = await import('./server/apiRouter.js');
            return handleApiRequest(req, res, next);
          } catch (e) {
            console.error('Error handling API request in Vite middleware:', e);
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const { handleApiRequest } = await import('./server/apiRouter.js');
            return handleApiRequest(req, res, next);
          } catch (e) {
            console.error('Error handling API request in Vite preview:', e);
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), mongoApiPlugin()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        about: resolve(__dirname, 'about.html'),
        howItWorks: resolve(__dirname, 'how-it-works.html'),
        features: resolve(__dirname, 'features.html'),
        announcements: resolve(__dirname, 'announcements.html'),
        faq: resolve(__dirname, 'faq.html'),
        aboutFluxora: resolve(__dirname, 'about-fluxora.html'),
        whoItsFor: resolve(__dirname, 'who-its-for.html'),
        contact: resolve(__dirname, 'contact.html'),
        admin: resolve(__dirname, 'admin.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-misc';
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
