import { describe, test, expect } from 'vitest';
import { Graph } from './bfs';
import type { Coordinates } from './constants';

const dummyCoord: Coordinates = { x: 0, y: 0 };

describe('Graph BFS', () => {
    test('BFS finds correct path between nodes', () => {
        const graph = new Graph();

        graph.addNode('A', dummyCoord);
        graph.addNode('B', dummyCoord);
        graph.addNode('C', dummyCoord);

        graph.addEdge('A', 'B');
        graph.addEdge('B', 'C');

        const path = graph.bfs('A', 'C');
        expect(path).toEqual(['A', 'B', 'C']);
    });
});
