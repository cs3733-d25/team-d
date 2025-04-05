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
        if (typeof node1 === undefined || typeof node2 === undefined) {
            throw new Error(`Node ${name1} or Node ${name2} does not exist`);
        }
        else {
            // It is safe to ignore these warnings
            // becuase we have already established
            // above that they are not undefined

            // @ts-ignore
            node1.addNeighbor(node2);
            // @ts-ignore
            node2.addNeighbor(node2);
        }
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
}

