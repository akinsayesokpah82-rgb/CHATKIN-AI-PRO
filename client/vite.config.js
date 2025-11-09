export default {
  build: {
    outDir: '../server/public',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:10000',
    },
  },
};
