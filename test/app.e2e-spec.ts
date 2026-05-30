import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createApp } from './helpers/setup';

describe('Application smoke tests (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Swagger UI is accessible at /api', () => {
    return request(app.getHttpServer()).get('/api').expect(200);
  });

  it('Unknown route returns 404', () => {
    return request(app.getHttpServer()).get('/nonexistent-route-xyz').expect(404);
  });
});
