import { execSync } from 'node:child_process';
import { closeSync, existsSync, openSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// server/ (the package root, where prisma/schema.prisma lives)
const SERVER_DIR = fileURLToPath(new URL('..', import.meta.url));
const TEST_DB = fileURLToPath(new URL('../prisma/test.db', import.meta.url));
const DATABASE_URL = 'file:./test.db';
const TEST_DB_FILES = [TEST_DB, `${TEST_DB}-journal`, `${TEST_DB}-wal`, `${TEST_DB}-shm`];

/**
 * Build a clean SQLite schema on a throwaway file before the suite runs from
 * committed Prisma migrations, and delete it (plus WAL sidecars) afterwards.
 */
export default function setup() {
  cleanupTestDb();
  closeSync(openSync(TEST_DB, 'w'));
  execSync('npx --no-install prisma migrate deploy', {
    cwd: SERVER_DIR,
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL },
  });

  return cleanupTestDb;
}

function cleanupTestDb() {
  for (const f of TEST_DB_FILES) {
    if (existsSync(f)) rmSync(f);
  }
}
