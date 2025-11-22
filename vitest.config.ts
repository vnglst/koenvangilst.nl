import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node'
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, './lib'),
      hooks: path.resolve(__dirname, './hooks'),
      components: path.resolve(__dirname, './components'),
      cms: path.resolve(__dirname, './cms')
    }
  }
});
