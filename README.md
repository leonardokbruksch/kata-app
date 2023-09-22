
---

# Truck Location Data API

A REST API for storing and retrieving truck GPS coordinates, mass data, and data timestamp.

### Setup & Deployment

1. Ensure you have AWS CDK installed and configured with appropriate AWS credentials.
2. Clone the repository.
3. Navigate to the project directory.
4. Install necessary dependencies:
   ```
   npm install
   ```
5. Build the project:
   ```
   npm run build
   ```
6. Deploy the API with the CDK:
   ```
   cdk deploy
   ```
7. Access the API using the generated endpoint after deployment.

### API Usage

#### Base URL:
`https://[your-api-id].execute-api.[your-region].amazonaws.com/prod`

#### Endpoints:

1. **POST `/location`**
   - Store truck GPS coordinates, mass data, and data timestamp with the truckId.
   - Body:
     ```json
     {
       "truckId": "string",
       "latitude": "number",
       "longitude": "number",
       "mass": "number",
       "timestamp": "number"
     }
     ```
   - Responses:
     - `201 Created`: Location added successfully.
     - `400 Bad Request`: Missing data.
     - `500 Internal Server Error`: Could not persist coordinates.

2. **GET `/location`**
   - Retrieve the 10 most recent datapoints.
   - Responses:
     - `200 OK`: Returns an array of recent data points.
     - `500 Internal Server Error`: Failed to fetch recent data.

3. **GET `/allTrucksLocations`**
   - Get the locations of all trucks.
   - Responses:
     - `200 OK`: Returns an array of all truck data points.
     - `500 Internal Server Error`: Failed to fetch recent data.

4. **GET `/truckLocation`**
   - Get the 10 most recent datapoints of a specific truck.
   - Query Params:
     - `truckId`: The unique identifier of the truck.
   - Responses:
     - `200 OK`: Returns an array of recent data points for the specified truck.
     - `400 Bad Request`: Missing data.
     - `500 Internal Server Error`: Failed to fetch recent data.

### Authentication

All endpoints require an API key for access. Include it in the request header as:

```
x-api-key: YOUR_API_KEY
```

Replace `YOUR_API_KEY` with the actual API key.

---
