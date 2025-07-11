import express, { Router, Request, Response } from 'express';
import fs from 'fs';

const router: Router = express.Router();

import PrismaClient from '../bin/prisma-client';
import {
    EditorFloorGraph,
    EditorParkingGraph,
    EditorGraph,
    EditorNode,
    EditorEdges,
} from 'common/src/constants.ts';

router.get('/', async (req: Request, res: Response) => {
    const data = await PrismaClient.graph.findMany({
        include: {
            Nodes: {},
            Edges: {},
            FloorGraph: {},
            ParkingGraph: {},
        },
    });

    res.json(data as EditorGraph[]);
});

router.put('/', async (req: Request, res: Response) => {
    const data = req.body as EditorGraph[];
    const oldNodes = await PrismaClient.node.findMany({});
    const oldEdges = await PrismaClient.edge.findMany({});

    await PrismaClient.edge.deleteMany({});
    await PrismaClient.node.deleteMany({});

    const newNodes: EditorNode[] = [];
    const newEdges: EditorEdges[] = [];

    let nodesMessage = '';
    let edgesMessage = '';

    data.forEach((graph) => {
        graph.Nodes.forEach((node) => {
            newNodes.push(node);
            nodesMessage += `{\n\tnodeId: ${node.nodeId},\n\tname: '${node.name}',\n\tlat: ${node.lat},\n\tlng: ${node.lng},\n\ttype: '${node.type}',\n\tgraphId: ${node.graphId},${node.connectedNodeId ? `\n\tconnectedNodeId: ${node.connectedNodeId},` : ''}\n},\n`;
        });
        graph.Edges.forEach((edge) => {
            newEdges.push(edge);
            edgesMessage += `{\n\tedgeId: ${edge.edgeId},\n\tname: '${edge.name}',\n\tstartNodeId: ${edge.startNodeId},\n\tendNodeId: ${edge.endNodeId},\n\tgraphId: ${edge.graphId},\n},\n`;
        });
    });

    try {
        await PrismaClient.node.createMany({
            data: newNodes,
        });
        await PrismaClient.edge.createMany({
            data: newEdges,
        });
        // console.log(nodesMessage);
        // console.log(edgesMessage);

        fs.writeFile('nodes.txt', nodesMessage, (err) => {});
        fs.writeFile('edges.txt', edgesMessage, (err) => {});
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        console.log('Reverting...');
        await PrismaClient.edge.deleteMany({});
        await PrismaClient.node.deleteMany({});

        await PrismaClient.node.createMany({
            data: oldNodes,
        });
        await PrismaClient.edge.createMany({
            data: oldEdges,
        });
        res.sendStatus(400);
    }
});

router.get('/', async (req: Request, res: Response) => {
    const data = await PrismaClient.graph.findMany({
        include: {
            Nodes: {},
            Edges: {},
            FloorGraph: {},
            ParkingGraph: {},
        },
    });

    res.json(data as EditorGraph[]);
}); // GET request for all graphs
router.get('/editor/graphs', async (req: Request, res: Response) => {
    const data = await PrismaClient.graph.findMany({
        include: {
            Nodes: {},
            Edges: {},
            FloorGraph: {},
            ParkingGraph: {},
        },
    });
    if (data == null) {
        console.error('No graphs found in database');
        res.sendStatus(204);
    } else {
        console.log(data);
        res.json(data as EditorGraph[]);
    }
});

// GET request for all floor graphs
router.get('/editor/floor', async (req: Request, res: Response) => {
    const data = await PrismaClient.floorGraph.findMany({
        include: {
            Building: {},
            Graph: {},
        },
    });
    if (data == null) {
        console.error('No floor graphs found in database');
        res.sendStatus(204);
    } else {
        console.log(data);
        res.json(data as EditorFloorGraph[]);
    }
});

// GET request for all parking graphs
router.get('/editor/parking', async (req: Request, res: Response) => {
    const data = await PrismaClient.parkingGraph.findMany({
        include: {
            Hospital: {},
            Graph: {},
        },
    });
    if (data == null) {
        console.error('No parking graphs found in database');
        res.sendStatus(204);
    } else {
        console.log(data);
        res.json(data as EditorParkingGraph[]);
    }
});

