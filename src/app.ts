import express, { Express, NextFunction, Request, Response } from 'express';
import TruckData from './interface';
import AWS, { DynamoDB } from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient();
const app = express();

const TABLE_NAME: string = 'LocationTable';
const SECONDARY_INDEX: string = 'gpsData';

app.use(express.json());

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(error.stack);
    response.status(500).send('Something broke!');
  }
);

app.get('/', (request: Request, response: Response) => {
  response.send('Hello from Express on AWS Lambda!');
});

app.post('/location', async (request: Request, response: Response) => {
  const { truckId, latitude, longitude, mass, timestamp } = request.body;

  if (!truckId || !latitude || !longitude || !mass || !timestamp) {
    return response.status(400).send({ message: 'Missing data!' });
  }

  try {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'truckId = :truckIdValue',
      ExpressionAttributeValues: {
        ':truckIdValue': truckId,
      },
      Limit: 1,
      ScanIndexForward: false,
    };

    const recentLocations = await db.query(params).promise();

    if (
      recentLocations.Items &&
      recentLocations.Items.length &&
      recentLocations.Items[0].coordinates.latitude === latitude &&
      recentLocations.Items[0].coordinates.longitude === longitude
    ) {
      const idleDuration: number =
        timestamp - recentLocations.Items[0].timestamp;

      return response.status(200).send({
        message:
          'Location unchanged. Data not saved. Truck has been idle for: ' +
          idleDuration +
          ' ms.',
      });
    }

    const location: TruckData = {
      truckId: truckId,
      timestamp: timestamp,
      coordinates: {
        latitude: latitude,
        longitude: longitude,
      },
      mass: mass,
      gpsData: SECONDARY_INDEX,
    };

    await db
      .put({
        TableName: TABLE_NAME,
        Item: location,
      })
      .promise();

    return response
      .status(201)
      .send({ message: 'Location added successfully!' });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ message: 'Could not persist coordinates.' });
  }
});

app.get('/location', async (request: Request, response: Response) => {
  try {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: TABLE_NAME,
      IndexName: 'Timestamp-Index',
      KeyConditionExpression: 'gpsData = :gpsDataValue',
      ExpressionAttributeValues: {
        ':gpsDataValue': SECONDARY_INDEX,
      },
      Limit: 10,
      ScanIndexForward: false,
    };

    const result = await db.query(params).promise();

    return response.status(200).send(result.Items);
  } catch (error) {
    console.error(error);
    return response.status(500).send('Failed to fetch recent data.');
  }
});

app.get('/allTrucksLocations', async (request: Request, response: Response) => {
  try {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: TABLE_NAME,
    };

    const result = await db.scan(params).promise();

    return response.status(200).send(result.Items);
  } catch (error) {
    console.error(error);
    return response.status(500).send('Failed to fetch recent data.');
  }
});

app.get('/truckLocation', async (request: Request, response: Response) => {
  const truckId = request.query.truckId as string;

  if (!truckId) {
    return response.status(400).send({ message: 'Missing data!' });
  }

  try {
    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'truckId = :truckIdValue',
      ExpressionAttributeValues: {
        ':truckIdValue': truckId,
      },
      Limit: 10,
      ScanIndexForward: false,
    };

    const result = await db.query(params).promise();

    return response.status(200).send(result.Items);
  } catch (error) {
    console.error(error);
    return response.status(500).send('Failed to fetch recent data.');
  }
});

export default app;
