import mongoose from 'mongoose';
import supertest from 'supertest';
import { Ingestion } from '../model/ingestion.model';
import { User } from '../../user/model/user.model';
import app from '../../server';
import bcrypt from 'bcryptjs';

const request = supertest(app);

describe('Ingestion Management API', () => {
  let token: string;

  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/management-system';
    await mongoose.connect(mongoURI);
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password', 10);
    const adminUser = new User({ name: 'admin', email: 'admin@example.com', password: passwordHash, role: 'admin' });

    await adminUser.save();

    // Login all users
    const adminLogin = await request.post('/api/auth/login').send({ email: 'admin@example.com', password: 'password' });
    token = adminLogin.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Ingestion.deleteMany({});
  });

  it('should create a new ingestion job', async () => {
    const res = await request.post('/api/ingestions')
      .set('Authorization', `Bearer ${token}`)
      .send({ sourceType: 'file.csv' });

    expect(res.status).toBe(201);
    expect(res.body.ingestion).toBeDefined();
    expect(res.body.ingestion.sourceType).toBe('file.csv');
    expect(res.body.ingestion.status).toBe('pending');
  });

  it('should return all ingestion jobs', async () => {
    await Ingestion.create({ sourceType: 'a.csv' });
    await Ingestion.create({ sourceType: 'b.csv' });

    const res = await request.get('/api/ingestions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('should return ingestion job by ID', async () => {
    const job = await Ingestion.create({ sourceType: 'data.csv' });

    const res = await request.get(`/api/ingestions/${job._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.sourceType).toBe('data.csv');
  });

  it('should update ingestion status and logs', async () => {
    const job = await Ingestion.create({ sourceType: 'update.csv' });

    const res = await request.put(`/api/ingestions/${job._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed', logs: ['Job finished.'] });

    expect(res.status).toBe(200);
    expect(res.body.ingestion.status).toBe('completed');
    expect(res.body.ingestion.logs).toContain('Job finished.');
  });

  it('should delete an ingestion job', async () => {
    const job = await Ingestion.create({ sourceType: 'delete.csv' });

    const res = await request.delete(`/api/ingestions/${job._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Ingestion job deleted');
  });

  it('should return 404 for non-existent ingestion', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request.get(`/api/ingestions/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('should return 400 when required fields are missing', async () => {
    const res = await request.post('/api/ingestions')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });
});
