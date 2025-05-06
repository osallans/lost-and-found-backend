// tests/integration/country.routes.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('Country Routes', () => {
  it('GET /api/countries returns 200', async () => {
    const res = await request(app).get('/api/countries');
    expect(res.statusCode).toBe(200);
  });
});
