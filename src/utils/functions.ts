import { faker } from '@faker-js/faker';
import argon from 'argon2';
import GPSAreaSearch from 'src/models/equipment/dto/gpsArea.search';
import { v4 } from 'uuid';

const { PI, sin, cos, asin, atan2, sqrt } = Math;
const RAYON_TERRE = 6731.008;

function radToDeg(val: number): number {
  return (val * 180) / PI;
}

function degToRad(val: number): number {
  return (val * PI) / 180;
}

export function distanceEarthPointsGPSArea(gpsArea: GPSAreaSearch) {
  return distanceEarthPoints(
    gpsArea.minLatitude,
    gpsArea.minLongitude,
    gpsArea.maxLatitude,
    gpsArea.maxLongitude
  );
}

export function distanceEarthPoints(lat1: number, long1: number, lat2: number, long2: number) {
  // Convert the latitudes
  // and longitudes
  // from degree to radians.
  lat1 = degToRad(lat1);
  long1 = degToRad(long1);
  lat2 = degToRad(lat2);
  long2 = degToRad(long2);

  // Haversine Formula
  const dlong: number = long2 - long1;
  const dlat: number = lat2 - lat1;

  const sinDLat = sin(dlat / 2);
  const sinDLong = sin(dlong / 2);

  let res: number = sinDLat * sinDLat + cos(lat1) * cos(lat2) * sinDLong * sinDLong;

  res = 2 * asin(sqrt(res));

  // Calculate the result
  res = res * RAYON_TERRE;

  return res;
}

function getOffsetPos(lat: number, lon: number, dist: number, orient: number) {
  const lat1 = degToRad(lat);

  const lat2 = asin(
    sin(lat1) * cos(dist / RAYON_TERRE) + cos(lat1) * sin(dist / RAYON_TERRE) * cos(orient)
  );
  const lon2 =
    lon +
    radToDeg(
      atan2(
        sin(orient) * sin(dist / RAYON_TERRE) * cos(lat1),
        cos(dist / RAYON_TERRE) - sin(lat1) * sin(lat2)
      )
    );

  return {
    lat: Number(radToDeg(lat2).toFixed(7)),
    lon: Number(lon2.toFixed(7))
  };
}

// Create square area, lat lng is the center and 2*dist is the diagonal
export function getArea(lat: number, lon: number, distance: number): GPSAreaSearch {
  const max = getOffsetPos(lat, lon, distance, degToRad(45));
  const min = getOffsetPos(lat, lon, distance, degToRad(225));

  return {
    maxLatitude: max.lat,
    maxLongitude: max.lon,
    minLatitude: min.lat,
    minLongitude: min.lon
  };
}

export async function hashString(s: string): Promise<string> {
  return argon.hash(s);
}

export function randomBase64ID(): string {
  return Buffer.from(faker.datatype.uuid().replace('-', ''), 'hex').toString('base64url');
}

export function generateUUIDBuffer(): string {
  return Buffer.from(v4().replace(/-/g, ''), 'hex').toString('base64url');
}

export function isNotEmptyArray<T>(array?: Array<T>): array is Array<T> {
  return !!array && array.length > 0;
}
