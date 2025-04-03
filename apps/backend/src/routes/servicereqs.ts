import express, { Router, Request, Response } from 'express';
import { Prisma } from 'database';
import PrismaClient from '../bin/prisma-client';

const router: Router = express.Router();

// handles a POST request
router.post('/', async function (req: Request, res: Response) {
    const serviceReqAttempt: Prisma.TranslatorRequestCreateInput = req.body;

    try {
        await PrismaClient.translatorRequest.create({ data: serviceReqAttempt });
        console.info('Successfully created service request'); // log success
    } catch (error) {
        console.error(`Unable to submit service request ${serviceReqAttempt}: ${error}`);
        res.sendStatus(400); // send error
        return;
    }

    res.sendStatus(200);
});


// TODO: handle a GET request
// Use router.get for a GET request, router.post for a POST request, etc.
// Refer to score.ts.
router.get('/', async function (req: Request, res: Response) {
    const requests = await PrismaClient.translatorRequest.findMany();
    console.log(requests);
    res.json(requests);
});

export default router;
