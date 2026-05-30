import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './helpers/setup';

describe('/auth (e2e)', () => {
  let app: INestApplication;

  // SETUP_USER persists for the full suite (created in beforeAll, deleted in afterAll).
  // SIGNUP_USER is created and deleted within the signup / delete tests.
  const ts = Date.now();
  const SETUP_USER = {
    username: `e2e_auth_setup_${ts}`,
    password: 'TestP@ss123!',
    jobRole: 'Builder',
  };
  const SIGNUP_USER = {
    username: `e2e_auth_signup_${ts}`,
    password: 'SignupP@ss456!',
    jobRole: 'Supervisor',
  };

  beforeAll(async () => {
    app = await createApp();
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(SETUP_USER)
      .expect(201);
  });

  afterAll(async () => {
    // Best-effort cleanup for SETUP_USER (may already be gone if tests failed oddly).
    try {
      await request(app.getHttpServer())
        .delete('/auth/delete')
        .set('username', SETUP_USER.username)
        .send({ username: SETUP_USER.username, password: SETUP_USER.password });
    } catch {}
    // Best-effort cleanup for SIGNUP_USER (deleted by test 12 under normal flow).
    try {
      await request(app.getHttpServer())
        .delete('/auth/delete')
        .set('username', SETUP_USER.username)
        .send({ username: SIGNUP_USER.username, password: SIGNUP_USER.password });
    } catch {}
    await app.close();
  });

  // ── POST /auth/signup ────────────────────────────────────────────────────────

  it('POST /auth/signup creates a new user and returns UserResponseDto', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(SIGNUP_USER)
      .expect(201);

    expect(res.body).toMatchObject({
      username: SIGNUP_USER.username,
      jobRole: SIGNUP_USER.jobRole,
    });
    expect(typeof res.body.id).toBe('number');
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.updatedAt).toBeDefined();
    expect(res.body.password).toBeUndefined();
  });

  it('POST /auth/signup returns 409 when username already exists', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(SIGNUP_USER)
      .expect(409);
  });

  it('POST /auth/signup returns 400 when required fields are missing', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: `e2e_partial_${ts}` })
      .expect(400);
  });

  it('POST /auth/signup returns 400 when jobRole is invalid enum value', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: `e2e_bad_role_${ts}`, password: 'pass', jobRole: 'InvalidRole' })
      .expect(400);
  });

  // ── POST /auth/signin ────────────────────────────────────────────────────────

  it('POST /auth/signin returns UserResponseDto for valid credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username: SETUP_USER.username, password: SETUP_USER.password })
      .expect(201);

    expect(res.body).toMatchObject({
      username: SETUP_USER.username,
      jobRole: SETUP_USER.jobRole,
    });
    expect(typeof res.body.id).toBe('number');
    expect(res.body.password).toBeUndefined();
  });

  it('POST /auth/signin returns 401 for wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username: SETUP_USER.username, password: 'wrongpassword' })
      .expect(401);
  });

  it('POST /auth/signin returns 401 for unknown username', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username: 'nonexistent_user_xyz', password: 'somepass' })
      .expect(401);
  });

  // ── POST /auth/signout ───────────────────────────────────────────────────────

  it('POST /auth/signout succeeds for an authenticated user', () => {
    return request(app.getHttpServer())
      .post('/auth/signout')
      .set('username', SETUP_USER.username)
      .expect(201);
  });

  it('POST /auth/signout returns 403 when username header is missing', () => {
    return request(app.getHttpServer())
      .post('/auth/signout')
      .expect(403);
  });

  // ── DELETE /auth/delete ──────────────────────────────────────────────────────

  it('DELETE /auth/delete returns 403 when username header is missing', () => {
    return request(app.getHttpServer())
      .delete('/auth/delete')
      .send({ username: SETUP_USER.username, password: SETUP_USER.password })
      .expect(403);
  });

  it('DELETE /auth/delete returns 401 for wrong password', () => {
    return request(app.getHttpServer())
      .delete('/auth/delete')
      .set('username', SETUP_USER.username)
      .send({ username: SETUP_USER.username, password: 'wrongpassword' })
      .expect(401);
  });

  it('DELETE /auth/delete returns 404 when body username does not exist', () => {
    return request(app.getHttpServer())
      .delete('/auth/delete')
      .set('username', SETUP_USER.username)
      .send({ username: 'nonexistent_user_xyz', password: 'any' })
      .expect(404);
  });

  it('DELETE /auth/delete removes the user and returns success message', async () => {
    const res = await request(app.getHttpServer())
      .delete('/auth/delete')
      .set('username', SIGNUP_USER.username)
      .send({ username: SIGNUP_USER.username, password: SIGNUP_USER.password })
      .expect(200);

    expect(typeof res.text === 'string' || typeof res.body === 'string').toBe(true);
  });
});
