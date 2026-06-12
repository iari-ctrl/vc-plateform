import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Isolated SQLite file for tests — created/reset by test/global-setup.ts and
// never the dev database. Absolute path so the Prisma CLI (global setup) and the
// Prisma Client (test workers) resolve to the exact same file regardless of cwd.
const TEST_DB = fileURLToPath(new URL('./prisma/test.db', import.meta.url));

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    globalSetup: ['./test/global-setup.ts'],
    // Keep DB-touching suites serial to avoid cross-test interference.
    fileParallelism: false,
    env: {
      DATABASE_URL: `file:${TEST_DB}`,
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret-with-at-least-32-characters',
    },
  },
  resolve: {
    // Server source imports use explicit `.js` extensions (NodeNext style). Map
    // those back to the `.ts` sources so Vite can resolve them under test.
    alias: [{ find: /^(\.{1,2}\/.*)\.js$/, replacement: '$1' }],
  },
});