// PUT request for graph with specific Id
router.put('/editor/graphs/:id', async function (req: Request, res: Response) {
    // parse id into variable
    const graphId: number = Number(req.params.id);

    // find graph with id
    const request = await PrismaClient.graph.findUnique({
        where: { graphId: graphId },
    });

    // error if no graph with the id is found
    if (request == null) {
        console.error(`The graph with Id ${graphId} not found in database!`);
        res.status(404);
    }
    // success: update specified graph
    else {
        try {
            const { graphType, FloorGraph, ParkingGraph, Nodes, Edges } = req.body;
            const [updateGraph] = await PrismaClient.$transaction([
                PrismaClient.graph.update({
                    where: { graphId: graphId },
                    data: {
                        graphType,
                        FloorGraph,
                        ParkingGraph,
                        Nodes,
                        Edges,
                    },
                }),
            ]);
            // send 200 and updated graph if success
            res.status(200).json({
                message: 'Successfully updated graph',
                updateGraph,
            });
            // send 400 and error message if graph be updated
        } catch (error) {
            console.error(`Unable to update graph ${graphId}: ${error}`);
            res.sendStatus(400);
        }
    }
});

// PUT request for floor graph with specific Id
router.put('/editor/floor/:id', async function (req: Request, res: Response) {
    // parse id into variable
    const graphId: number = Number(req.params.id);

    // find floor graph with id
    const request = await PrismaClient.floorGraph.findUnique({
        where: { graphId: graphId },
    });

    // error if no floor graph with the id is found
    if (request == null) {
        console.error(`The floor graph with Id ${graphId} not found in database!`);
        res.status(404);
    }
    // success: update specified floor graph
    else {
        try {
            const {
                floorNum,
                image,
                imageBoundsNorth,
                imageBoundsSouth,
                imageBoundsEast,
                imageBoundsWest,
                buildingId,
                Building,
                Departments,
            } = req.body;
            const [updateGraph] = await PrismaClient.$transaction([
                PrismaClient.floorGraph.update({
                    where: { graphId: graphId },
                    data: {
                        floorNum,
                        image,
                        imageBoundsNorth,
                        imageBoundsSouth,
                        imageBoundsEast,
                        imageBoundsWest,
                        buildingId,
                        Building,
                        Departments,
                    },
                }),
            ]);
            // send 200 and updated floor graph if success
            res.status(200).json({
                message: 'Successfully updated floor graph',
                updateGraph,
            });
            // send 400 and error message if floor graph cannot be updated
        } catch (error) {
            console.error(`Unable to update floor graph ${graphId}: ${error}`);
            res.sendStatus(400);
        }
    }
});

// PUT request for parking graph with specific Id
router.put('/editor/parking/:id', async function (req: Request, res: Response) {
    // parse id into variable
    const graphId: number = Number(req.params.id);

    // find parking graph with id
    const request = await PrismaClient.parkingGraph.findUnique({
        where: { graphId: graphId },
    });

    // error if no parking graph with the id is found
    if (request == null) {
        console.error(`The parking graph with Id ${graphId} not found in database!`);
        res.status(404);
    }
    // success: update specified parking graph
    else {
        try {
            const { Graph, Hospital, hospitalId } = req.body;
            const [updateGraph] = await PrismaClient.$transaction([
                PrismaClient.parkingGraph.update({
                    where: { graphId: graphId },
                    data: {
                        Graph,
                        Hospital,
                        hospitalId,
                    },
                }),
            ]);
            // send 200 and updated parking graph if success
            res.status(200).json({
                message: 'Successfully updated parking graph',
                updateGraph,
            });
            // send 400 and error message if parking graph cannot be updated
        } catch (error) {
            console.error(`Unable to update parking graph ${graphId}: ${error}`);
            res.sendStatus(400);
        }
    }
});

export default router;
