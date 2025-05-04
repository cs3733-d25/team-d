import { Coordinates, NodePathResponse, NodePathResponseType } from 'common/src/constants.ts';
import { readFileSync } from 'fs';
import { PrismaClient } from 'database';
import { euclideanDistance, haversineDistance } from './distance.ts';
import { FloorPathResponse } from 'common/src/constants.ts';

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
        if (!endNode) return [];

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

// DFS Implementation
class DFSStrategy implements PathFindingStrategy {
    search(
        startNodeType: NodePathResponseType,
        endNodeId: number,
        graph: Graph
    ): NodePathResponse[] {
        const endNode = graph.getNode(endNodeId);
        if (!endNode) return [];

        const visited = new Set<number>();
        const stack: { node: GraphNode; path: GraphNode[] }[] = [
            { node: endNode, path: [endNode] },
        ];

        while (stack.length > 0) {
            const { node, path } = stack.pop()!;
            if (node.data.type === startNodeType) {
                return path.map((node) => node.data).reverse();
            }

            if (!visited.has(node.data.nodeId)) {
                visited.add(node.data.nodeId);
                for (const neighbor of node.getNeighbors()) {
                    if (!visited.has(neighbor.data.nodeId)) {
                        stack.push({ node: neighbor, path: [...path, neighbor] });
                    }
                }
            }
        }

        return [];
    }
}

class DijkstraStrategy implements PathFindingStrategy {
    search(
        startNodeType: NodePathResponseType,
        endNodeId: number,
        graph: Graph
    ): NodePathResponse[] {
        const endNode = graph.getNode(endNodeId);
        if (!endNode) return [];

        const queue: [number, GraphNode, GraphNode[]][] = [[0, endNode, [endNode]]];
        const visited = new Set<number>();
        const costs: Map<number, number> = new Map();
        costs.set(endNode.data.nodeId, 0);
        while (queue.length > 0) {
            queue.sort((a, b) => a[0] - b[0]);
            const [cost, node, path] = queue.shift()!;
            if (node.data.type === startNodeType) {
                return path.map((n) => n.data).reverse();
            }
            if (visited.has(node.data.nodeId)) continue;
            visited.add(node.data.nodeId);
            for (const neighbor of node.getNeighbors()) {
                if (visited.has(neighbor.data.nodeId)) continue;
                const edgeWeight = haversineDistance(
                    { lat: node.data.lat, lng: node.data.lng },
                    { lat: neighbor.data.lat, lng: neighbor.data.lng }
                );
                const newCost = cost + edgeWeight;

                if (
                    !costs.has(neighbor.data.nodeId) ||
                    newCost < costs.get(neighbor.data.nodeId)!
                ) {
                    costs.set(neighbor.data.nodeId, newCost);
                    queue.push([newCost, neighbor, [...path, neighbor]]);
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

    floorNum?: number;
    image?: string;
    imageBoundsNorth?: number;
    imageBoundsSouth?: number;
    imageBoundsEast?: number;
    imageBoundsWest?: number;
    imageRotation?: number;

    constructor(strategy: PathFindingStrategy) {
        this.nodesMap = new Map();
        this.pathFindingStrategy = strategy;
    }

    // Method to change strategy at runtime
    setPathFindingStrategy(strategy: PathFindingStrategy): void {
        this.pathFindingStrategy = strategy;
    }

    addNode(data: NodePathResponse): void {
        // console.log(data.nodeId);
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
        if (!node1) {
            throw new Error(`Node ${id1}does not exist`);
        } else if (!node2) {
            throw new Error(`Node ${id2}does not exist`);
        } else {
            node1.addNeighbor(node2);
            node2.addNeighbor(node1);
        }
    }

    search(startNodeType: NodePathResponseType, endNodeId: number): NodePathResponse[] {
        return this.pathFindingStrategy.search(startNodeType, endNodeId, this);
    }

    getNodesOfType(type: NodePathResponseType): NodePathResponse[] {
        const result: NodePathResponse[] = [];
        for (const node of this.nodesMap.values()) {
            if (node.data.type === type) result.push(node.data);
        }
        return result;
    }

    getNodeById(nodeId: number): NodePathResponse | undefined {
        return this.nodesMap.get(nodeId)?.data;
    }

    generateDirectionStepsFromNodes(path: NodePathResponse[]): string[] {
        if (path.length < 2) return ['Not enough points for directions'];

        const startNode = path[0];
        let startLabel = 'start';
        switch (startNode.type) {
            case 'PARKING':
                startLabel = 'Start at the parking lot';
                break;

            case 'DOOR':
                startLabel = 'Enter the building';
                break;

            case 'ELEVATOR':
                startLabel = 'Start at the elevator';
                break;

            case 'CHECKIN':
                startLabel = 'Start at the check-in area';
                break;

            default:
                startLabel = `Start at ${startNode.name ?? this.formatCoord(startNode)}`;
        }
        const steps: string[] = [startLabel];

        for (let i = 1; i < path.length - 1; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const next = path[i + 1];

            const v1 = {
                x: curr.lng - prev.lng,
                y: curr.lat - prev.lat,
            };
            const v2 = {
                x: next.lng - curr.lng,
                y: next.lat - curr.lat,
            };

            const angle = this.angleBetweenVectors(v1, v2);
            let direction: string;

            if (angle < 30) {
                direction = 'Continue straight';
            } else if (angle < 135) {
                const cross = v1.x * v2.y - v1.y * v2.x;
                direction = cross > 0 ? 'Turn left' : 'Turn right';
            } else {
                direction = 'Make a U-turn';
            }

            const label = curr.name || curr.type || this.formatCoord(curr);
            steps.push(`${direction}`);
        }

        const endNode = path[path.length - 1];
        let endLabel = 'your destination';

        switch (endNode.type) {
            case 'DOOR':
                endLabel = 'the building entrance';
                break;

            case 'CHECKIN':
                endLabel = 'the check-in area';
                break;

            case 'ELEVATOR':
                endLabel = 'the elevator';
                break;

            case 'PARKING':
                endLabel = 'the parking lot';
                break;

            default:
                endLabel = endNode.name ?? this.formatCoord(endNode);
        }
        steps.push(`Arrive at ${endLabel}`);

        return steps;
    }

    private angleBetweenVectors(
        v1: { x: number; y: number },
        v2: { x: number; y: number }
    ): number {
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

        const angleRad = Math.acos(dot / (mag1 * mag2));
        return angleRad * (180 / Math.PI);
    }

    private formatCoord(node: NodePathResponse): string {
        return `(${node.lat.toFixed(5)}, ${node.lng.toFixed(5)})`;
    }
}

export function createFloorPath(
    path: NodePathResponse[],
    graph: Graph,
    lat?: number,
    lng?: number
): FloorPathResponse {
    return {
        floorNum: graph.floorNum!,
        image: graph.image!,
        imageBoundsNorth: graph.imageBoundsNorth!,
        imageBoundsSouth: graph.imageBoundsSouth!,
        imageBoundsEast: graph.imageBoundsEast!,
        imageBoundsWest: graph.imageBoundsWest!,
        imageRotation: graph.imageRotation!,
        path,
        direction: graph.generateDirectionStepsFromNodes(path),
        lat,
        lng,
    };
}

export { Graph };
export type { PathFindingStrategy };
export { BFSStrategy };
export { DFSStrategy };
export { DijkstraStrategy };
