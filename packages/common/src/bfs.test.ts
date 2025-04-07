import { describe, test, expect } from 'vitest';
import { Graph } from './bfs';
import type { Coordinates } from './constants';

test('Graph BFS > BFS finds correct path between nodes', () => {
    const graph = new Graph();

    const A: Coordinates = { x: 0, y: 0 };
    const B: Coordinates = { x: 1, y: 0 };
    const C: Coordinates = { x: 2, y: 0 };

    graph.addNode('A', A);
    graph.addNode('B', B);
    graph.addNode('C', C);

    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');

    const path = graph.bfs('A', 'C');
    expect(path).toEqual([A, B, C]);
});
