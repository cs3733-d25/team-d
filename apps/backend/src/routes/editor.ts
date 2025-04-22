import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

import PrismaClient from '../bin/prisma-client';
import { EditorGraph } from 'common/src/constants.ts';

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

export default router;
