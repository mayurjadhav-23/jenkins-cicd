const request = require('supertest');
const app = require('./app');

describe('App Tests', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello Jenkins CI/CD!');
    expect(response.body.version).toBe('1.0.0');
  });

  test('GET /health should return health status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
  });

  test('POST /api/users should create user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData);
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.id).toBeDefined();
  });

  test('POST /api/users should return 400 for missing data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe' }); // Missing email
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Name and email are required');
  });
});