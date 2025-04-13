import { Coordinates } from 'common/src/constants.ts';
import { readFileSync } from 'fs';
import { PrismaClient } from 'database';

class GraphNode {
    private neighbors: GraphNode[];
    public name: string;
    public coords: Coordinates;

    constructor(name: string, coords: Coordinates) {
        this.neighbors = [];
        this.name = name;
        this.coords = coords;
        this.makeNode().then();
    }
    //creates a Node data entry in the Node database
    public async makeNode(): Promise<any> {
        const prisma = new PrismaClient();
        try {
            const node = await prisma.node.create({
                data: {
                    name: this.name,
                    xCoord: this.coords.x,
                    yCoord: this.coords.y,
                },
            });
            console.log('New node created');
            return node;
        } catch (e) {
            console.error(e);
        } finally {
            await prisma.$disconnect();
        }
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
        this.makeEdge(name1, name2).then();
    }

    //creates a Node data entry in the Node database
    public async makeEdge(startName: string, endName: string): Promise<any> {
        const prisma = new PrismaClient();
        const startNode = await prisma.node.findFirst({
            where: { name: startName },
        });
        const endNode = await prisma.node.findFirst({
            where: { name: endName },
        });
        // If no node with the name is found, send 204 and log it
        if (startNode == null || endNode == null) {
            console.error(`The node with name ${startName} or ${endName} not found in database!`);
            await prisma.$disconnect();
            return null;
        } else {
            const startNodeId = startNode?.nodeId;
            const endNodeId = endNode?.nodeId;
            try {
                const edge = await prisma.edge.create({
                    data: {
                        weight: 1,
                        startNodeId: startNodeId,
                        endNodeId: endNodeId,
                    },
                });
                console.log('New edge created');
                return edge;
            } catch (e) {
                console.error(e);
            } finally {
                await prisma.$disconnect();
            }
        }
    }

    loadNodesFromCSV(filePath: string): void {
        const csvContent = readFileSync(filePath, { encoding: 'utf8' });
        const lines = csvContent.split('\n');
        lines.shift();

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed) {
                const [nodeName, xCoord, yCoord] = trimmed.split(',');
                const coords: Coordinates = { x: parseFloat(xCoord), y: parseFloat(yCoord) };
                this.addNode(nodeName, coords);
                console.log(`Node ${nodeName} loaded`);
            }
        });
    }

    loadEdgesFromCSV(filePath: string): void {
        const csvContent = readFileSync(filePath, { encoding: 'utf8' });
        const lines = csvContent.split('\n');
        lines.shift(); //remove the header line

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed) {
                const [sourceNode, targetNode] = trimmed.split(',');
                this.addEdge(sourceNode, targetNode);
                console.log(`Nodes ${sourceNode} and ${targetNode} connected`);
            }
        });
    }

    bfs(start: string, goal: string): Coordinates[] | null {
        const startNode = this.nodes.get(start);
        const goalNode = this.nodes.get(goal);

        if (!startNode || !goalNode) {
            return null;
        }

        const visited = new Set<string>();
        const queue: { node: GraphNode; path: Coordinates[] }[] = [
            { node: startNode, path: [startNode.coords] },
        ];

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

        return null; //if no path is found
    }
}

export { Graph };
