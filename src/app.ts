import express, { Express, Request, Response } from 'express';
import TruckData from './interface';

const app = express();

app.use(express.json());

app.get('/', (request: Request, response: Response) => {
  response.send('Hello from Express on AWS Lambda!');
});

app.post('/location', (request: Request, response: Response) => {
  const { latitude, longitude, mass, timestamp } = request.body;

  if (!latitude || !longitude || !mass || !timestamp) {
    return response.status(400).send({ message: 'Missing data!' });
  }

  const location: TruckData = {
    coordinates: {
      latitude: latitude,
      longitude: longitude,
    },
    mass: mass,
    timestamp: new Date(timestamp),
  };

  return response.status(201).send({ message: 'Location added successfully!' });
});

app.get('/location', (request: Request, response: Response) => {
  const recentData = {};
  response.status(200).send(recentData);
});

export default app;
