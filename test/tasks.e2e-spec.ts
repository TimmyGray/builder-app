import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './helpers/setup';

describe('/tasks (e2e)', () => {
  let app: INestApplication;

  const ts = Date.now();
  const USER_1 = { username: `e2e_tasks_u1_${ts}`, password: 'TestP@ss123!', jobRole: 'Builder' };
  const USER_2 = { username: `e2e_tasks_u2_${ts}`, password: 'TestP@ss123!', jobRole: 'Supervisor' };
  const JOB_TYPE_NAME = `e2e_tasks_jt_${ts}`;

  let userId1: number;
  let userId2: number;
  let jobTypeId: number;
  let mainTaskId: number;
  let deleteTaskId: number;

  beforeAll(async () => {
    app = await createApp();

    const u1Res = await request(app.getHttpServer()).post('/auth/signup').send(USER_1).expect(201);
    userId1 = u1Res.body.id;

    const u2Res = await request(app.getHttpServer()).post('/auth/signup').send(USER_2).expect(201);
    userId2 = u2Res.body.id;

    const jtRes = await request(app.getHttpServer())
      .post('/job-types')
      .set('username', USER_1.username)
      .send({ name: JOB_TYPE_NAME })
      .expect(201);
    jobTypeId = jtRes.body.id;

    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .set('username', USER_1.username)
      .send({ userId: userId1, jobTypeId })
      .expect(201);
    mainTaskId = taskRes.body.id;
  });

  afterAll(async () => {
    try {
      await request(app.getHttpServer())
        .delete('/tasks')
        .set('username', USER_1.username)
        .send({ id: mainTaskId });
    } catch {}
    try {
      if (deleteTaskId) {
        await request(app.getHttpServer())
          .delete('/tasks')
          .set('username', USER_1.username)
          .send({ id: deleteTaskId });
      }
    } catch {}
    try {
      await request(app.getHttpServer())
        .delete('/job-types')
        .set('username', USER_1.username)
        .send({ id: jobTypeId });
    } catch {}
    try {
      await request(app.getHttpServer())
        .delete('/auth/delete')
        .set('username', USER_1.username)
        .send({ username: USER_1.username, password: USER_1.password });
    } catch {}
    try {
      await request(app.getHttpServer())
        .delete('/auth/delete')
        .set('username', USER_2.username)
        .send({ username: USER_2.username, password: USER_2.password });
    } catch {}
    await app.close();
  });

  // ── GET /tasks ───────────────────────────────────────────────────────────────

  it('GET /tasks returns an array containing the created task', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks')
      .set('username', USER_1.username)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((t: { id: number }) => t.id === mainTaskId);
    expect(found).toBeDefined();
    expect(found.user.id).toBe(userId1);
    expect(found.jobType).toBe(JOB_TYPE_NAME);
    expect(found.status).toBe('ToBeDone');
  });

  it('GET /tasks returns 403 without auth header', () => {
    return request(app.getHttpServer()).get('/tasks').expect(403);
  });

  // ── GET /tasks/:id ───────────────────────────────────────────────────────────

  it('GET /tasks/:id returns the task', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tasks/${mainTaskId}`)
      .set('username', USER_1.username)
      .expect(200);

    expect(res.body.id).toBe(mainTaskId);
    expect(res.body.user.id).toBe(userId1);
    expect(res.body.user.username).toBe(USER_1.username);
    expect(res.body.jobType).toBe(JOB_TYPE_NAME);
    expect(res.body.status).toBe('ToBeDone');
    expect(res.body.dateOfCompletion).toBeNull();
  });

  it('GET /tasks/:id returns 404 for unknown id', () => {
    return request(app.getHttpServer())
      .get('/tasks/999999999')
      .set('username', USER_1.username)
      .expect(404);
  });

  it('GET /tasks/:id returns 403 without auth header', () => {
    return request(app.getHttpServer()).get(`/tasks/${mainTaskId}`).expect(403);
  });

  // ── POST /tasks ──────────────────────────────────────────────────────────────

  it('POST /tasks creates a new task', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('username', USER_1.username)
      .send({ userId: userId1, jobTypeId })
      .expect(201);

    expect(typeof res.body.id).toBe('number');
    expect(res.body.user.id).toBe(userId1);
    expect(res.body.jobType).toBe(JOB_TYPE_NAME);
    expect(res.body.status).toBe('ToBeDone');
    deleteTaskId = res.body.id;
  });

  it('POST /tasks returns 400 when required fields are missing', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .set('username', USER_1.username)
      .send({ userId: userId1 })
      .expect(400);
  });

  it('POST /tasks returns 404 when userId does not exist', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .set('username', USER_1.username)
      .send({ userId: 999999999, jobTypeId })
      .expect(404);
  });

  it('POST /tasks returns 403 without auth header', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ userId: userId1, jobTypeId })
      .expect(403);
  });

  // ── PATCH /tasks ─────────────────────────────────────────────────────────────

  it('PATCH /tasks updates the task status', async () => {
    const res = await request(app.getHttpServer())
      .patch('/tasks')
      .set('username', USER_1.username)
      .send({ id: mainTaskId, status: 'InProgress' })
      .expect(200);

    expect(res.body.id).toBe(mainTaskId);
    expect(res.body.status).toBe('InProgress');
  });

  it('PATCH /tasks sets status to Completed when dateOfCompletion is provided', async () => {
    const completionDate = '2026-05-30T12:00:00.000Z';
    const res = await request(app.getHttpServer())
      .patch('/tasks')
      .set('username', USER_1.username)
      .send({ id: mainTaskId, dateOfCompletion: completionDate })
      .expect(200);

    expect(res.body.id).toBe(mainTaskId);
    expect(res.body.status).toBe('Completed');
    expect(res.body.dateOfCompletion).toBeDefined();
    expect(res.body.dateOfCompletion).not.toBeNull();
  });

  it('PATCH /tasks reassigns the task to another user', async () => {
    const res = await request(app.getHttpServer())
      .patch('/tasks')
      .set('username', USER_1.username)
      .send({ id: mainTaskId, userId: userId2 })
      .expect(200);

    expect(res.body.id).toBe(mainTaskId);
    expect(res.body.user.id).toBe(userId2);
  });

  it('PATCH /tasks returns 404 for unknown task id', () => {
    return request(app.getHttpServer())
      .patch('/tasks')
      .set('username', USER_1.username)
      .send({ id: 999999999, status: 'Cancelled' })
      .expect(404);
  });

  it('PATCH /tasks returns 403 without auth header', () => {
    return request(app.getHttpServer())
      .patch('/tasks')
      .send({ id: mainTaskId, status: 'Cancelled' })
      .expect(403);
  });

  // ── DELETE /tasks ────────────────────────────────────────────────────────────

  it('DELETE /tasks removes the task and returns 204', async () => {
    await request(app.getHttpServer())
      .delete('/tasks')
      .set('username', USER_1.username)
      .send({ id: deleteTaskId })
      .expect(204);

    await request(app.getHttpServer())
      .get(`/tasks/${deleteTaskId}`)
      .set('username', USER_1.username)
      .expect(404);
  });

  it('DELETE /tasks returns 403 without auth header', () => {
    return request(app.getHttpServer())
      .delete('/tasks')
      .send({ id: mainTaskId })
      .expect(403);
  });

  it('DELETE /tasks returns 404 for unknown id', () => {
    return request(app.getHttpServer())
      .delete('/tasks')
      .set('username', USER_1.username)
      .send({ id: 999999999 })
      .expect(404);
  });
});
