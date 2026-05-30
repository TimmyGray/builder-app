import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './helpers/setup';

describe('/users (e2e)', () => {
  let app: INestApplication;

  const ts = Date.now();
  const TEST_USER = {
    username: `e2e_users_${ts}`,
    password: 'TestP@ss123!',
    jobRole: 'Builder',
  };
  let userId: number;
  let currentUsername = TEST_USER.username;

  beforeAll(async () => {
    app = await createApp();
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(TEST_USER)
      .expect(201);
    userId = res.body.id;
  });

  afterAll(async () => {
    try {
      await request(app.getHttpServer())
        .delete('/auth/delete')
        .set('username', currentUsername)
        .send({ username: currentUsername, password: TEST_USER.password });
    } catch {}
    await app.close();
  });

  // ── GET /users ───────────────────────────────────────────────────────────────

  it('GET /users returns an array of users', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('username', currentUsername)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((u: { id: number }) => u.id === userId);
    expect(found).toBeDefined();
    expect(found.username).toBe(currentUsername);
  });

  it('GET /users returns 403 without auth header', () => {
    return request(app.getHttpServer()).get('/users').expect(403);
  });

  // ── GET /users/:username ─────────────────────────────────────────────────────

  it('GET /users/:username returns the user', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${currentUsername}`)
      .set('username', currentUsername)
      .expect(200);

    expect(res.body.id).toBe(userId);
    expect(res.body.username).toBe(currentUsername);
    expect(res.body.jobRole).toBe(TEST_USER.jobRole);
    expect(res.body.password).toBeUndefined();
  });

  it('GET /users/:username returns 404 for unknown username', () => {
    return request(app.getHttpServer())
      .get('/users/nonexistent_user_xyz_abc')
      .set('username', currentUsername)
      .expect(404);
  });

  it('GET /users/:username returns 403 without auth header', () => {
    return request(app.getHttpServer())
      .get(`/users/${currentUsername}`)
      .expect(403);
  });

  // ── PATCH /users ─────────────────────────────────────────────────────────────

  it('PATCH /users updates the username', async () => {
    const newUsername = `${TEST_USER.username}_upd`;
    const res = await request(app.getHttpServer())
      .patch('/users')
      .set('username', currentUsername)
      .send({ id: userId, username: newUsername })
      .expect(200);

    expect(res.body.id).toBe(userId);
    expect(res.body.username).toBe(newUsername);
    currentUsername = newUsername;
  });

  it('PATCH /users returns 403 without auth header', () => {
    return request(app.getHttpServer())
      .patch('/users')
      .send({ id: userId, username: 'whatever' })
      .expect(403);
  });

  it('PATCH /users returns 404 when user id does not exist', () => {
    return request(app.getHttpServer())
      .patch('/users')
      .set('username', currentUsername)
      .send({ id: 999999999, username: 'whoever' })
      .expect(404);
  });
});
