/**
 * Idempotent Zone patch for Vitest.
 * `@analogjs/vite-plugin-angular/setup-vitest` throws if loaded more than once
 * in the same isolate (Vitest re-runs setupFiles per file in some pools/CI).
 */
const g = globalThis as typeof globalThis & {
  __vitest_zone_patch__?: boolean;
};

if (!g.__vitest_zone_patch__) {
  await import('@analogjs/vite-plugin-angular/setup-vitest');
}
