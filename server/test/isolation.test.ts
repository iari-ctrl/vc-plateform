import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/lib/db.js';

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
  await prisma.$disconnect();
});

describe('user data isolation', () => {
  it('does not let one user read or delete another user note', async () => {
    const userA = await registerUser('notes-a');
    const userB = await registerUser('notes-b');

    const create = await fetch(`${base}/api/me/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: userA.cookie },
      body: JSON.stringify({ body: 'Private note', sourceType: 'lesson', sourceId: 'l-1', sourceTitle: 'Lesson 1' }),
    });
    expect(create.status).toBe(201);
    const note = await create.json();

    const userBNotes = await fetch(`${base}/api/me/notes`, { headers: { Cookie: userB.cookie } });
    expect(userBNotes.status).toBe(200);
    expect(await userBNotes.json()).toEqual([]);

    const deleteAsB = await fetch(`${base}/api/me/notes/${note.id}`, {
      method: 'DELETE',
      headers: { Cookie: userB.cookie },
    });
    expect(deleteAsB.status).toBe(200);

    const userANotes = await fetch(`${base}/api/me/notes`, { headers: { Cookie: userA.cookie } });
    expect(userANotes.status).toBe(200);
    expect((await userANotes.json()).map((row: { id: string }) => row.id)).toContain(note.id);
  });
});

async function registerUser(label: string) {
  const email = `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@vcpx.io`;
  const res = await fetch(`${base}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'pw-strong-123', name: label }),
  });
  expect(res.status).toBe(201);
  const cookie = res.headers
    .getSetCookie()
    .map((c) => c.split(';')[0])
    .join('; ');

  const user = await prisma.user.findUnique({ where: { email } });
  expect(user).not.toBeNull();

  return { cookie, user: user! };
}
