import { defineConfig, type UserConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
  // wxt@0.19 bundles Vite 6 while vitest@2 bundles Vite 5, so WxtVitest()'s plugin
  // type (Vite 6) doesn't match the Vite 5 PluginOption that defineConfig expects.
  // The plugin runs correctly; this bridges the duplicated Vite type definitions.
  plugins: [WxtVitest()] as unknown as UserConfig['plugins'],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
