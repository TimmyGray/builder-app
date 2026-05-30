import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './helpers/setup';

describe('/job-types (e2e)', () => {
  let app: INestApplication;

  const ts = Date.now();
  const AUTH_USER = {
    username: `e2e_jt_user_${ts}`,
    password: 'TestP@ss123!',
    jobRole: 'Builder',
  };
  const MAIN_JOB_TYPE_NAME = `e2e_jt_main_${ts}`;

  let mainJobTypeId: number;
  let deleteJobTypeId: number;

  beforeAll(async () => {
    app = await createApp();
    await request(app.getHttpServer()).post('/auth/signup').send(AUTH_USER).expect(201);
    const jtRes = await request(app.getHttpServer())
      .post('/job-types')
      .set('username', AUTH_USER.username)
      .send({ name: MAIN_JOB_TYPE_NAME })
      .expect(201);
    mainJobTypeId = jtRes.body.id;
  });

  afterAll(async () => {
    // Clean up any leftover job types (deleteJobType may have already removed deleteJobTypeId).
    try {
      await request(app.getHttpServer())
        .delete('/job-types')
        .set('username', AUTH_USER.username)
        .send({ id: mainJobTypeId });
    } catch {}
    try {
      if (deleteJobTypeId) {
        await request(app.getHttpServer())
          .delete('/job-types')
          .set('username', AUTH_USER.username)
          .send({ id: deleteJobTypeId });
      }
    } catch {}
    // AUTH_USER deletion: use itself as both header and body user.
    try {
      await request(app.getHttpServer())
        .delete('/auth/delete')
        .set('username', AUTH_USER.username)
        .send({ username: AUTH_USER.username, password: AUTH_USER.password });
    } catch {}
    await app.close();
  });

  // ── GET /job-types ───────────────────────────────────────────────────────────

  it('GET /job-types returns an array containing the created job type', async () => {
    const res = await request(app.getHttpServer())
      .get('/job-types')
      .set('username', AUTH_USER.username)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((jt: { id: number }) => jt.id === mainJobTypeId);
    expect(found).toBeDefined();
    expect(found.name).toBe(MAIN_JOB_TYPE_NAME);
  });

  it('GET /job-types returns 403 without auth header', () => {
    return request(app.getHttpServer()).get('/job-types').expect(403);
  });

  // ── GET /job-types/:id ───────────────────────────────────────────────────────

  it('GET /job-types/:id returns the job type', async () => {
    const res = await request(app.getHttpServer())
      .get(`/job-types/${mainJobTypeId}`)
      .set('username', AUTH_USER.username)
      .expect(200);

    expect(res.body.id).toBe(mainJobTypeId);
    expect(res.body.name).toBe(MAIN_JOB_TYPE_NAME);
  });

  it('GET /job-types/:id returns 404 for unknown id', () => {
    return request(app.getHttpServer())
      .get('/job-types/999999999')
      .set('username', AUTH_USER.username)
      .expect(404);
  });

  it('GET /job-types/:id returns 403 without auth header', () => {
    return request(app.getHttpServer()).get(`/job-types/${mainJobTypeId}`).expect(403);
  });

  // ── POST /job-types ──────────────────────────────────────────────────────────

  it('POST /job-types creates a new job type', async () => {
    const name = `e2e_jt_del_${ts}`;
    const res = await request(app.getHttpServer())
      .post('/job-types')
      .set('username', AUTH_USER.username)
      .send({ name })
      .expect(201);

    expect(res.body.name).toBe(name);
    expect(typeof res.body.id).toBe('number');
    deleteJobTypeId = res.body.id;
  });

  it('POST /job-types returns 409 for duplicate name', () => {
    return request(app.getHttpServer())
      .post('/job-types')
      .set('username', AUTH_USER.username)
      .send({ name: MAIN_JOB_TYPE_NAME })
      .expect(409);
  });

  it('POST /job-types returns 403 without auth header', () => {
    return request(app.getHttpServer())
      .post('/job-types')
      .send({ name: `e2e_jt_noauth_${ts}` })
      .expect(403);
  });

  it('POST /job-types returns 400 when name is missing', () => {
    return request(app.getHttpServer())
      .post('/job-types')
      .set('username', AUTH_USER.username)
      .send({})
      .expect(400);
  });

  it('POST /job-types persists description and measure', async () => {
    const name = `e2e_jt_measured_${ts}`;
    const res = await request(app.getHttpServer())
      .post('/job-types')
      .set('username', AUTH_USER.username)
      .send({ name, description: 'Pouring concrete', measure: 'm^3' })
      .expect(201);

    expect(res.body.name).toBe(name);
    expect(res.body.description).toBe('Pouring concrete');
    expect(res.body.measure).toBe('m^3');

    // self-contained cleanup
    await request(app.getHttpServer())
      .delete('/job-types')
      .set('username', AUTH_USER.username)
      .send({ id: res.body.id })
      .expect(204);
  });

  it('GET /job-types/:id has null description and measure when unset', async () => {
    const res = await request(app.getHttpServer())
      .get(`/job-types/${mainJobTypeId}`)
      .set('username', AUTH_USER.username)
      .expect(200);

    expect(res.body.description).toBeNull();
    expect(res.body.measure).toBeNull();
  });

  it('POST /job-types returns 400 for an invalid measure', () => {
    return request(app.getHttpServer())
      .post('/job-types')
      .set('username', AUTH_USER.username)
      .send({ name: `e2e_jt_badmeasure_${ts}`, measure: 'tonnes' })
      .expect(400);
  });

  // ── PATCH /job-types ─────────────────────────────────────────────────────────

  it('PATCH /job-types updates the job type name', async () => {
    const updatedName = `${MAIN_JOB_TYPE_NAME}_upd`;
    const res = await request(app.getHttpServer())
      .patch('/job-types')
      .set('username', AUTH_USER.username)
      .send({ id: mainJobTypeId, name: updatedName })
      .expect(200);

    expect(res.body.id).toBe(mainJobTypeId);
    expect(res.body.name).toBe(updatedName);
  });

  it('PATCH /job-types updates description and measure', async () => {
    const res = await request(app.getHttpServer())
      .patch('/job-types')
      .set('username', AUTH_USER.username)
      .send({ id: mainJobTypeId, name: `${MAIN_JOB_TYPE_NAME}_m`, description: 'Updated description', measure: 'kg' })
      .expect(200);

    expect(res.body.id).toBe(mainJobTypeId);
    expect(res.body.description).toBe('Updated description');
    expect(res.body.measure).toBe('kg');
  });

  it('PATCH /job-types returns 403 without auth header', () => {
    return request(app.getHttpServer())
      .patch('/job-types')
      .send({ id: mainJobTypeId, name: 'whatever' })
      .expect(403);
  });

  it('PATCH /job-types returns 404 for unknown id', () => {
    return request(app.getHttpServer())
      .patch('/job-types')
      .set('username', AUTH_USER.username)
      .send({ id: 999999999, name: 'whatever' })
      .expect(404);
  });

  // ── DELETE /job-types ────────────────────────────────────────────────────────

  it('DELETE /job-types removes the job type and returns 204', async () => {
    await request(app.getHttpServer())
      .delete('/job-types')
      .set('username', AUTH_USER.username)
      .send({ id: deleteJobTypeId })
      .expect(204);

    // Verify it's gone.
    await request(app.getHttpServer())
      .get(`/job-types/${deleteJobTypeId}`)
      .set('username', AUTH_USER.username)
      .expect(404);
  });

  it('DELETE /job-types returns 403 without auth header', () => {
    return request(app.getHttpServer())
      .delete('/job-types')
      .send({ id: mainJobTypeId })
      .expect(403);
  });

  it('DELETE /job-types returns 404 for unknown id', () => {
    return request(app.getHttpServer())
      .delete('/job-types')
      .set('username', AUTH_USER.username)
      .send({ id: 999999999 })
      .expect(404);
  });
});
