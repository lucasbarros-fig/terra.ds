/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

/**
 * Vitest configuration covering terra-ds library tests.
 *
 * Uses @analogjs/vite-plugin-angular as the Angular compilation layer
 * because @angular/build:unit-test (the official Angular Vitest builder)
 * targets application projects and does not support library (ng-packagr) builds.
 * Intent: migrate to @angular/build:unit-test once library support stabilises.
 *
 * .mts extension forces ESM config loading (avoids ERR_REQUIRE_ESM with std-env on CJS projects).
 */
export default defineConfig({
  plugins: [
    angular({
      tsconfig: './tsconfig.spec.json',
      inlineStylesExtension: 'scss',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setup-vitest-zone.ts', './setup-vitest.ts'],
    // Prefer forks so Zone/globalThis from one file cannot poison another worker.
    pool: 'forks',
    isolate: true,
    include: [
      'projects/terra-ds/src/**/*.spec.ts',
    ],
    exclude: ['**/node_modules/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      include: [
        'projects/terra-ds/src/**/*.ts',
      ],
      exclude: [
        'projects/terra-ds/src/**/*.spec.ts',
        'projects/terra-ds/src/public-api.ts',
      ],
      reportsDirectory: 'coverage',
      reporter: ['text', 'lcov', 'html'],
    },
  },
});
