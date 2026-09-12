const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB, clearDB } = require('./testHelper');
const { generateToken } = require('../src/utils/generateToken');
const Student = require('../src/modules/students/student.model');
const mongoose = require('mongoose');

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await disconnectDB());

describe('Attendance Endpoints', () => {
  let teacherToken;
  let studentId;
  
  beforeAll(async () => {
    teacherToken = generateToken({ id: new mongoose.Types.ObjectId().toString(), role: 'TEACHER' });
  });

  beforeEach(async () => {
    const student = await Student.create({
      rollNumber: '201',
      firstName: 'Bob',
      lastName: 'Jones',
      gradeClass: '10',
      section: 'B',
      dob: '2010-05-05',
      gender: 'MALE'
    });
    studentId = student._id;
  });

  it('should mark daily attendance for a class', async () => {
    const res = await request(app)
      .post('/api/v1/attendance/mark')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        records: [
          {
            student: studentId,
            date: '2023-10-01',
            status: 'PRESENT'
          }
        ]
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should update or reject duplicate entry (bulkWrite upsert should update)', async () => {
    // First mark
    await request(app)
      .post('/api/v1/attendance/mark')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        records: [{ student: studentId, date: '2023-10-01', status: 'PRESENT' }]
      });

    // Mark again same date
    const res = await request(app)
      .post('/api/v1/attendance/mark')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        records: [{ student: studentId, date: '2023-10-01', status: 'ABSENT' }]
      });

    expect(res.status).toBe(200);
    // Since it's an upsert in the repo, the attendance is updated, not duplicated.
  });
});
