export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface TruckData {
  coordinates: Coordinates;
  mass: number;
  timestamp: Date;
}

export default TruckData;
