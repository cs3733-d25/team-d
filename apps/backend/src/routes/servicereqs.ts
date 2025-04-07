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


// Return a translator request with specified id
router.get('/:id', async function (req: Request, res: Response) {
    // Parse the id param into a variable
    const requestId: number = Number(req.params.id);
    // Find the employee with the id
    const request = await PrismaClient.translatorRequest.findUnique({
        where: { requestId: requestId },
    });

    // If no employee with the ID is found, send 204 and log it
    if (request == null) {
        console.error(`The request with ${requestId} not found in database!`);
        res.sendStatus(204);
    }
    // Otherwise send 200 and the data
    else {
        console.log(request);
        res.json(request);
    }
});

export default router;
