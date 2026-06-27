import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

let server: Server;
let base: string;

beforeAll(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const { port } = server.address() as AddressInfo;
  base = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe('server health', () => {
  it('starts with the configured trust proxy setting and responds to /api/health with a request id', async () => {
    expect(app.get('trust proxy')).toBe(false);

    const res = await fetch(`${base}/api/health`);
    expect(res.status).toBe(200);
    expect(res.headers.get('x-request-id')).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(await res.json()).toMatchObject({ ok: true, service: 'vcpx-api' });
  });
});
