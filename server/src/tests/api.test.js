// test/api.test.js
import request from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';

let server;

beforeAll(async () => {
  server = app.listen(4002); // test port
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('Drone Survey System API Tests', () => {
  let droneId, missionId, reportId;

  // --- DRONE ---
  test('Create Drone', async () => {
    const res = await request(app).post('/api/v1/drone/create').send({
      name: 'Drone A',
      model: 'X1',
      batteryLevel: 100,
      status: 'available',
      location: { lat: 23.0225, lng: 72.5714 },
    });
    expect(res.statusCode).toBe(201);
    droneId = res.body.data._id;
  });

  test('List Drones', async () => {
    const res = await request(app).get('/api/v1/drone/list');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // --- MISSION ---
  test('Create Mission', async () => {
    const res = await request(app).post('/api/v1/mission/create').send({
      name: 'Survey Alpha',
      droneId,
      scheduledTime: new Date(),
      altitude: 120,
      flightPath: [
        { lat: 23.0225, lng: 72.5714 },
        { lat: 23.0230, lng: 72.5720 },
      ],
    });
    expect(res.statusCode).toBe(201);
    missionId = res.body.data._id;
  });

  test('List Missions', async () => {
    const res = await request(app).get('/api/v1/mission/list');
    expect(res.statusCode).toBe(200);
  });

  // --- REPORT ---
  test('List Reports', async () => {
    const res = await request(app).get('/api/v1/report/list');
    expect(res.statusCode).toBe(200);
  });

  // --- CLEANUP ---
  test('Delete Drone', async () => {
    const res = await request(app).delete(`/api/v1/drone/${droneId}`);
    expect(res.statusCode).toBe(200);
  });
});
