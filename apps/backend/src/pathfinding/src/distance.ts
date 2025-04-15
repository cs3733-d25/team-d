import type { Coordinates } from 'common/src/constants';

//Calculates Euclidean distance between two coordinates.

export function euclideanDistance(a: Coordinates, b: Coordinates): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}
