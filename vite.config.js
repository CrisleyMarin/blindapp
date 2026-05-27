import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Raise the warning limit slightly and add manual chunking to avoid very large bundles
    chunkSizeWarningLimit: 800, // in KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id) return;
          if (id.includes('node_modules')) {
            // derive top-level package name from path
            const parts = id.split(`node_modules${path.sep}`)[1] || id.split('node_modules/')[1] || '';
            const pkg = parts.split(path.sep)[0] || parts.split('/')[0] || '';
            // group core framework libs to avoid circular chunk references
            if (['react', 'react-dom', 'recharts', 'lucide-react'].includes(pkg)) return 'framework';
            if (pkg === 'lodash') return 'lodash';
            return 'vendor';
          }
        }
      }
    }
  }
});
