const request = require('supertest');
const app = require('../src/app');

describe('API Health Check', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.message).toBe('GymApp API is running!');
    expect(response.body.timestamp).toBeDefined();
  });
});

describe('Users API', () => {
  test('GET /api/users should return users array', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/users should create a new user', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);
    
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  test('POST /api/users without name should return 400', async () => {
    const invalidUser = {
      email: 'test@example.com'
    };

    await request(app)
      .post('/api/users')
      .send(invalidUser)
      .expect(400);
  });
});

describe('Exercises API', () => {
  test('GET /api/exercises should return exercises array', async () => {
    const response = await request(app)
      .get('/api/exercises')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/exercises should create a new exercise', async () => {
    const newExercise = {
      name: 'Test Exercise',
      category: 'Test',
      description: 'Test exercise description'
    };

    const response = await request(app)
      .post('/api/exercises')
      .send(newExercise)
      .expect(201);
    
    expect(response.body.name).toBe(newExercise.name);
    expect(response.body.category).toBe(newExercise.category);
  });
});

describe('Workouts API', () => {
  test('GET /api/workouts should return workouts array', async () => {
    const response = await request(app)
      .get('/api/workouts')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('Error Handling', () => {
  test('GET /api/nonexistent should return 404', async () => {
    await request(app)
      .get('/api/nonexistent')
      .expect(404);
  });
});