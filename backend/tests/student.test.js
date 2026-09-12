const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB, clearDB } = require('./testHelper');
const { generateToken } = require('../src/utils/generateToken');

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await disconnectDB());

describe('Student Endpoints', () => {
  let adminToken;
  
  beforeAll(() => {
    // We assume generateToken returns a valid token for our mocked admin
    adminToken = generateToken({ id: 'someId', role: 'ADMIN' });
  });

  it('should create a new student', async () => {
    const res = await request(app)
      .post('/api/v1/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        rollNumber: '101',
        firstName: 'Alice',
        lastName: 'Smith',
        gradeClass: '10',
        section: 'A',
        dob: '2010-01-01',
        gender: 'FEMALE'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.rollNumber).toBe('101');
  });

  it('should validate mandatory fields', async () => {
    const res = await request(app)
      .post('/api/v1/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({}); // Missing fields
    
    expect(res.status).toBe(500); // Because mongoose validation fails
  });
});
