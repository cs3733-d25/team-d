import type { Coordinates } from 'common/src/constants';

//  Calculates Euclidean distance between two coordinates.

export function euclideanDistance(a: Coordinates, b: Coordinates): number {
    const dx = b.lat - a.lat;
    const dy = b.lng - a.lng;
    return Math.sqrt(dx * dx + dy * dy);
}

//haversine formula
export function haversineDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
): number {
    const EARTH_RADIUS_METERS = 6371000;

    //degree to radian
    const lat1Rad = (coord1.lat * Math.PI) / 180;
    const lat2Rad = (coord2.lat * Math.PI) / 180;
    const deltaLatRad = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const deltaLngRad = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a =
        Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
        Math.cos(lat1Rad) *
            Math.cos(lat2Rad) *
            Math.sin(deltaLngRad / 2) *
            Math.sin(deltaLngRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = EARTH_RADIUS_METERS * c;

    return distance;
}
