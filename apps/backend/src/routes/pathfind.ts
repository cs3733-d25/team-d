import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

import { Graph } from 'common/src/bfs.ts';
import { Coordinates } from 'common/src/constants.ts';

router.get('/', async (req: Request, res: Response) => {
    const graph = new Graph();
    graph.loadNodesFromCSV('../database/nodes.csv');
    graph.loadEdgesFromCSV('../database/edges.csv');
    const coords = graph.bfs('n1', 'desk');
    res.json(coords || []);
});

export default router;
