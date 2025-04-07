import {Coordinates} from "./constants.ts";

class Graph {
    private nodes: Map<string, GraphNode>;

    constructor() {
        this.nodes = new Map();
    }

    addNode(name: string, coords: Coordinates): void {
        if (!this.nodes.has(name)) {
            this.nodes.set(name, new GraphNode(name, coords));
        }
        else {
            throw new Error(`Node ${name} already exists`);
        }
    }

    addEdge(name1: string, name2: string): void {
        const node1 = this.nodes.get(name1);
        const node2 = this.nodes.get(name2);
        if (node1 === undefined || node2 === undefined) {
            throw new Error(`Node ${name1} or Node ${name2} does not exist`);
        }
        else {
            // It is safe to ignore these warnings
            // because we have already established
            // above that they are not undefined

            // @ts-ignore
            node1.addNeighbor(node2);
            // @ts-ignore
            node2.addNeighbor(node1);
        }
    }


    bfs(start: string, goal: string): string[] | null {
        const startNode = this.nodes.get(start);
        const goalNode = this.nodes.get(goal);

        if (!startNode || !goalNode) {
            throw new Error("Start or goal node does not exist.");
        }

        const visited = new Set<string>();
        const queue: { node: GraphNode; path: string[] }[] = [{ node: startNode, path: [start] }];

        while (queue.length > 0) {
            const { node, path } = queue.shift()!;
            if (node.name === goal) {
                return path;
            }

            visited.add(node.name);

            for (const neighbor of node.getNeighbors()) {
                if (!visited.has(neighbor.name)) {
                    queue.push({ node: neighbor, path: [...path, neighbor.name] });
                }
            }
        }

        return null; // No path found
    }

}

class GraphNode {
    private neighbors : GraphNode[];
    name: string;
    coords: Coordinates;

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

export { Graph };
