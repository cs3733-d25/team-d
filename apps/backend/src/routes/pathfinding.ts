import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';
import { Prisma } from 'database';
const router: Router = express.Router();

router.get('/nodes', async (req: Request, res: Response) => {
    const nodes = await PrismaClient.node.findMany();
    // if there are no nodes found
    if (nodes == null) {
        console.error('No nodes found in database');
        res.sendStatus(204);
    } else {
        console.log(nodes); // display node data to console
        res.json(nodes);
    }
});

router.post('/newNode', async (req: Request, res: Response) => {
    const nodeDataAttempt: Prisma.NodeCreateInput = req.body;
    try {
        await PrismaClient.node.create({ data: nodeDataAttempt });
        console.log('Node created');
    } catch (error) {
        console.error(`Unable to create a new node ${nodeDataAttempt}: ${error}`);
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});

router.get('/edges', async (req: Request, res: Response) => {
    const edges = await PrismaClient.edge.findMany();
    // if there are no edges found
    if (edges == null) {
        console.error('No edges found in database');
        res.sendStatus(204);
    } else {
        console.log(edges); // display edge data to console
        res.json(edges);
    }
});

router.post('/newEdge', async (req: Request, res: Response) => {
    const edgeDataAttempt: Prisma.EdgeCreateInput = req.body;
    try {
        await PrismaClient.edge.create({ data: edgeDataAttempt });
        console.log('Edge created');
    } catch (error) {
        console.error(`Unable to create a new edge ${edgeDataAttempt}: ${error}`);
        res.sendStatus(400);
        return;
    }
    res.sendStatus(200);
});

export default router;
