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
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
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
            if (id.includes('gsap')) {
              return 'vendor-gsap';
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
