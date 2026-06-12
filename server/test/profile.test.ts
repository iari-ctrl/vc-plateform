import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/db.js';

// First server-side integration test: register → PUT profile → DELETE profile →
// GET profile = null. Exercises the real Express app over HTTP (ephemeral port)
// against the isolated test DB built in global-setup.ts.

let server: Server;
let base: string;
const email = `profile-test-${Date.now()}@vcpx.io`;

beforeAll(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const { port } = server.address() as AddressInfo;
  base = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await prisma.$disconnect();
});

describe('profile lifecycle', () => {
  let cookie = '';

  it('register issues an auth cookie', async () => {
    const res = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'pw-strong-123', name: 'Tester' }),
    });
    expect(res.status).toBe(201);
    cookie = res.headers
      .getSetCookie()
      .map((c) => c.split(';')[0])
      .join('; ');
    expect(cookie).toContain('vcpx_token=');
  });

  it('PUT /me/profile persists the profile and onboarding answers', async () => {
    const res = await fetch(`${base}/api/me/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({
        profileType: 'futur-analyste',
        timeBudget: 'medium',
        answers: [{ questionN: 'q1', optionIndex: 0 }],
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.profileType).toBe('futur-analyste');
  });

  it('GET /me/profile returns the stored profile', async () => {
    const res = await fetch(`${base}/api/me/profile`, { headers: { Cookie: cookie } });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body?.profileType).toBe('futur-analyste');
  });

  it('DELETE /me/profile removes the profile AND the onboarding answers', async () => {
    const del = await fetch(`${base}/api/me/profile`, { method: 'DELETE', headers: { Cookie: cookie } });
    expect(del.status).toBe(200);

    const after = await fetch(`${base}/api/me/profile`, { headers: { Cookie: cookie } });
    expect(after.status).toBe(200);
    expect(await after.json()).toBeNull();

    // No orphaned onboarding answers (they would skew a future re-test).
    const user = await prisma.user.findUnique({ where: { email } });
    expect(user).not.toBeNull();
    const answers = await prisma.onboardingAnswer.count({ where: { userId: user!.id } });
    expect(answers).toBe(0);
  });
});
