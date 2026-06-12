import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import jwt from 'jsonwebtoken';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { getJwtSecretIssue, shouldRefreshToken } from '../src/lib/auth.js';
import { prisma } from '../src/lib/db.js';

let server: Server;
let base: string;

const authCookie = 'vcpx_token';
const jwtSecret = process.env.JWT_SECRET ?? 'test-secret-with-at-least-32-characters';

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

describe('JWT hardening', () => {
  it('rejects weak production secrets', () => {
    expect(getJwtSecretIssue('dev-secret-change-me', 'production')).toContain('blocked');
    expect(getJwtSecretIssue('short-secret-not-blacklisted', 'production')).toContain('at least 32');
    expect(getJwtSecretIssue('a-safe-secret-with-at-least-32-chars', 'production')).toBeNull();
    expect(getJwtSecretIssue('dev-secret-change-me', 'development')).toBeNull();
  });

  it('knows when a token is inside the sliding refresh window', () => {
    const now = 1_700_000_000;
    expect(shouldRefreshToken({ exp: now + 6 * 24 * 60 * 60 }, now)).toBe(true);
    expect(shouldRefreshToken({ exp: now + 8 * 24 * 60 * 60 }, now)).toBe(false);
    expect(shouldRefreshToken({}, now)).toBe(false);
  });
});

describe('auth middleware', () => {
  it('keeps optional auth public on /api/auth/me but protects /api/me', async () => {
    const me = await fetch(`${base}/api/auth/me`);
    expect(me.status).toBe(200);
    expect(await me.json()).toEqual({ user: null });

    const profile = await fetch(`${base}/api/me/profile`);
    expect(profile.status).toBe(401);
  });

  it('refreshes a valid auth cookie when the JWT expires in less than 7 days', async () => {
    const email = `sliding-${Date.now()}@vcpx.io`;
    const user = await prisma.user.create({
      data: { email, name: 'Sliding JWT', passwordHash: 'unused-in-test' },
    });
    const expiringToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      jwtSecret,
      { expiresIn: '6d' },
    );

    const res = await fetch(`${base}/api/auth/me`, {
      headers: { Cookie: `${authCookie}=${expiringToken}` },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.email).toBe(email);

    const refreshedCookie = res.headers.getSetCookie().find((cookie) => cookie.startsWith(`${authCookie}=`));
    expect(refreshedCookie).toBeTruthy();
    const refreshedToken = refreshedCookie!.split(';')[0].slice(`${authCookie}=`.length);
    expect(refreshedToken).not.toBe(expiringToken);
  });
});

describe('search rate limit', () => {
  it('throttles /api/search after 60 requests per minute', async () => {
    let last: Response | undefined;
    for (let i = 0; i < 61; i++) {
      last = await fetch(`${base}/api/search?q=term-${i}`);
    }
    expect(last?.status).toBe(429);
  });
});
