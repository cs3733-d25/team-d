import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

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

router.get('/edges', async (req: Request, res: Response) => {
    const edges = await PrismaClient.edge.findMany();
    // if there are no edges found
    if (edges == null) {
        console.error('No nodes found in database');
        res.sendStatus(204);
    } else {
        console.log(edges); // display edge data to console
        res.json(edges);
    }
});

export default router;
