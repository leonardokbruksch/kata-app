import supertest from 'supertest';
import app from '../src/app';

describe('API Endpoints', () => {
  const request = supertest(app);

  it('should return a 404 status for non-existent endpoints', async () => {
    const response = await request.get('/fakeEndpoint');
    expect(response.status).toBe(404);
  });

  it('should return a 400 status on POST /location without body', async () => {
    const response = await request.post('/location');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Missing data!',
    });
  });

  it('should return a 400 status on POST /location with wrong body', async () => {
    const jsonBody = {
      wrongBodyData: 'someData',
    };

    const response = await request.post('/location').send(jsonBody);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Missing data!',
    });
  });

  it('should return a 201 CREATED status on POST /location with correct body', async () => {
    const location = {
      latitude: 1233,
      longitude: 23423,
      mass: 2341,
      timestamp: new Date(),
    };

    const response = await request.post('/location').send(location);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Location added successfully!',
    });
  });

  it('should return a 400 status on POST /location with empty body', async () => {
    const location = {
      latitude: 0,
      longitude: 0,
      mass: 0,
      timestamp: 0,
    };

    const response = await request.post('/location').send(location);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Missing data!',
    });
  });

  it('should return a 200 status on GET /location', async () => {
    const response = await request.get('/location');
    expect(response.status).toBe(200);
  });
});
