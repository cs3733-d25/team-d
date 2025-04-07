import { Coordinates } from "./constants.ts";
import { readFileSync } from "fs";

class GraphNode {
    private neighbors: GraphNode[];
    public name: string;
    public coords: Coordinates;

    constructor(name: string, coords: Coordinates) {
        this.neighbors = [];
        this.name = name;
        this.coords = coords;
    }

    addNeighbor(node: GraphNode): void {
        this.neighbors.push(node);
    }

    getNeighbors(): GraphNode[] {
        return this.neighbors;
    }
}

class Graph {
    private nodes: Map<string, GraphNode>;

    constructor() {
        this.nodes = new Map();
    }

    addNode(name: string, coords: Coordinates): void {
        if (!this.nodes.has(name)) {
            this.nodes.set(name, new GraphNode(name, coords));
        } else {
            throw new Error(`Node ${name} already exists`);
        }
    }

    addEdge(name1: string, name2: string): void {
        const node1 = this.nodes.get(name1);
        const node2 = this.nodes.get(name2);
        if (node1 === undefined || node2 === undefined) {
            throw new Error(`Node ${name1} or Node ${name2} does not exist`);
        } else {
            node1.addNeighbor(node2);
            node2.addNeighbor(node1);
        }
    }

    loadNodesFromCSV(filePath: string): void {
        const csvContent = readFileSync(filePath, { encoding: 'utf8' });
        const lines = csvContent.split('\n');
        lines.shift();

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed) {
                const [nodeName, xCoord, yCoord] = trimmed.split(',');
                const coords: Coordinates = { x: parseFloat(xCoord), y: parseFloat(yCoord) };
                this.addNode(nodeName, coords);
            }
        });
    }

    loadEdgesFromCSV(filePath: string): void {
        const csvContent = readFileSync(filePath, { encoding: 'utf8' });
        const lines = csvContent.split('\n');
        lines.shift(); //remove the header line

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed) {
                const [sourceNode, targetNode] = trimmed.split(',');
                this.addEdge(sourceNode, targetNode);
            }
        });
    }

    bfs(start: string, goal: string): Coordinates[] | null {
        const startNode = this.nodes.get(start);
        const goalNode = this.nodes.get(goal);

        if (!startNode || !goalNode) {
            throw new Error("Start or goal node does not exist.");
        }

        const visited = new Set<string>();
        const queue: { node: GraphNode; path: Coordinates[] }[] = [{ node: startNode, path: [startNode.coords] }];

        while (queue.length > 0) {
            const { node, path } = queue.shift()!;
            if (node.name === goal) {
                return path;
            }

            visited.add(node.name);

            for (const neighbor of node.getNeighbors()) {
                if (!visited.has(neighbor.name)) {
                    queue.push({ node: neighbor, path: [...path, neighbor.coords] });
                }
            }
        }

        return null;//if no path is found
    }

}

export { Graph };
