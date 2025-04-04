import express, { Router, Request, Response } from 'express';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

// Returns all translator requests, if any
router.get('/', async function (req: Request, res: Response) {
    // Query db, store response
    const requests = await PrismaClient.translatorRequest.findMany();
    // If no service requests are found, send 204 and log it
    if (requests == null) {
        console.error('No service requests found in database!');
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(requests);
        res.json(requests);
    }
});

export default router;
