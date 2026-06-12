import './lib/env.js';
import { ENV } from './lib/env.js';
import { app } from './app.js';
import { assertSecureJwtSecret } from './lib/auth.js';

try {
  assertSecureJwtSecret();
} catch (err) {
  const message = err instanceof Error ? err.message : 'Invalid JWT_SECRET.';
  console.error(`\n✗ ERROR: ${message} Please configure a secure secret in .env.\n`);
  process.exit(1);
}

app.listen(ENV.PORT, () => {
  console.log(`\n  VC Premium API  →  http://localhost:${ENV.PORT}/api`);
  console.log(`  CORS origin     →  ${ENV.CLIENT_ORIGIN}\n`);
});
