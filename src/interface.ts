export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface TruckData {
  truckId: string;
  coordinates: Coordinates;
  mass: number;
  timestamp: Date;
  gpsData: string;
}

export default TruckData;
