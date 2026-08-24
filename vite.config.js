import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';

const htmlFiles = globSync('**/*.html', {
  ignore: ['node_modules/**', 'dist/**']
});

const input = Object.fromEntries(
  htmlFiles.map(file => [
    file.replace(/\.html$/, ''),
    resolve(process.cwd(), file)
  ])
);

export default defineConfig({
  build: {
    rollupOptions: {
      input
    }
  }
});