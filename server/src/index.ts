import './lib/env.js';
import { ENV } from './lib/env.js';
import { app } from './app.js';
import { assertSecureJwtSecret } from './lib/auth.js';
import { prisma } from './lib/db.js';

try {
  assertSecureJwtSecret();
} catch (err) {
  const message = err instanceof Error ? err.message : 'Invalid JWT_SECRET.';
  console.error(`\n✗ ERROR: ${message} Please configure a secure secret in .env.\n`);
  process.exit(1);
}

const server = app.listen(ENV.PORT, () => {
  console.log(`\n  VC Premium API  →  http://localhost:${ENV.PORT}/api`);
  console.log(`  CORS origin     →  ${ENV.CLIENT_ORIGIN}\n`);
});

const SHUTDOWN_TIMEOUT_MS = 10_000;
let shuttingDown = false;

async function shutdown(signal: 'SIGTERM' | 'SIGINT') {
  if (shuttingDown) return;
  shuttingDown = true;

  const forceExit = setTimeout(() => {
    console.error(`${signal} shutdown timed out after ${SHUTDOWN_TIMEOUT_MS}ms; forcing exit.`);
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExit.unref();

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    await prisma.$disconnect();
    clearTimeout(forceExit);
    process.exit(0);
  } catch (err) {
    clearTimeout(forceExit);
    console.error(`${signal} graceful shutdown failed:`, err);
    await prisma.$disconnect().catch(() => undefined);
    process.exit(1);
  }
}

process.once('SIGTERM', () => void shutdown('SIGTERM'));
process.once('SIGINT', () => void shutdown('SIGINT'));
