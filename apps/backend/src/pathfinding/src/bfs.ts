import { Coordinates, NodePathResponse, NodePathResponseType } from 'common/src/constants.ts';
import { readFileSync } from 'fs';
import { PrismaClient } from 'database';
import { euclideanDistance } from './distance.ts';

// Search Strategy Interface
interface PathFindingStrategy {
    search(start: NodePathResponseType, end: number, graph: Graph): NodePathResponse[];
}

// BFS Implementation
class BFSStrategy implements PathFindingStrategy {
    search(
        startNodeType: NodePathResponseType,
        endNodeId: number,
        graph: Graph
    ): NodePathResponse[] {
        const endNode = graph.getNode(endNodeId);
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
    private pathFindingStrategy: PathFindingStrategy;

    constructor(strategy: PathFindingStrategy = new BFSStrategy()) {
        this.nodesMap = new Map();
        this.pathFindingStrategy = strategy;
    }

    // Method to change strategy at runtime
    setPathFindingStrategy(strategy: PathFindingStrategy): void {
        this.pathFindingStrategy = strategy;
    }

    addNode(data: NodePathResponse): void {
        if (!this.nodesMap.has(data.nodeId)) {
            const newNode = new GraphNode(data);
            this.nodesMap.set(data.nodeId, newNode);
        } else {
            throw new Error(`Node ${data.nodeId} already exists`);
        }
    }

    getNode(nodeId: number): GraphNode | undefined {
        return this.nodesMap.get(nodeId);
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

    search(startNodeType: NodePathResponseType, endNodeId: number): NodePathResponse[] {
        return this.pathFindingStrategy.search(startNodeType, endNodeId, this);
    }
}

export { Graph };
export type { PathFindingStrategy };
export { BFSStrategy };
