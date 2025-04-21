import { Coordinates, NodePathResponse, NodePathResponseType } from 'common/src/constants.ts';
import { readFileSync } from 'fs';
import { PrismaClient } from 'database';
import { euclideanDistance } from './distance.ts';

class GraphNode {
    private readonly neighbors: GraphNode[];
    readonly data: NodePathResponse;

    constructor(data: NodePathResponse) {
        this.neighbors = [];
        this.data = data;
    }

    addNeighbor(node: GraphNode): void {
        this.neighbors.push(node);
    }

    getNeighbors(): GraphNode[] {
        return this.neighbors;
    }
}

class Graph {
    private readonly nodesMap: Map<number, GraphNode>;

    constructor() {
        this.nodesMap = new Map();
    }

    addNode(data: NodePathResponse): void {
        if (!this.nodesMap.has(data.nodeId)) {
            const newNode = new GraphNode(data);
            this.nodesMap.set(data.nodeId, newNode);
        } else {
            throw new Error(`Node ${data.nodeId} already exists`);
        }
    }

    addEdge(id1: number, id2: number): void {
        const node1 = this.nodesMap.get(id1);
        const node2 = this.nodesMap.get(id2);
        if (!node1 || !node2) {
            throw new Error(`Node ${id2} or Node ${id2} does not exist`);
        } else {
            node1.addNeighbor(node2);
            node2.addNeighbor(node1);
        }
    }

    bfs(startNodeType: NodePathResponseType, endNodeId: number): NodePathResponse[] {
        const endNode = this.nodesMap.get(endNodeId);
        if (!endNode) {
            throw new Error(`Node ${endNodeId} not found`);
        }

        const visited = new Set<number>();
        const queue: { node: GraphNode; path: GraphNode[] }[] = [
            { node: endNode, path: [endNode] },
        ];

        while (queue.length > 0) {
            const { node, path } = queue.shift()!;
            if (node.data.type === startNodeType) {
                return path.map((node) => node.data).reverse();
            }
            visited.add(node.data.nodeId);
            for (const neighbor of node.getNeighbors()) {
                if (!visited.has(neighbor.data.nodeId)) {
                    queue.push({ node: neighbor, path: [...path, neighbor] });
                }
            }
        }
        return [];
    }
}

export { Graph };
